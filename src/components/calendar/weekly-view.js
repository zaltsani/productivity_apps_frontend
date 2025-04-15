import { useState } from "react";
import { dayNames, getWeekDays, hours } from "./utils";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Clock, Plus, X } from "lucide-react";

export default function WeeklyView ({ currentDate, selectedDate, setSelectedDate, events, refetch }) {
  const weekDays = getWeekDays(currentDate);
  // console.log("events", events[0].date_time.split("T")[1].split(':')[0])
  console.log("event time", events[0].date_time.slice(0, 13) + ':00')
  const [hourlyEvents, setHourlyEvents] = useState({'2025-02-23-01:00': ['test']});
  const [selectedHour, setSelectedHour] = useState('09:00');
  const [newHourlyEvent, setNewHourlyEvent] = useState('');


  return (
    <div className="space-y-4">
      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-8 border-b bg-gray-50">
          <div className="p-4 border-r font-medium text-gray-500" /> {/* Empty corner cell */}
          {weekDays.map((date, index) => (
            <div key={index} className="p-4 border-r last:border-r-0 text-center">
              <div className="font-semibold text-gray-700">{dayNames[date.getDay()]}</div>
              <div className="text-sm text-gray-500 mt-1">{date.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8">
          {/* Time Column */}
          <div className="border-r">
            {hours.map(hour => (
              <div 
                key={hour} 
                className="h-24 border-b last:border-b-0 flex items-center justify-end pr-4"
              >
                <span className="text-sm font-medium text-gray-500">{hour}</span>
              </div>
            ))}
          </div>

          {/* Days Columns */}
          {weekDays.map((date, dayIndex) => (
            <div key={dayIndex} className="border-r last:border-r-0">
              {hours.map(hour => {
                const timeKey = `${date.toISOString().split('T')[0]}T${hour}`;
                // console.log("timeKey", timeKey)
                // const eventsForHour = hourlyEvents[timeKey] || [];
                const eventsInHour = events.filter(e => e.date_time.slice(0, 13) + ':00' == timeKey)
                if (eventsInHour.length > 0) {
                  console.log("events hour", eventsInHour)
                }

                return (
                  <div
                    key={`${date}-${hour}`}
                    className="h-24 border-b last:border-b-0 p-2 group hover:bg-gray-50 transition-colors"
                  >
                    {/* Events */}
                    <div className="h-full overflow-y-auto space-y-1">
                      {eventsInHour.map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="bg-blue-50 border border-blue-100 p-2 rounded-md flex items-center justify-between text-sm"
                        >
                          <span className="truncate flex-1">{event.title}</span>
                          <button
                            onClick={() => removeHourlyEvent(date.toISOString().split('T')[0], hour, eventIndex)}
                            className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Event Button (shows on hover) */}
                    <button
                      onClick={() => {
                        setSelectedHour(hour);
                      }}
                      className="absolute bottom-1 right-1 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Form */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex space-x-2">
            <Select
              value={selectedHour}
              onValueChange={setSelectedHour}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {hours.map(hour => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={newHourlyEvent}
              onChange={(e) => setNewHourlyEvent(e.target.value)}
              placeholder="Add event"
              className="flex-1"
            />
            <Button onClick={() => addHourlyEvent(currentDate, selectedHour)}>
              <Clock className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};