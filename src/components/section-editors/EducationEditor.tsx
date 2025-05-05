import React from "react";
import { v4 as uuidv4 } from "uuid";

interface EducationEditorProps {
  data: any[];
  updateData: (data: any[]) => void;
}

const EducationEditor = ({ data, updateData }: EducationEditorProps) => {
  const addEducation = () => {
    updateData([
      ...data,
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        field: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    updateData(updatedData);
  };

  const removeEducation = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      {data.map((education, index) => (
        <div
          key={education.id || index}
          className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Education {index + 1}</h3>
            <button
              title="Remove education"
              aria-label="Remove education"
              type="button"
              onClick={() => removeEducation(index)}
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
                Institution
              </label>
              <input
                title="Institution"
                aria-label="Institution"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={education.institution || ""}
                onChange={(e) =>
                  updateEducation(index, "institution", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                title="Degree"
                aria-label="Degree"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={education.degree || ""}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <input
                title="Field of Study"
                aria-label="Field of Study"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={education.field || ""}
                onChange={(e) =>
                  updateEducation(index, "field", e.target.value)
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
                value={education.location || ""}
                onChange={(e) =>
                  updateEducation(index, "location", e.target.value)
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
                placeholder="MM/YYYY"
                value={education.startDate || ""}
                onChange={(e) =>
                  updateEducation(index, "startDate", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="MM/YYYY or Present"
                value={education.endDate || ""}
                onChange={(e) =>
                  updateEducation(index, "endDate", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA
              </label>
              <input
                title="GPA"
                aria-label="GPA"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={education.gpa || ""}
                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
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
              value={education.description || ""}
              onChange={(e) =>
                updateEducation(index, "description", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <button
        title="Add Education"
        aria-label="Add Education"
        type="button"
        onClick={addEducation}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700">
        + Add Education
      </button>
    </div>
  );
};

export default EducationEditor;
