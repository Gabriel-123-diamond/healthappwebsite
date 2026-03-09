import { useState, useMemo, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  parseISO,
  setYear,
  setMonth,
  getYear,
  isValid,
  parse
} from 'date-fns';

export function useDatePicker(
  value: string, 
  onChange: (value: string) => void,
  minDate?: Date,
  maxDate?: Date
) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');

  useEffect(() => {
    if (value) {
      const date = parseISO(value);
      if (isValid(date)) {
        setInputValue(format(date, 'MMM d, yyyy'));
        setCurrentMonth(date);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  const selectedDate = useMemo(() => value ? parseISO(value) : null, [value]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentMonth]);

  const years = useMemo(() => {
    const currentYear = getYear(new Date());
    const startYear = minDate ? getYear(minDate) : currentYear - 100;
    const endYear = maxDate ? getYear(maxDate) : currentYear + 10;
    const length = Math.max(0, endYear - startYear + 1);
    return Array.from({ length }, (_, i) => startYear + i).reverse();
  }, [minDate, maxDate]);

  const isDateDisabled = (day: Date) => {
    if (minDate && day < minDate && !isSameDay(day, minDate)) return true;
    if (maxDate && day > maxDate) return true;
    return false;
  };

  const handleDayClick = (day: Date) => {
    if (isDateDisabled(day)) return;
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const formats = ['MMM d, yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd', 'd MMM yyyy'];
    for (const f of formats) {
      const parsed = parse(val, f, new Date());
      if (isValid(parsed) && !isDateDisabled(parsed)) {
        onChange(format(parsed, 'yyyy-MM-dd'));
        setCurrentMonth(parsed);
        break;
      }
    }
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
    setView('calendar');
  };

  const handleMonthSelect = (monthIdx: number) => {
    setCurrentMonth(setMonth(currentMonth, monthIdx));
    setView('calendar');
  };

  return {
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    currentMonth,
    setCurrentMonth,
    view,
    setView,
    selectedDate,
    days,
    years,
    handleDayClick,
    handleInputChange,
    handleYearSelect,
    handleMonthSelect,
    isDateDisabled,
  };
}
