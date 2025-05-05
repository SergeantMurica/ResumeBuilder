import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useResume } from "../contexts/ResumeContext";
import { ResumeSection, Theme } from "../../types";

const ResumePreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResume, loading, error, loadResume } = useResume();

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id, loadResume]);

  const sortedSections = useMemo(() => {
    if (!currentResume) return [];
    return [...currentResume.sections].sort((a, b) => a.position - b.position);
  }, [currentResume]);

  const exportToPDF = async () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement || !currentResume) return;

    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format:
        currentResume.theme.paperSize === "letter"
          ? "letter"
          : currentResume.theme.paperSize === "legal"
          ? "legal"
          : "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );
    pdf.save(`${currentResume.name}.pdf`);
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

  const theme = currentResume.theme;

  const spacingClass =
    {
      compact: "space-y-3",
      normal: "space-y-5",
      relaxed: "space-y-8",
    }[theme.spacing] || "space-y-5";

  const fontSizeClass =
    {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    }[theme.fontSize] || "text-base";

  const borderRadiusClass =
    {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded",
      lg: "rounded-lg",
    }[theme.borderRadius] || "rounded";

  const fontWeightStyle =
    {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }[theme.fontWeight] || 400;

  const lineHeightStyle =
    {
      tight: 1.2,
      normal: 1.5,
      relaxed: 2,
    }[theme.lineHeight] || 1.5;

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto bg-white p-5 shadow rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Resume Preview</h2>
            <p className="text-sm text-gray-600">{currentResume.name}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/resume/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Back to Editor
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
              Export to PDF
            </button>
          </div>
        </div>
      </div>

      <div
        id="resume-preview"
        className={`max-w-[800px] mx-auto p-8 ${spacingClass} ${fontSizeClass} shadow-lg`}
        style={{
          fontFamily: theme.fontFamily,
          color: theme.textColor,
          backgroundColor: theme.backgroundColor,
          fontWeight: fontWeightStyle,
          lineHeight: lineHeightStyle,
          width:
            theme.paperSize === "letter"
              ? "8.5in"
              : theme.paperSize === "legal"
              ? "8.5in"
              : "210mm", // A4 width approx
          minHeight:
            theme.paperSize === "letter"
              ? "11in"
              : theme.paperSize === "legal"
              ? "14in"
              : "297mm", // A4 height approx
        }}>
        {/* Inject Custom CSS */}
        {theme.customCSS && (
          <style dangerouslySetInnerHTML={{ __html: theme.customCSS }} />
        )}

        {sortedSections.map((section) => (
          <div
            key={section.id}
            className={`resume-section ${
              theme.sectionStyle === "card"
                ? `p-4 ${borderRadiusClass} shadow-sm`
                : ""
            } ${theme.sectionStyle === "bordered" ? `border-l-4 pl-4` : ""} ${
              theme.sectionStyle === "minimal" ? `pt-2` : ""
            }`}
            style={{
              backgroundColor:
                theme.sectionStyle === "card"
                  ? theme.primaryColor + "10" // Light background for card style
                  : "transparent",
              borderColor: theme.primaryColor, // Used for bordered style
            }}>
            {/* Section Title Styling */}
            <h2
              className={`text-xl mb-3 ${
                theme.headerStyle === "bold"
                  ? "font-bold uppercase tracking-wider"
                  : "font-semibold"
              } ${theme.headerStyle === "minimal" ? "border-b pb-1 mb-2" : ""}`}
              style={{
                color: theme.primaryColor,
                borderColor: theme.secondaryColor, // For minimal style border
              }}>
              {section.title}
            </h2>

            {/* Render Section Content */}
            {renderSectionContent(section, theme, borderRadiusClass)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Updated renderSectionContent to pass the full theme
function renderSectionContent(
  section: ResumeSection,
  theme: Theme,
  borderRadiusClass: string
) {
  switch (section.type) {
    case "personalInfo":
      return <PersonalInfoPreview data={section.data} theme={theme} />;
    case "experience":
      return (
        <ExperiencePreview
          data={section.data}
          theme={theme}
          borderRadiusClass={borderRadiusClass}
        />
      );
    case "education":
      return (
        <EducationPreview
          data={section.data}
          theme={theme}
          borderRadiusClass={borderRadiusClass}
        />
      );
    case "skills":
      return <SkillsPreview data={section.data} theme={theme} />;
    case "languages":
      return <LanguagesPreview data={section.data} theme={theme} />;
    case "projects":
      return (
        <ProjectsPreview
          data={section.data}
          theme={theme}
          borderRadiusClass={borderRadiusClass}
        />
      );
    case "certifications":
      return <CertificationsPreview data={section.data} theme={theme} />;
    case "awards":
      return <AwardsPreview data={section.data} theme={theme} />;
    case "publications":
      return <PublicationsPreview data={section.data} theme={theme} />;
    case "references":
      return <ReferencesPreview data={section.data} theme={theme} />;
    case "custom":
      return <CustomPreview data={section.data} />;
    default:
      return <div>Unsupported section type</div>;
  }
}

// Updated Section Preview Components to use extended theme
const PersonalInfoPreview = ({ data, theme }: { data: any; theme: Theme }) => {
  const headerStyles = {
    simple: "text-left",
    modern: "text-center border-b pb-4 mb-4",
    classic: "text-left border-b pb-2 mb-2",
    minimal: "text-left mb-4",
    bold: "text-center bg-gray-100 p-4 rounded-md mb-4",
  };

  return (
    <div
      className={`${
        headerStyles[theme.headerStyle as keyof typeof headerStyles] ||
        "text-left"
      }`}>
      <h1
        className={`text-3xl mb-1 ${
          theme.headerStyle === "bold" ? "font-bold" : "font-semibold"
        }`}
        style={{ color: theme.primaryColor }}>
        {data.name || "Your Name"}
      </h1>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.address && <span>{data.address}</span>}
        {data.website && (
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.secondaryColor }}>
            Website
          </a>
        )}
        {data.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.secondaryColor }}>
            LinkedIn
          </a>
        )}
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.secondaryColor }}>
            GitHub
          </a>
        )}
      </div>
    </div>
  );
};

