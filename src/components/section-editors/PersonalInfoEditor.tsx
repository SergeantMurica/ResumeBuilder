import React, { useState, useEffect } from "react";

interface PersonalInfoEditorProps {
  data: any;
  updateData: (data: any) => void;
}

const PersonalInfoEditor = ({ data, updateData }: PersonalInfoEditorProps) => {
  // Use local state for more responsive editing
  const [formData, setFormData] = useState(data);

  // Sync with parent data when it changes externally
  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateData(updatedData);
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="johndoe@example.com"
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(123) 456-7890"
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="City, State, Country"
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://example.com"
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={formData.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoEditor;
