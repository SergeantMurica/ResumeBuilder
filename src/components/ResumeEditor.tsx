import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SectionEditor from "./SectionEditor";
import SectionList from "./SectionList";
import ThemeCustomizer from "./ThemeCustomizer";
import { useResume } from "../contexts/ResumeContext";
import { ResumeSection } from "../../types";

const ResumeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResume, loading, error, loadResume, setSections, setTheme } =
    useResume();
  const [activeTab, setActiveTab] = useState<"editor" | "theme" | "preview">(
    "editor"
  );

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id, loadResume]);

  const addSection = (type: string) => {
    if (!currentResume) return;

    const sectionTitle = getSectionTitle(type);
    const initialData = getInitialData(type);

    const newSection: ResumeSection = {
      id: crypto.randomUUID(),
      type,
      title: sectionTitle,
      data: initialData,
      position: currentResume.sections.length,
    };

    setSections([...currentResume.sections, newSection]);
  };

  const updateSection = (id: string, data: any) => {
    if (!currentResume) return;

    const updatedSections = currentResume.sections.map((section) =>
      section.id === id ? { ...section, data } : section
    );

    setSections(updatedSections);
  };

  const updateSectionTitle = (id: string, title: string) => {
    if (!currentResume) return;

    const updatedSections = currentResume.sections.map((section) =>
      section.id === id ? { ...section, title } : section
    );

    setSections(updatedSections);
  };

  const removeSection = (id: string) => {
    if (!currentResume) return;

    const updatedSections = currentResume.sections.filter(
      (section) => section.id !== id
    );

    setSections(updatedSections);
  };

  const reorderSections = (sourceIndex: number, destinationIndex: number) => {
    if (!currentResume) return;

    const reorderedSections = [...currentResume.sections];
    const [removed] = reorderedSections.splice(sourceIndex, 1);
    reorderedSections.splice(destinationIndex, 0, removed);

    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      position: index,
    }));

    setSections(updatedSections);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
          <div className="mt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Not Found:</strong>
          <span className="block sm:inline"> Resume not found</span>
          <div className="mt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sortedSections = [...currentResume.sections].sort(
    (a, b) => a.position - b.position
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
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentResume.name}
              </h1>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-sm text-indigo-600 hover:text-indigo-500">
                &larr; Back to Dashboard
              </button>
            </div>
            <div>
              <button
                onClick={() => navigate(`/resume/${id}/preview`)}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Preview
              </button>
            </div>
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
          </div>

          {activeTab === "editor" && (
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
          )}

          {activeTab === "theme" && (
            <ThemeCustomizer theme={currentResume.theme} setTheme={setTheme} />
          )}
        </main>
      </div>
    </DndProvider>
  );
};

export default ResumeEditor;

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
          id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
          category: "Technical Skills",
          items: [""],
        },
      ];
    case "languages":
      return [
        {
          id: crypto.randomUUID(),
          language: "",
          proficiency: "",
        },
      ];
    case "projects":
      return [
        {
          id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ];
    case "awards":
      return [
        {
          id: crypto.randomUUID(),
          title: "",
          issuer: "",
          date: "",
          description: "",
        },
      ];
    case "publications":
      return [
        {
          id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
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
