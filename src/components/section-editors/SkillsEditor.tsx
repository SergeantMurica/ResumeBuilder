import React from "react";
import { v4 as uuidv4 } from "uuid";

interface SkillsEditorProps {
  data: any[];
  updateData: (data: any[]) => void;
}

const SkillsEditor = ({ data, updateData }: SkillsEditorProps) => {
  const addCategory = () => {
    updateData([
      ...data,
      {
        id: uuidv4(),
        category: "New Category",
        items: [""],
      },
    ]);
  };

  const updateCategory = (index: number, field: string, value: any) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    updateData(updatedData);
  };

  const removeCategory = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    updateData(updatedData);
  };

  const addSkill = (categoryIndex: number) => {
    const updatedData = [...data];
    updatedData[categoryIndex].items = [
      ...updatedData[categoryIndex].items,
      "",
    ];
    updateData(updatedData);
  };

  const updateSkill = (
    categoryIndex: number,
    skillIndex: number,
    value: string
  ) => {
    const updatedData = [...data];
    updatedData[categoryIndex].items[skillIndex] = value;
    updateData(updatedData);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedData = [...data];
    updatedData[categoryIndex].items.splice(skillIndex, 1);
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      {data.map((category, index) => (
        <div
          key={category.id || index}
          className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                title="Category Name"
                aria-label="Category Name"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={category.category || ""}
                onChange={(e) =>
                  updateCategory(index, "category", e.target.value)
                }
              />
            </div>
            <button
              title="Remove category"
              aria-label="Remove category"
              type="button"
              onClick={() => removeCategory(index)}
              className="ml-4 text-red-500 hover:text-red-700">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Skills
            </label>
            {category.items?.map((skill: string, skillIndex: number) => (
              <div key={skillIndex} className="flex items-center">
                <input
                  title={`Skill ${skillIndex + 1}`}
                  aria-label={`Skill ${skillIndex + 1}`}
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  value={skill}
                  onChange={(e) =>
                    updateSkill(index, skillIndex, e.target.value)
                  }
                  placeholder={`Skill ${skillIndex + 1}`}
                />
                <button
                  title="Remove skill"
                  aria-label="Remove skill"
                  type="button"
                  onClick={() => removeSkill(index, skillIndex)}
                  className="ml-2 text-red-500 hover:text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              title="Add Skill"
              aria-label="Add Skill"
              type="button"
              onClick={() => addSkill(index)}
              className="text-sm text-indigo-600 hover:text-indigo-800">
              + Add Skill
            </button>
          </div>
        </div>
      ))}

      <button
        title="Add Skill Category"
        aria-label="Add Skill Category"
        type="button"
        onClick={addCategory}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700">
        + Add Skill Category
      </button>
    </div>
  );
};

export default SkillsEditor;
