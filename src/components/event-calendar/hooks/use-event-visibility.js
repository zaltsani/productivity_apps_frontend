"use client";
import { useLayoutEffect, useMemo, useRef, useState } from "react"

/**
 * Hook for calculating event visibility based on container height
 * Uses ResizeObserver for efficient updates
 */
export function useEventVisibility(
  {
    eventHeight,
    eventGap
  }
) {
  // Use the standard pattern for React refs
  const contentRef = useRef(null)
  const observerRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(null)

  // Use layout effect for synchronous measurement before paint
  useLayoutEffect(() => {
    if (!contentRef.current) return

    // Function to update the content height
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.clientHeight)
      }
    }

    // Initial measurement (synchronous)
    updateHeight()

    // Create observer only once and reuse it
    if (!observerRef.current) {
      observerRef.current = new ResizeObserver(() => {
        // Just call updateHeight when resize is detected
        updateHeight()
      })
    }

    // Start observing the content container
    observerRef.current.observe(contentRef.current)

    // Clean up function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    };
  }, [])

  // Function to calculate visible events for a cell
  const getVisibleEventCount = useMemo(() => {
    return totalEvents => {
      if (!contentHeight) return totalEvents

      // Calculate how many events can fit in the container
      const maxEvents = Math.floor(contentHeight / (eventHeight + eventGap))

      // If all events fit, show them all
      if (totalEvents <= maxEvents) {
        return totalEvents
      } else {
        // Otherwise, reserve space for "more" button by showing one less
        return maxEvents > 0 ? maxEvents - 1 : 0
      }
    };
  }, [contentHeight, eventHeight, eventGap])

  // Use type assertion to satisfy TypeScript
  return {
    contentRef,
    contentHeight,
    getVisibleEventCount
  };
}
