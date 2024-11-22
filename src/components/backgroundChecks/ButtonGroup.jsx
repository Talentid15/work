import React, { useState } from 'react';

function ButtonGroup() {
  const [active, setActive] = useState("People"); // Default active button is "People"

  return (
    <div className="w-full h-12 max-w-md p-2 bg-white-200 rounded-full shadow-md mx-auto">
      <div className="flex justify-around">
        {/* People Button */}
        <button
          className={`px-4 py-2 font-medium text-sm rounded-full ${
            active === "People" ? "bg-purple-500 text-white" : "text-gray-700"
          }`}
          onClick={() => setActive("People")}
        >
          People
        </button>

        {/* Insufficiency Button */}
        <button
          className={`px-4 py-2 font-medium text-sm rounded-full ${
            active === "Insufficiency" ? "bg-purple-500 text-white" : "text-gray-700"
          }`}
          onClick={() => setActive("Insufficiency")}
        >
          Insufficiency
        </button>

        {/* Add Button */}
        <button
          className={`px-4 py-2 font-medium text-sm rounded-full ${
            active === "Add" ? "bg-purple-500 text-white" : "text-gray-700"
          }`}
          onClick={() => setActive("Add")}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default ButtonGroup;
