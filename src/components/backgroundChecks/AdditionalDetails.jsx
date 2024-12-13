import React, { useState } from "react";

const AdditionalDetailsForm = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-700">Additional Details</h3>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Enter a tag"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
        >
          Add Tag
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-purple-100 text-purple-600 py-1 px-3 rounded-full space-x-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-purple-600 hover:text-purple-800"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdditionalDetailsForm;
