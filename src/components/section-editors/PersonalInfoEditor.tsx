import React from "react";

interface PersonalInfoEditorProps {
  data: any;
  updateData: (data: any) => void;
}

const PersonalInfoEditor = ({ data, updateData }: PersonalInfoEditorProps) => {
  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            title="Full Name"
            aria-label="Full Name"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={data.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            title="Email"
            aria-label="Email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            title="Phone"
            aria-label="Phone"
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            title="Address"
            aria-label="Address"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={data.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            title="Website"
            aria-label="Website"
            type="url"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={data.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input
            title="LinkedIn"
            aria-label="LinkedIn"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub
          </label>
          <input
            title="GitHub"
            aria-label="GitHub"
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoEditor;
