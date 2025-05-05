import React from "react";
import { v4 as uuidv4 } from "uuid";

interface CertificationsEditorProps {
  data: any[];
  updateData: (data: any[]) => void;
}

const CertificationsEditor = ({
  data,
  updateData,
}: CertificationsEditorProps) => {
  const addCertification = () => {
    updateData([
      ...data,
      {
        id: uuidv4(),
        name: "",
        issuer: "",
        date: "",
        link: "",
      },
    ]);
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], [field]: value };
    updateData(updatedData);
  };

  const removeCertification = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    updateData(updatedData);
  };

  return (
    <div className="space-y-6">
      {data.map((certification, index) => (
        <div
          key={certification.id || index}
          className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Certification {index + 1}</h3>
            <button
              title="Remove certification"
              aria-label="Remove certification"
              type="button"
              onClick={() => removeCertification(index)}
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
                Certification Name
              </label>
              <input
                title="Certification Name"
                aria-label="Certification Name"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={certification.name || ""}
                onChange={(e) =>
                  updateCertification(index, "name", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Organization
              </label>
              <input
                title="Issuing Organization"
                aria-label="Issuing Organization"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={certification.issuer || ""}
                onChange={(e) =>
                  updateCertification(index, "issuer", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                title="Date"
                aria-label="Date"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="MM/YYYY"
                value={certification.date || ""}
                onChange={(e) =>
                  updateCertification(index, "date", e.target.value)
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Link
              </label>
              <input
                title="Certificate Link"
                aria-label="Certificate Link"
                type="url"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={certification.link || ""}
                onChange={(e) =>
                  updateCertification(index, "link", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      <button
        title="Add Certification"
        aria-label="Add Certification"
        type="button"
        onClick={addCertification}
        className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700">
        + Add Certification
      </button>
    </div>
  );
};

export default CertificationsEditor;
