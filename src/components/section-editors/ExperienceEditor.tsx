import React from "react";
import { v4 as uuidv4 } from "uuid";

interface ExperienceEditorProps {
  data: any[];
  updateData: (data: any[]) => void;
}

const ExperienceEditor = ({ data, updateData }: ExperienceEditorProps) => {
  const addExperience = () => {
    updateData([
      ...data,
      {
        id: uuidv4(),
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        bullets: [""],
      },
    ]);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    updateData(updatedData);
  };

  const removeExperience = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    updateData(updatedData);
  };

  const addBullet = (experienceIndex: number) => {
    const updatedData = [...data];
    updatedData[experienceIndex].bullets = [
      ...updatedData[experienceIndex].bullets,
      "",
    ];
    updateData(updatedData);
  };

  const updateBullet = (
    experienceIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const updatedData = [...data];
    updatedData[experienceIndex].bullets[bulletIndex] = value;
    updateData(updatedData);
  };

  const removeBullet = (experienceIndex: number, bulletIndex: number) => {
    const updatedData = [...data];
    updatedData[experienceIndex].bullets.splice(bulletIndex, 1);
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      {data.map((experience, index) => (
        <div
          key={experience.id || index}
          className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Experience {index + 1}</h3>
            <button
              title="Remove experience"
              aria-label="Remove experience"
              type="button"
              onClick={() => removeExperience(index)}
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                title="Company"
                aria-label="Company"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={experience.company || ""}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                title="Position"
                aria-label="Position"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={experience.position || ""}
                onChange={(e) =>
                  updateExperience(index, "position", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                title="Location"
                aria-label="Location"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={experience.location || ""}
                onChange={(e) =>
                  updateExperience(index, "location", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                title="Start Date"
                aria-label="Start Date"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="MM/YYYY or Present"
                value={experience.startDate || ""}
                onChange={(e) =>
                  updateExperience(index, "startDate", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                title="End Date"
                aria-label="End Date"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="MM/YYYY or Present"
                value={experience.endDate || ""}
                onChange={(e) =>
                  updateExperience(index, "endDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              title="Description"
              aria-label="Description"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              value={experience.description || ""}
              onChange={(e) =>
                updateExperience(index, "description", e.target.value)
              }
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bullet Points
            </label>
            {experience.bullets?.map((bullet: string, bulletIndex: number) => (
              <div key={bulletIndex} className="flex items-center mb-2">
                <input
                  title={`Bullet point ${bulletIndex + 1}`}
                  aria-label={`Bullet point ${bulletIndex + 1}`}
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  value={bullet}
                  onChange={(e) =>
                    updateBullet(index, bulletIndex, e.target.value)
                  }
                  placeholder={`Bullet point ${bulletIndex + 1}`}
                />
                <button
                  title="Remove bullet point"
                  aria-label="Remove bullet point"
                  type="button"
                  onClick={() => removeBullet(index, bulletIndex)}
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
              title="Add Bullet Point"
              aria-label="Add Bullet Point"
              type="button"
              onClick={() => addBullet(index)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
              + Add Bullet Point
            </button>
          </div>
        </div>
      ))}

      <button
        title="Add Experience"
        aria-label="Add Experience"
        type="button"
        onClick={addExperience}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700">
        + Add Experience
      </button>
    </div>
  );
};

export default ExperienceEditor;
