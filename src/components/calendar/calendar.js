import { Input } from "../ui/input";

// Get days in month
const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday)
const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Generate calendar days
const generateDays = (currentDate) => {
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return days;
};

// Get week days
const getWeekDays = () => {
  const date = new Date(currentDate);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const addEvent = () => {
  if (selectedDate && newEvent.trim()) {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDate}`;
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent.trim()]
    }));
    setNewEvent('');
  }
};

const addTodo = (date) => {
  if (newTodo.trim()) {
    const dateKey = date.toISOString().split('T')[0];
    setTodos(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { text: newTodo.trim(), completed: false }]
    }));
    setNewTodo('');
  }
};

const toggleTodo = (date, todoIndex) => {
  const dateKey = date.toISOString().split('T')[0];
  setTodos(prev => ({
    ...prev,
    [dateKey]: prev[dateKey].map((todo, index) => 
      index === todoIndex ? { ...todo, completed: !todo.completed } : todo
    )
  }));
};

const removeTodo = (date, todoIndex) => {
  const dateKey = date.toISOString().split('T')[0];
  setTodos(prev => ({
    ...prev,
    [dateKey]: prev[dateKey].filter((_, index) => index !== todoIndex)
  }));
};

const removeEvent = (dateKey, eventIndex) => {
  setEvents(prev => ({
    ...prev,
    [dateKey]: prev[dateKey].filter((_, index) => index !== eventIndex)
  }));
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate array of hours for the day
const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

// Add hourly event
const addHourlyEvent = (date, hour) => {
  if (newHourlyEvent.trim()) {
    const dateKey = date.toISOString().split('T')[0];
    const timeKey = `${dateKey}-${hour}`;
    
    setHourlyEvents(prev => ({
      ...prev,
      [timeKey]: [...(prev[timeKey] || []), newHourlyEvent.trim()]
    }));
    setNewHourlyEvent('');
  }
};

// Remove hourly event
const removeHourlyEvent = (dateKey, hour, eventIndex) => {
  const timeKey = `${dateKey}-${hour}`;
  setHourlyEvents(prev => ({
    ...prev,
    [timeKey]: prev[timeKey].filter((_, index) => index !== eventIndex)
  }));
};

export const WeeklyView = () => {
  const weekDays = getWeekDays();
  
  return (
    <div className="space-y-4 overflow-auto">
      <div className="grid grid-cols-8 gap-4 min-w-[1000px]">
        {/* Time column */}
        <div className="border-r pt-14">
          {hours.map(hour => (
            <div key={hour} className="h-20 border-b text-sm text-gray-500 pr-2 text-right">
              {hour}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map((date, index) => (
          <div key={index} className="space-y-2">
            <div className="text-center font-semibold sticky top-0 bg-white p-2">
              {dayNames[date.getDay()]}
              <div className="text-sm text-gray-500">
                {date.getDate()}
              </div>
            </div>

            {/* Hourly slots */}
            {hours.map(hour => {
              const timeKey = `${date.toISOString().split('T')[0]}-${hour}`;
              const eventsForHour = hourlyEvents[timeKey] || [];

              return (
                <div
                  key={`${date}-${hour}`}
                  className="h-20 border rounded-lg p-1 text-xs overflow-y-auto bg-gray-50"
                >
                  {eventsForHour.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="bg-blue-100 p-1 mb-1 rounded flex items-center justify-between"
                    >
                      <span className="truncate">{event}</span>
                      <button
                        onClick={() => removeHourlyEvent(date.toISOString().split('T')[0], hour, eventIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Add event form */}
      <Card className="mt-4">
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

export const DailyView = () => {
  const dateKey = currentDate.toISOString().split('T')[0];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
        </h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Hourly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hours.map(hour => {
              const timeKey = `${dateKey}-${hour}`;
              const eventsForHour = hourlyEvents[timeKey] || [];

              return (
                <div key={hour} className="flex space-x-4">
                  <div className="w-20 text-gray-500 text-right pt-2">{hour}</div>
                  <div className="flex-1 min-h-16 border rounded-lg p-2 bg-gray-50">
                    {eventsForHour.map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="bg-blue-100 p-2 mb-2 rounded flex items-center justify-between"
                      >
                        <span>{event}</span>
                        <button
                          onClick={() => removeHourlyEvent(dateKey, hour, eventIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Event Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Event</CardTitle>
        </CardHeader>
        <CardContent>
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
              placeholder="Enter event"
              className="flex-1"
            />
            <Button onClick={() => addHourlyEvent(currentDate, selectedHour)}>
              <Clock className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todos[dateKey]?.map((todo, todoIndex) => (
              <div
                key={todoIndex}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
              >
                <button
                  onClick={() => toggleTodo(currentDate, todoIndex)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {todo.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => removeTodo(currentDate, todoIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Add new task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo(currentDate)}
              />
              <Button onClick={() => addTodo(currentDate)}>Add Task</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const MonthView = ({ currentDate, selectedDate, setSelectedDate, events }) => (
  <>
    <div className="grid grid-cols-7 gap-1 mb-4">
      {dayNames.map(day => (
        <div key={day} className="text-center font-semibold p-2">
          {day}
        </div>
      ))}
      {generateDays(currentDate).map((day, index) => {
        const dateKey = day ? `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}` : null;
        const hasEvents = dateKey && events[dateKey]?.length > 0;
        
        return (
          <div
            key={index}
            className={`
              p-2 min-h-16 border rounded-lg
              ${!day ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}
              ${selectedDate === day ? 'bg-blue-50 border-blue-200' : ''}
            `}
            onClick={() => day && setSelectedDate(day)}
          >
            {day && (
              <>
                <div className="font-medium">{day}</div>
                {hasEvents && (
                  <div className="mt-1">
                    {events[dateKey].map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className="text-xs bg-blue-100 p-1 mb-1 rounded flex items-center justify-between"
                      >
                        <span className="truncate">{event}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEvent(dateKey, eventIndex);
                          }}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>

    {selectedDate && (
      <div className="mt-4 space-y-2">
        <h3 className="font-medium">
          Add event for {monthNames[currentDate.getMonth()]} {selectedDate}
        </h3>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="Enter event"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addEvent()}
          />
          <Button onClick={addEvent}>
            <Calendar className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
    )}
  </>
);