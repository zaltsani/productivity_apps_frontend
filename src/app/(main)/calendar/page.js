"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Header from '@/components/headers';
import MonthlyView from '@/components/calendar/monthly-view';
import WeeklyView from '@/components/calendar/weekly-view';
import DailyView from '@/components/calendar/dailyView';
import { dayNames, monthNames } from '@/components/calendar/utils';
import { useQuery } from 'react-query';
import { fetchTodoList } from '@/lib/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import MonthYearPicker from '@/components/calendar/month-year-picker';
import { AddTodoItem } from '@/components/calendar/add-item';
import { DatePicker } from '@/components/ui/date-picker';
import { addDays, setHours, setMinutes, subDays } from 'date-fns';
// import { EventCalendar } from '@/components/event-calendar/event-calendar';
import AgendaToDo from '@/components/todo/agenda';

const sampleEvents = [
  {
    id: "1",
    title: "Annual Planning",
    description: "Strategic planning for next year",
    start: subDays(new Date(), 24), // 24 days before today
    end: subDays(new Date(), 23), // 23 days before today
    allDay: true,
    color: "sky",
    location: "Main Conference Hall",
  },
  {
    id: "2",
    title: "Project Deadline",
    description: "Submit final deliverables",
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0), // 1:00 PM, 9 days before
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days before
    color: "amber",
    location: "Office",
  },
  {
    id: "3",
    title: "Quarterly Budget Review",
    description: "Strategic planning for next year",
    start: subDays(new Date(), 13), // 13 days before today
    end: subDays(new Date(), 13), // 13 days before today
    allDay: true,
    color: "orange",
    location: "Main Conference Hall",
  },
  {
    id: "4",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(new Date(), 10), 0), // 10:00 AM today
    end: setMinutes(setHours(new Date(), 11), 0), // 11:00 AM today
    color: "sky",
    location: "Conference Room A",
  },
  {
    id: "5",
    title: "Lunch with Client",
    description: "Discuss new project requirements",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0), // 12:00 PM, 1 day from now
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15), // 1:15 PM, 1 day from now
    color: "emerald",
    location: "Downtown Cafe",
  },
  {
    id: "6",
    title: "Product Launch",
    description: "New product release",
    start: addDays(new Date(), 3), // 3 days from now
    end: addDays(new Date(), 6), // 6 days from now
    allDay: true,
    color: "violet",
  },
  {
    id: "7",
    title: "Sales Conference",
    description: "Discuss about new clients",
    start: setMinutes(setHours(addDays(new Date(), 4), 14), 30), // 2:30 PM, 4 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 14), 45), // 2:45 PM, 5 days from now
    color: "rose",
    location: "Downtown Cafe",
  },
  {
    id: "8",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0), // 9:00 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 30), // 10:30 AM, 5 days from now
    color: "orange",
    location: "Conference Room A",
  },
  {
    id: "9",
    title: "Review contracts",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0), // 2:00 PM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 15), 30), // 3:30 PM, 5 days from now
    color: "sky",
    location: "Conference Room A",
  },
  {
    id: "10",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45), // 9:45 AM, 5 days from now
    end: setMinutes(setHours(addDays(new Date(), 5), 11), 0), // 11:00 AM, 5 days from now
    color: "amber",
    location: "Conference Room A",
  },
  {
    id: "11",
    title: "Marketing Strategy Session",
    description: "Quarterly marketing planning",
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0), // 10:00 AM, 9 days from now
    end: setMinutes(setHours(addDays(new Date(), 9), 15), 30), // 3:30 PM, 9 days from now
    color: "emerald",
    location: "Marketing Department",
  },
  {
    id: "12",
    title: "Annual Shareholders Meeting",
    description: "Presentation of yearly results",
    start: addDays(new Date(), 17), // 17 days from now
    end: addDays(new Date(), 17), // 17 days from now
    allDay: true,
    color: "sky",
    location: "Grand Conference Center",
  },
  {
    id: "13",
    title: "Product Development Workshop",
    description: "Brainstorming for new features",
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0), // 9:00 AM, 26 days from now
    end: setMinutes(setHours(addDays(new Date(), 27), 17), 0), // 5:00 PM, 27 days from now
    color: "rose",
    location: "Innovation Lab",
  },
]

export default function Page () {
  const listBreadcrumb = [ { title: "Calendar", url: "/calendar" } ]

  let { data, refetch, isLoading } = useQuery(
    ["task"],
    fetchTodoList,
    {refetchOnWindowFocus: false, refetchOnMount: false, refetchOnReconnect: false, enabled: true},
  )

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const isMobile = useIsMobile()

  const [events, setEvents] = useState(sampleEvents)

  const handleEventAdd = (event) => {
    setEvents([...events, event])
  }

  const handleEventUpdate = (updatedEvent) => {
    console.log("Updated Event", updatedEvent)
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    )
  }

  const handleEventDelete = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  return (
    <div className="w-full">
      <Header listBreadcrumb={listBreadcrumb} />
      <Card className="border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Popover>
            <PopoverTrigger asChild>
              <div className="cursor-pointer text-xl sm:text-2xl font-bold">{view === "day" && `${dayNames[currentDate.getDay()]}, `}{monthNames[currentDate.getMonth()]}{view === "day" && ` ${currentDate.getDate()} -`} {currentDate.getFullYear()}</div>
            </PopoverTrigger>
            <PopoverContent align="start" className='pt-0 w-full bg-transparent border-0 shadow-none'>
              {view === "month" ? 
                <MonthYearPicker date={currentDate} setDate={setCurrentDate} /> :
                <DatePicker
                  mode="single"
                  selected={currentDate}
                  onSelect={setCurrentDate}
                  className="rounded-md border shadow"
                />
              }
            </PopoverContent>
          </Popover>
          <div className="isolate flex -space-x-px">
            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              className="rounded-r-none"
              onClick={() => {
                const newDate = new Date(currentDate);
                if (view === 'month') {
                  newDate.setMonth(newDate.getMonth() - 1);
                } else if (view === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setDate(newDate.getDate() - 1);
                }
                setCurrentDate(newDate);
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size={isMobile ? 'sm' : 'default'}
              className="rounded-l-none"
              onClick={() => {
                const newDate = new Date(currentDate);
                if (view === 'month') {
                  newDate.setMonth(newDate.getMonth() + 1);
                } else if (view === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setDate(newDate.getDate() + 1);
                }
                setCurrentDate(newDate);
              }}
            >
              Next
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between items-center py-4'>
            <Tabs value={view} onValueChange={setView} className="">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                {/* <TabsTrigger value="week">Week</TabsTrigger> */}
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
              </TabsList>
            </Tabs>
            <AddTodoItem currentDate={currentDate} refetch={refetch} />
          </div>
          <div className={`transition-opacity duration-500 opacity-${view === 'month' ? 100 : '0'}`}>
            {view === 'month' && <MonthlyView currentDate={currentDate} setCurrentDate={setCurrentDate} events={data} refetchTodo={refetch} isLoading={isLoading} />}
          </div>
          <div className={`transition-opacity duration-500 opacity-${view === 'day' ? 100 : '0'}`}>
            {view === 'day' && <DailyView currentDate={currentDate} setCurrentDate={setCurrentDate} data={data} refetch={refetch} isLoading={isLoading} />}
          </div>
          <div className={`transition-opacity duration-500 opacity-${view === 'agenda' ? 100 : '0'}`}>
            {view === 'agenda' && !isLoading && <AgendaToDo data={data} />}
          </div>
          {/* <EventCalendar
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
          /> */}
        </CardContent>
      </Card>
    </div>
  );
};