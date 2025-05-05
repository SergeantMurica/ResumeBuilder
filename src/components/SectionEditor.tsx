import React, { useState } from "react";
import PersonalInfoEditor from "./section-editors/PersonalInfoEditor";
import ExperienceEditor from "./section-editors/ExperienceEditor";
import EducationEditor from "./section-editors/EducationEditor";
import SkillsEditor from "./section-editors/SkillsEditor";
import LanguagesEditor from "./section-editors/LanguagesEditor";
import ProjectsEditor from "./section-editors/ProjectsEditor";
import CertificationsEditor from "./section-editors/CertificationsEditor";
import CustomEditor from "./section-editors/CustomEditor";
import { ResumeSection } from "../../types";

interface SectionEditorProps {
  section: ResumeSection;
  updateSection: (id: string, data: any) => void;
  updateSectionTitle: (id: string, title: string) => void;
}

const SectionEditor = ({
  section,
  updateSection,
  updateSectionTitle,
}: SectionEditorProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderEditor = () => {
    switch (section.type) {
      case "personalInfo":
        return (
          <PersonalInfoEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      case "experience":
        return (
          <ExperienceEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      case "education":
        return (
          <EducationEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      case "skills":
        return (
          <SkillsEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      case "languages":
        return (
          <LanguagesEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      case "projects":
        return (
          <ProjectsEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      case "certifications":
        return (
          <CertificationsEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      case "custom":
        return (
          <CustomEditor
            data={section.data}
            updateData={(data) => updateSection(section.id, data)}
          />
        );
      default:
        return <div>Unsupported section type</div>;
    }
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 rounded-t-md">
        <div className="flex-1 min-w-0">
          <input
            title="Section Title"
            aria-label="Section Title"
            type="text"
            className="w-full bg-transparent border-none focus:ring-0 font-medium text-gray-800 p-0"
            value={section.title}
            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
          />
        </div>
        <button
          title="Toggle Section"
          aria-label="Toggle Section"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${
              isCollapsed ? "" : "transform rotate-180"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {!isCollapsed && <div className="p-4">{renderEditor()}</div>}
    </div>
  );
};

export default SectionEditor;
