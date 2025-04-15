// Get days in month
export const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

// Get first day of month (0 = Sunday)
export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Generate calendar days
export const generateDays = (currentDate) => {
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
export const getWeekDays = (currentDate) => {
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

export const addEvent = ({ selectedDate, newEvent, currentDate, setNewEvent }) => {
  if (selectedDate && newEvent.trim()) {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDate}`;
    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent.trim()]
    }));
    setNewEvent('');
  }
};

export const addTodo = (date) => {
  if (newTodo.trim()) {
    const dateKey = date.toISOString().split('T')[0];
    setTodos(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { text: newTodo.trim(), completed: false }]
    }));
    setNewTodo('');
  }
};

export const toggleTodo = (date, todoIndex) => {
  const dateKey = date.toISOString().split('T')[0];
  setTodos(prev => ({
    ...prev,
    [dateKey]: prev[dateKey].map((todo, index) => 
      index === todoIndex ? { ...todo, completed: !todo.completed } : todo
    )
  }));
};

export const removeTodo = (date, todoIndex) => {
  const dateKey = date.toISOString().split('T')[0];
  setTodos(prev => ({
    ...prev,
    [dateKey]: prev[dateKey].filter((_, index) => index !== todoIndex)
  }));
};

export const removeEvent = (dateKey, eventIndex) => {
  setEvents(prev => ({
    ...prev,
    [dateKey]: prev[dateKey].filter((_, index) => index !== eventIndex)
  }));
};

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate array of hours for the day
export const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

// Add hourly event
export const addHourlyEvent = (date, hour) => {
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
export const removeHourlyEvent = (dateKey, hour, eventIndex) => {
  const timeKey = `${dateKey}-${hour}`;
  setHourlyEvents(prev => ({
    ...prev,
    [timeKey]: prev[timeKey].filter((_, index) => index !== eventIndex)
  }));
};