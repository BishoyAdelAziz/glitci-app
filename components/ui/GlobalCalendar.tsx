import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDateFilter } from "@/stores/useDateFilter";

export const GlobalCalendar = () => {
  const { startDate, endDate, setRange } = useDateFilter();

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setRange(start, end);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      customInput={
        <button className="p-2 bg-white border rounded">📅 Select Dates</button>
      }
    />
  );
};
