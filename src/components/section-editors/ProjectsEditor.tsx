import React from "react";
import { v4 as uuidv4 } from "uuid";

interface ProjectsEditorProps {
  data: any[];
  updateData: (data: any[]) => void;
}

const ProjectsEditor = ({ data, updateData }: ProjectsEditorProps) => {
  const addProject = () => {
    updateData([
      ...data,
      {
        id: uuidv4(),
        name: "",
        description: "",
        technologies: [""],
        link: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const updateProject = (index: number, field: string, value: any) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    updateData(updatedData);
  };

  const removeProject = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    updateData(updatedData);
  };

  const addTechnology = (projectIndex: number) => {
    const updatedData = [...data];
    updatedData[projectIndex].technologies = [
      ...updatedData[projectIndex].technologies,
      "",
    ];
    updateData(updatedData);
  };

  const updateTechnology = (
    projectIndex: number,
    techIndex: number,
    value: string
  ) => {
    const updatedData = [...data];
    updatedData[projectIndex].technologies[techIndex] = value;
    updateData(updatedData);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updatedData = [...data];
    updatedData[projectIndex].technologies.splice(techIndex, 1);
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      {data.map((project, index) => (
        <div
          key={project.id || index}
          className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Project {index + 1}</h3>
            <button
              title="Remove project"
              aria-label="Remove project"
              type="button"
              onClick={() => removeProject(index)}
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
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                title="Project Name"
                aria-label="Project Name"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
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
                value={project.startDate || ""}
                onChange={(e) =>
                  updateProject(index, "startDate", e.target.value)
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
                value={project.endDate || ""}
                onChange={(e) =>
                  updateProject(index, "endDate", e.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Link
              </label>
              <input
                title="Project Link"
                aria-label="Project Link"
                type="url"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={project.link || ""}
                onChange={(e) => updateProject(index, "link", e.target.value)}
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
              placeholder="Enter project description here..."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              value={project.description || ""}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Technologies Used
            </label>
            {project.technologies?.map(
              (technology: string, techIndex: number) => (
                <div key={techIndex} className="flex items-center mb-2">
                  <input
                    title={`Technology ${techIndex + 1}`}
                    aria-label={`Technology ${techIndex + 1}`}
                    type="text"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    value={technology}
                    onChange={(e) =>
                      updateTechnology(index, techIndex, e.target.value)
                    }
                    placeholder={`Technology ${techIndex + 1}`}
                  />
                  <button
                    title="Remove technology"
                    aria-label="Remove technology"
                    type="button"
                    onClick={() => removeTechnology(index, techIndex)}
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
              )
            )}
            <button
              title="Add Technology"
              aria-label="Add Technology"
              type="button"
              onClick={() => addTechnology(index)}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
              + Add Technology
            </button>
          </div>
        </div>
      ))}

      <button
        title="Add Project"
        aria-label="Add Project"
        type="button"
        onClick={addProject}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700">
        + Add Project
      </button>
    </div>
  );
};

export default ProjectsEditor;
