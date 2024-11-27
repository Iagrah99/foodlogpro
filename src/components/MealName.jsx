import { useState, useRef, useEffect } from "react";

const MealName = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [inputWidth, setInputWidth] = useState(0);
  const spanRef = useRef(null);

  const handleSave = () => {
    if (tempValue !== value) {  // Only save if the value has changed
      setIsEditing(false);
      onSave(tempValue); // Save the updated value
    } else {
      setIsEditing(false); // Just stop editing without calling onSave
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave(); // Save on Enter
    } else if (e.key === "Escape") {
      setIsEditing(false); // Cancel edit on Escape
      setTempValue(value); // Revert to original value
    }
  };

  useEffect(() => {
    if (spanRef.current) {
      // Update the width based on the span's rendered width
      setInputWidth(spanRef.current.offsetWidth + 20); // Add a small buffer for padding
    }
  }, [tempValue, isEditing]);

  return (
    <td className="px-2 py-2 whitespace-nowrap text-center text-base font-medium text-gray-900">
      {isEditing ? (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave} // Save when focus is lost
          onKeyDown={handleKeyDown}
          style={{ width: `${inputWidth}px` }}
          className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
        />
      ) : (
        <span
          ref={spanRef} // Reference for measuring width
          onClick={() => setIsEditing(true)}
          className="cursor-pointer"
        >
          {value}
        </span>
      )}
    </td>
  );
};

export default MealName;
