import React from "react";
import { v4 as uuidv4 } from "uuid";

interface LanguagesEditorProps {
  data: any[];
  updateData: (data: any[]) => void;
}

const LanguagesEditor = ({ data, updateData }: LanguagesEditorProps) => {
  const addLanguage = () => {
    updateData([
      ...data,
      {
        id: uuidv4(),
        language: "",
        proficiency: "",
      },
    ]);
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    updateData(updatedData);
  };

  const removeLanguage = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    updateData(updatedData);
  };

  const proficiencyLevels = [
    "Native",
    "Fluent",
    "Advanced",
    "Intermediate",
    "Basic",
    "Elementary",
  ];

  return (
    <div className="space-y-4">
      {data.map((language, index) => (
        <div key={language.id || index} className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <input
              title="Language"
              aria-label="Language"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={language.language || ""}
              onChange={(e) =>
                updateLanguage(index, "language", e.target.value)
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proficiency
            </label>
            <select
              title="Proficiency"
              aria-label="Proficiency"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={language.proficiency || ""}
              onChange={(e) =>
                updateLanguage(index, "proficiency", e.target.value)
              }>
              <option value="">Select Proficiency</option>
              {proficiencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div className="self-end pb-2">
            <button
              title="Remove language"
              aria-label="Remove language"
              type="button"
              onClick={() => removeLanguage(index)}
              className="text-red-500 hover:text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addLanguage}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700">
        + Add Language
      </button>
    </div>
  );
};

export default LanguagesEditor;
