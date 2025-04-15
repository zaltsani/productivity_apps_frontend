"use client";
import { createContext, useContext, useId, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { addMinutes, differenceInMinutes } from "date-fns"

import { EventItem } from "@/components/event-calendar";

// Create the context
const CalendarDndContext = createContext({
  activeEvent: null,
  activeId: null,
  activeView: null,
  currentTime: null,
  eventHeight: null,
  isMultiDay: false,
  multiDayWidth: null,
  dragHandlePosition: null,
})

// Hook to use the context
export const useCalendarDnd = () => useContext(CalendarDndContext)

export function CalendarDndProvider({
  children,
  onEventUpdate
}) {
  const [activeEvent, setActiveEvent] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [activeView, setActiveView] = useState(null)
  const [currentTime, setCurrentTime] = useState(null)
  const [eventHeight, setEventHeight] = useState(null)
  const [isMultiDay, setIsMultiDay] = useState(false)
  const [multiDayWidth, setMultiDayWidth] = useState(null)
  const [dragHandlePosition, setDragHandlePosition] = useState(null)

  // Store original event dimensions
  const eventDimensions = useRef({ height: 0 })

  // Configure sensors for better drag detection
  const sensors = useSensors(useSensor(MouseSensor, {
    // Require the mouse to move by 5px before activating
    activationConstraint: {
      distance: 5,
    },
  }), useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  }), useSensor(PointerSensor, {
    // Require the pointer to move by 5px before activating
    activationConstraint: {
      distance: 5,
    },
  }))

  // Generate a stable ID for the DndContext
  const dndContextId = useId()

  const handleDragStart = (event) => {
    const { active } = event

    // Add safety check for data.current
    if (!active.data.current) {
      console.error("Missing data in drag start event", event)
      return
    }

    const {
      event: calendarEvent,
      view,
      height,
      isMultiDay: eventIsMultiDay,
      multiDayWidth: eventMultiDayWidth,
      dragHandlePosition: eventDragHandlePosition,
    } = active.data.current

    setActiveEvent(calendarEvent)
    setActiveId(active.id)
    setActiveView(view)
    setCurrentTime(new Date(calendarEvent.start))
    setIsMultiDay(eventIsMultiDay || false)
    setMultiDayWidth(eventMultiDayWidth || null)
    setDragHandlePosition(eventDragHandlePosition || null)

    // Store event height if provided
    if (height) {
      eventDimensions.current.height = height
      setEventHeight(height)
    }
  }

  const handleDragOver = (event) => {
    const { over } = event

    if (over && activeEvent && over.data.current) {
      const { date, time } = over.data.current

      // Update time for week/day views
      if (time !== undefined && activeView !== "month") {
        const newTime = new Date(date)

        // Calculate hours and minutes with 15-minute precision
        const hours = Math.floor(time)
        const fractionalHour = time - hours

        // Map to nearest 15 minute interval (0, 0.25, 0.5, 0.75)
        let minutes = 0
        if (fractionalHour < 0.125) minutes = 0
        else if (fractionalHour < 0.375) minutes = 15
        else if (fractionalHour < 0.625) minutes = 30
        else minutes = 45

        newTime.setHours(hours, minutes, 0, 0)

        // Only update if time has changed
        if (
          !currentTime ||
          newTime.getHours() !== currentTime.getHours() ||
          newTime.getMinutes() !== currentTime.getMinutes() ||
          newTime.getDate() !== currentTime.getDate() ||
          newTime.getMonth() !== currentTime.getMonth() ||
          newTime.getFullYear() !== currentTime.getFullYear()
        ) {
          setCurrentTime(newTime)
        }
      } else if (activeView === "month") {
        // For month view, just update the date but preserve time
        const newTime = new Date(date)
        if (currentTime) {
          newTime.setHours(
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds(),
            currentTime.getMilliseconds()
          )
        }

        // Only update if date has changed
        if (
          !currentTime ||
          newTime.getDate() !== currentTime.getDate() ||
          newTime.getMonth() !== currentTime.getMonth() ||
          newTime.getFullYear() !== currentTime.getFullYear()
        ) {
          setCurrentTime(newTime)
        }
      }
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    // Add robust error checking
    if (!over || !activeEvent || !currentTime) {
      // Reset state and exit early
      setActiveEvent(null)
      setActiveId(null)
      setActiveView(null)
      setCurrentTime(null)
      setEventHeight(null)
      setIsMultiDay(false)
      setMultiDayWidth(null)
      setDragHandlePosition(null)
      return
    }

    try {
      // Safely access data with checks
      if (!active.data.current || !over.data.current) {
        throw new Error("Missing data in drag event")
      }

      const activeData = active.data.current
      const overData = over.data.current

      // Verify we have all required data
      if (!activeData.event || !overData.date) {
        throw new Error("Missing required event data")
      }

      const calendarEvent = activeData.event
      const date = overData.date
      const time = overData.time

      // Calculate new start time
      const newStart = new Date(date)

      // If time is provided (for week/day views), set the hours and minutes
      if (time !== undefined) {
        const hours = Math.floor(time)
        const fractionalHour = time - hours

        // Map to nearest 15 minute interval (0, 0.25, 0.5, 0.75)
        let minutes = 0
        if (fractionalHour < 0.125) minutes = 0
        else if (fractionalHour < 0.375) minutes = 15
        else if (fractionalHour < 0.625) minutes = 30
        else minutes = 45

        newStart.setHours(hours, minutes, 0, 0)
      } else {
        // For month view, preserve the original time from currentTime
        newStart.setHours(
          currentTime.getHours(),
          currentTime.getMinutes(),
          currentTime.getSeconds(),
          currentTime.getMilliseconds()
        )
      }

      // Calculate new end time based on the original duration
      const originalStart = new Date(calendarEvent.start)
      const originalEnd = new Date(calendarEvent.end)
      const durationMinutes = differenceInMinutes(originalEnd, originalStart)
      const newEnd = addMinutes(newStart, durationMinutes)

      // Only update if the start time has actually changed
      const hasStartTimeChanged =
        originalStart.getFullYear() !== newStart.getFullYear() ||
        originalStart.getMonth() !== newStart.getMonth() ||
        originalStart.getDate() !== newStart.getDate() ||
        originalStart.getHours() !== newStart.getHours() ||
        originalStart.getMinutes() !== newStart.getMinutes()

      if (hasStartTimeChanged) {
        // Update the event only if the time has changed
        onEventUpdate({
          ...calendarEvent,
          start: newStart,
          end: newEnd,
        })
      }
    } catch (error) {
      console.error("Error in drag end handler:", error)
    } finally {
      // Always reset state
      setActiveEvent(null)
      setActiveId(null)
      setActiveView(null)
      setCurrentTime(null)
      setEventHeight(null)
      setIsMultiDay(false)
      setMultiDayWidth(null)
      setDragHandlePosition(null)
    }
  }

  return (
    (<DndContext
      id={dndContextId}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <CalendarDndContext.Provider
        value={{
          activeEvent,
          activeId,
          activeView,
          currentTime,
          eventHeight,
          isMultiDay,
          multiDayWidth,
          dragHandlePosition,
        }}>
        {children}

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeEvent && activeView && (
            <div
              style={{
                height: eventHeight ? `${eventHeight}px` : "auto",
                width:
                  isMultiDay && multiDayWidth ? `${multiDayWidth}%` : "100%",
                // Remove the transform that was causing the shift
              }}>
              <EventItem
                event={activeEvent}
                view={activeView}
                isDragging={true}
                showTime={activeView !== "month"}
                currentTime={currentTime || undefined}
                isFirstDay={dragHandlePosition?.data?.isFirstDay !== false}
                isLastDay={dragHandlePosition?.data?.isLastDay !== false} />
            </div>
          )}
        </DragOverlay>
      </CalendarDndContext.Provider>
    </DndContext>)
  );
}
