import React from "react";

interface CustomEditorProps {
  data: any;
  updateData: (data: any) => void;
}

const CustomEditor = ({ data, updateData }: CustomEditorProps) => {
  const handleChange = (content: string) => {
    updateData({ ...data, content });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Content
      </label>
      <textarea
        rows={10}
        className="w-full p-2 border border-gray-300 rounded-md"
        value={data.content || ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter your custom content here..."
      />
      <p className="mt-1 text-sm text-gray-500">
        You can use HTML formatting for more advanced styling.
      </p>
    </div>
  );
};

export default CustomEditor;
