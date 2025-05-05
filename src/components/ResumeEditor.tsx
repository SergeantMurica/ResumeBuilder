import React, { useMemo } from "react";
import SectionEditor from "./SectionEditor";
import SectionList from "./SectionList";
import { ResumeSection } from "../../types";

interface ResumeEditorProps {
  sections: ResumeSection[];
  addSection: (type: string) => void;
  updateSection: (id: string, data: any) => void;
  updateSectionTitle: (id: string, title: string) => void;
  removeSection: (id: string) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
}

const ResumeEditor = ({
  sections,
  addSection,
  updateSection,
  updateSectionTitle,
  removeSection,
  reorderSections,
}: ResumeEditorProps) => {
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.position - b.position),
    [sections]
  );

  const sectionTypes = [
    { type: "personalInfo", label: "Personal Information" },
    { type: "experience", label: "Work Experience" },
    { type: "education", label: "Education" },
    { type: "skills", label: "Skills" },
    { type: "languages", label: "Languages" },
    { type: "projects", label: "Projects" },
    { type: "certifications", label: "Certifications" },
    { type: "awards", label: "Awards" },
    { type: "publications", label: "Publications" },
    { type: "references", label: "References" },
    { type: "custom", label: "Custom Section" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Sections</h2>
        <SectionList
          sections={sortedSections}
          removeSection={removeSection}
          reorderSections={reorderSections}
        />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Section
          </label>
          <select
            title="Add Section"
            aria-label="Add Section"
            className="block w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => {
              if (e.target.value) {
                addSection(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue="">
            <option value="" disabled>
              Select section type
            </option>
            {sectionTypes.map((sectionType) => (
              <option key={sectionType.type} value={sectionType.type}>
                {sectionType.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Edit Sections</h2>
        {sortedSections.map((section) => (
          <SectionEditor
            key={section.id}
            section={section}
            updateSection={updateSection}
            updateSectionTitle={updateSectionTitle}
          />
        ))}
      </div>
    </div>
  );
};

export default ResumeEditor;