const ExperiencePreview = ({
  data,
  theme,
}: {
  data: any[];
  theme: Theme;
  borderRadiusClass: string; // borderRadiusClass is now implicitly handled by parent div style
}) => {
  return (
    <div className="space-y-4">
      {data.map((exp, index) => (
        <div key={exp.id || index}>
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-semibold">{exp.position || "Position"}</h3>
              <p
                className="text-sm font-medium"
                style={{ color: theme.secondaryColor }}>
                {exp.company || "Company"}{" "}
                {exp.location ? `• ${exp.location}` : ""}
              </p>
            </div>
            <div className="text-sm whitespace-nowrap pl-4">
              {exp.startDate || "Start Date"} — {exp.endDate || "End Date"}
            </div>
          </div>
          {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
          {exp.bullets && exp.bullets.length > 0 && exp.bullets[0] !== "" && (
            <ul className="mt-1 list-disc list-inside text-sm space-y-1">
              {exp.bullets.map(
                (bullet: string, i: number) =>
                  bullet && <li key={i}>{bullet}</li>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

const EducationPreview = ({
  data,
  theme,
}: {
  data: any[];
  theme: Theme;
  borderRadiusClass: string; // borderRadiusClass is now implicitly handled by parent div style
}) => {
  return (
    <div className="space-y-4">
      {data.map((edu, index) => (
        <div key={edu.id || index}>
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-semibold">
                {edu.degree || "Degree"} {edu.field ? `in ${edu.field}` : ""}
              </h3>
              <p
                className="text-sm font-medium"
                style={{ color: theme.secondaryColor }}>
                {edu.institution || "Institution"}{" "}
                {edu.location ? `• ${edu.location}` : ""}
              </p>
            </div>
            <div className="text-sm whitespace-nowrap pl-4">
              {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
            </div>
          </div>
          {edu.gpa && <p className="mt-1 text-sm">GPA: {edu.gpa}</p>}
          {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
        </div>
      ))}
    </div>
  );
};

const SkillsPreview = ({ data, theme }: { data: any[]; theme: Theme }) => {
  return (
    <div className="space-y-3">
      {data.map((category, index) => (
        <div key={category.id || index}>
          <h3
            className="font-semibold text-sm mb-1"
            style={{ color: theme.secondaryColor }}>
            {category.category || "Category"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.items.map(
              (skill: string, i: number) =>
                skill && (
                  <span
                    key={i}
                    className={`px-2 py-1 text-xs ${
                      theme.borderRadius === "none"
                        ? ""
                        : theme.borderRadius === "sm"
                        ? "rounded-sm"
                        : theme.borderRadius === "md"
                        ? "rounded"
                        : "rounded-lg"
                    }`}
                    style={{
                      backgroundColor: theme.accentColor + "30", // Use accent color
                      color: theme.accentColor,
                    }}>
                    {skill}
                  </span>
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const LanguagesPreview = ({ data, theme }: { data: any[]; theme: Theme }) => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {data.map((lang, index) => (
        <div key={lang.id || index} className="text-sm">
          <span className="font-medium">{lang.language || "Language"}: </span>
          <span className="ml-1" style={{ color: theme.secondaryColor }}>
            {lang.proficiency || "Proficiency"}
          </span>
        </div>
      ))}
    </div>
  );
};

const ProjectsPreview = ({
  data,
  theme,
}: {
  data: any[];
  theme: Theme;
  borderRadiusClass: string; // borderRadiusClass is now implicitly handled by parent div style
}) => {
  return (
    <div className="space-y-4">
      {data.map((project, index) => (
        <div key={project.id || index}>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold">{project.name || "Project Name"}</h3>
            {(project.startDate || project.endDate) && (
              <div className="text-sm whitespace-nowrap pl-4">
                {project.startDate || ""}{" "}
                {project.startDate && project.endDate && "—"}{" "}
                {project.endDate || ""}
              </div>
            )}
          </div>
          {project.description && (
            <p className="mt-1 text-sm">{project.description}</p>
          )}
          {project.technologies &&
            project.technologies.length > 0 &&
            project.technologies[0] !== "" && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map(
                  (tech: string, i: number) =>
                    tech && (
                      <span
                        key={i}
                        className={`px-2 py-0.5 text-xs ${
                          theme.borderRadius === "none"
                            ? ""
                            : theme.borderRadius === "sm"
                            ? "rounded-sm"
                            : theme.borderRadius === "md"
                            ? "rounded"
                            : "rounded-lg"
                        }`}
                        style={{
                          backgroundColor: theme.accentColor + "30", // Use accent color
                          color: theme.accentColor,
                        }}>
                        {tech}
                      </span>
                    )
                )}
              </div>
            )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm"
              style={{ color: theme.primaryColor }}>
              Project Link
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const CertificationsPreview = ({
  data,
  theme,
}: {
  data: any[];
  theme: Theme;
}) => {
  return (
    <div className="space-y-3">
      {data.map((cert, index) => (
        <div key={cert.id || index} className="text-sm">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">
              {cert.name || "Certification Name"}
            </h3>
            <p className="text-xs whitespace-nowrap pl-4">
              {cert.date || "Date"}
            </p>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-xs" style={{ color: theme.secondaryColor }}>
              {cert.issuer || "Issuer"}
            </p>
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs"
                style={{ color: theme.primaryColor }}>
                View Certificate
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Add previews for Awards, Publications, References if they were added as section types
const AwardsPreview = ({ data, theme }: { data: any[]; theme: Theme }) => {
  return (
    <div className="space-y-3">
      {data.map((award, index) => (
        <div key={award.id || index} className="text-sm">
          <div className="flex justify-between items-start mb-0.5">
            <h3 className="font-semibold">{award.title || "Award Title"}</h3>
            <p className="text-xs whitespace-nowrap pl-4">
              {award.date || "Date"}
            </p>
          </div>
          <p className="text-xs mb-1" style={{ color: theme.secondaryColor }}>
            {award.issuer || "Issuer"}
          </p>
          {award.description && <p className="text-xs">{award.description}</p>}
        </div>
      ))}
    </div>
  );
};

const PublicationsPreview = ({
  data,
  theme,
}: {
  data: any[];
  theme: Theme;
}) => {
  return (
    <div className="space-y-3">
      {data.map((pub, index) => (
        <div key={pub.id || index} className="text-sm">
          <div className="flex justify-between items-start mb-0.5">
            <h3 className="font-semibold">
              {pub.title || "Publication Title"}
            </h3>
            <p className="text-xs whitespace-nowrap pl-4">
              {pub.date || "Date"}
            </p>
          </div>
          <p className="text-xs mb-1" style={{ color: theme.secondaryColor }}>
            {pub.publisher || "Publisher"}
          </p>
          {pub.description && <p className="text-xs mb-1">{pub.description}</p>}
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
              style={{ color: theme.primaryColor }}>
              View Publication
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const ReferencesPreview = ({ data, theme }: { data: any[]; theme: Theme }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((ref, index) => (
        <div key={ref.id || index} className="text-sm">
          <h3 className="font-semibold">{ref.name || "Reference Name"}</h3>
          <p className="text-xs">
            {ref.position || "Position"}, {ref.company || "Company"}
          </p>
          <p className="text-xs" style={{ color: theme.secondaryColor }}>
            {ref.relation || "Relation"}
          </p>
          <p className="text-xs">{ref.contact || "Contact Info"}</p>
        </div>
      ))}
    </div>
  );
};

const CustomPreview = ({ data }: { data: any }) => {
  // Basic sanitization (consider a more robust library like DOMPurify for production)
  const sanitizedContent = data.content?.replace(
    /<script.*?>.*?<\/script>/gi,
    ""
  );
  return (
    <div
      className="text-sm"
      dangerouslySetInnerHTML={{ __html: sanitizedContent || "" }}
    />
  );
};

export default ResumePreview;
