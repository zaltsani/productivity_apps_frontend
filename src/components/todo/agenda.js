import { RiCalendarEventLine } from "@remixicon/react";
import { format, parseJSON } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function AgendaToDo({ data }) {
  data = data?.sort((a, b) => parseJSON(a?.date_time) - parseJSON(b?.date_time))
  const notFinishedEvents = data?.filter(e => e.status != 'finished')
  const dateEvents = []
  notFinishedEvents?.forEach(element => {
    const eventDate = format(parseJSON(element.date_time), 'eeee dd MMMM yyyy')
    if (!dateEvents.includes(eventDate)) dateEvents.push(eventDate)
  });
  console.log("data", data)

  return (
    <>
      {!(notFinishedEvents.length > 0) ? (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <RiCalendarEventLine size={32} className="text-muted-foreground/50 mb-2" />
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground">
            There are no events scheduled for this time period.
          </p>
        </div>
      ) : (
        <Card>
          {/* <CardHeader>
            <CardTitle>Agenda</CardTitle>
          </CardHeader> */}
          <CardContent>
            {dateEvents.map(day => {
              const dayEvents = notFinishedEvents.filter(e => format(parseJSON(e.date_time), 'eeee dd MMMM yyyy') === day)
              return (
                <div key={day.toString()} className="border-border/70 relative my-12 border-t">
                  <span
                    className="bg-background absolute -top-3 left-0 flex h-6 items-center pe-4 text-[10px] uppercase data-today:font-medium sm:pe-4 sm:text-xs"
                  >
                    {day}
                  </span>
                  <div className="mt-6 space-y-2">
                    {dayEvents.map(event => (
                      <div key={event.id}>
                        <button
                          className={`
                            focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:ring-[3px] data-past-event:line-through data-past-event:opacity-90
                            ${event.status === "not-started" && "bg-gray-200 shadow-gray-600"}
                            ${event.status === "in-progress" && "bg-blue-200 text-blue-800 dark:text-blue-400 shadow-blue-300"}
                          `}
                        >
                          <div className="text-sm font-medium">{event.title}</div>
                          <div className="text-xs opacity-70">Time: {format(parseJSON(event?.date_time), "h aa")}</div>
                          {event.description && (
                            <div className="my-1 text-xs opacity-90">{event.description}</div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </>
  )
}