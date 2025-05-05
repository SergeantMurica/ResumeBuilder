import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import ResumeEditor from "./components/ResumeEditor";
import ResumePreview from "./components/ResumePreview";
import ThemeCustomizer from "./components/ThemeCustomizer";
import { ResumeSection, Theme } from "../types";

const App = () => {
  const [sections, setSections] = useState<ResumeSection[]>(() => {
    const saved = localStorage.getItem("resumeSections");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: uuidv4(),
            type: "personalInfo",
            title: "Personal Information",
            data: {
              name: "",
              email: "",
              phone: "",
              address: "",
            },
            position: 0,
          },
        ];
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("resumeTheme");
    return saved
      ? JSON.parse(saved)
      : {
          primaryColor: "#4f46e5",
          secondaryColor: "#818cf8",
          textColor: "#1f2937",
          backgroundColor: "#ffffff",
          fontFamily: "Inter",
          fontSize: "medium",
          borderRadius: "md",
          spacing: "normal",
        };
  });

  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "theme">(
    "editor"
  );

  useEffect(() => {
    localStorage.setItem("resumeSections", JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem("resumeTheme", JSON.stringify(theme));
  }, [theme]);

  const addSection = (type: string) => {
    const newSection: ResumeSection = {
      id: uuidv4(),
      type,
      title: getSectionTitle(type),
      data: getInitialData(type),
      position: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, data: any) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, data } : section
      )
    );
  };

  const updateSectionTitle = (id: string, title: string) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, title } : section
      )
    );
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const reorderSections = (sourceIndex: number, destinationIndex: number) => {
    const reorderedSections = [...sections];
    const [removed] = reorderedSections.splice(sourceIndex, 1);
    reorderedSections.splice(destinationIndex, 0, removed);

    setSections(
      reorderedSections.map((section, index) => ({
        ...section,
        position: index,
      }))
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex border-b border-gray-200">
            <button
              className={`px-4 py-2 ${
                activeTab === "editor"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("editor")}>
              Editor
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "theme"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("theme")}>
              Theme
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "preview"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("preview")}>
              Preview
            </button>
          </div>

          {activeTab === "editor" && (
            <ResumeEditor
              sections={sections}
              addSection={addSection}
              updateSection={updateSection}
              updateSectionTitle={updateSectionTitle}
              removeSection={removeSection}
              reorderSections={reorderSections}
            />
          )}

          {activeTab === "theme" && (
            <ThemeCustomizer theme={theme} setTheme={setTheme} />
          )}

          {activeTab === "preview" && (
            <ResumePreview sections={sections} theme={theme} />
          )}
        </main>
      </div>
    </DndProvider>
  );
};

export default App;

// Utility functions
function getSectionTitle(type: string): string {
  switch (type) {
    case "personalInfo":
      return "Personal Information";
    case "experience":
      return "Work Experience";
    case "education":
      return "Education";
    case "skills":
      return "Skills";
    case "languages":
      return "Languages";
    case "projects":
      return "Projects";
    case "certifications":
      return "Certifications";
    case "awards":
      return "Awards";
    case "publications":
      return "Publications";
    case "references":
      return "References";
    case "custom":
      return "Custom Section";
    default:
      return "New Section";
  }
}

function getInitialData(type: string): any {
  switch (type) {
    case "personalInfo":
      return {
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        linkedin: "",
        github: "",
      };
    case "experience":
      return [
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
      ];
    case "education":
      return [
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
      ];
    case "skills":
      return [
        {
          id: uuidv4(),
          category: "Technical Skills",
          items: [""],
        },
      ];
    case "languages":
      return [
        {
          id: uuidv4(),
          language: "",
          proficiency: "",
        },
      ];
    case "projects":
      return [
        {
          id: uuidv4(),
          name: "",
          description: "",
          technologies: [""],
          link: "",
          startDate: "",
          endDate: "",
        },
      ];
    case "certifications":
      return [
        {
          id: uuidv4(),
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ];
    case "awards":
      return [
        {
          id: uuidv4(),
          title: "",
          issuer: "",
          date: "",
          description: "",
        },
      ];
    case "publications":
      return [
        {
          id: uuidv4(),
          title: "",
          publisher: "",
          date: "",
          link: "",
          description: "",
        },
      ];
    case "references":
      return [
        {
          id: uuidv4(),
          name: "",
          company: "",
          position: "",
          contact: "",
          relation: "",
        },
      ];
    case "custom":
      return {
        content: "",
      };
    default:
      return {};
  }
}
