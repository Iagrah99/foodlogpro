import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";

const MealLastEaten = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null); // Create a ref for the input element

  const handleSave = () => {
    if (tempValue !== value) {
      const formattedDate = format(new Date(tempValue), 'yyyy/MM/dd'); // Format for submission
      onSave(formattedDate); // Send formatted date
    }
    setIsEditing(false); // Exit editing mode
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave(); // Save on Enter
    } else if (e.key === "Escape") {
      setIsEditing(false); // Cancel on Escape
      setTempValue(value); // Revert to original value
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); // Focus on the input when it becomes editable
    }
  }, [isEditing]); // Trigger when `isEditing` changes

  return (
    <div className="flex justify-center">
      {isEditing ? (
        <input
          ref={inputRef} // Attach the ref to the input element
          type="date"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 rounded px-2 py-1"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className="cursor-pointer text-center"
          title="Edit Date"
        >
          {value ? format(new Date(value), 'EEEE, dd/MM/yyyy') : 'N/A'}
        </span>
      )}
    </div>
  );
};

export default MealLastEaten;
