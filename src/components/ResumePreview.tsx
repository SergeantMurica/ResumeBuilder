// components/ResumePreview.tsx
import { useMemo } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ResumeSection, Theme } from "../../types";

interface ResumePreviewProps {
  sections: ResumeSection[];
  theme: Theme;
}

const ResumePreview = ({ sections, theme }: ResumePreviewProps) => {
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.position - b.position),
    [sections]
  );

  const exportToPDF = async () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) return;

    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
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
    pdf.save("resume.pdf");
  };

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

  return (
    <div className="bg-white p-5 shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Resume Preview</h2>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Export to PDF
        </button>
      </div>

      <div
        id="resume-preview"
        className={`max-w-[800px] mx-auto p-8 ${spacingClass} ${fontSizeClass}`}
        style={{
          fontFamily: theme.fontFamily,
          color: theme.textColor,
          backgroundColor: theme.backgroundColor,
        }}>
        {sortedSections.map((section) => (
          <div
            key={section.id}
            className="resume-section"
            style={{
              borderColor: theme.primaryColor,
            }}>
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: theme.primaryColor }}>
              {section.title}
            </h2>
            {renderSectionContent(section, theme, borderRadiusClass)}
          </div>
        ))}
      </div>
    </div>
  );
};

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
    case "custom":
      return <CustomPreview data={section.data} />;
    default:
      return <div>Unsupported section type</div>;
  }
}

// Section Preview Components
const PersonalInfoPreview = ({ data, theme }: { data: any; theme: Theme }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: theme.primaryColor }}>
          {data.name || "Your Name"}
        </h1>
        <div className="mt-2 space-y-1">
          {data.email && <div>Email: {data.email}</div>}
          {data.phone && <div>Phone: {data.phone}</div>}
          {data.address && <div>Address: {data.address}</div>}
        </div>
      </div>
      <div className="space-y-1">
        {data.website && (
          <div>
            <span style={{ color: theme.secondaryColor }}>Website:</span>{" "}
            {data.website}
          </div>
        )}
        {data.linkedin && (
          <div>
            <span style={{ color: theme.secondaryColor }}>LinkedIn:</span>{" "}
            {data.linkedin}
          </div>
        )}
        {data.github && (
          <div>
            <span style={{ color: theme.secondaryColor }}>GitHub:</span>{" "}
            {data.github}
          </div>
        )}
      </div>
    </div>
  );
};

const ExperiencePreview = ({
  data,
  theme,
  borderRadiusClass,
}: {
  data: any[];
  theme: Theme;
  borderRadiusClass: string;
}) => {
  return (
    <div className="space-y-4">
      {data.map((exp, index) => (
        <div
          key={exp.id || index}
          className={`p-3 border-l-4 ${borderRadiusClass}`}
          style={{ borderLeftColor: theme.primaryColor }}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{exp.position || "Position"}</h3>
              <p
                className="text-sm font-medium"
                style={{ color: theme.secondaryColor }}>
                {exp.company || "Company"}{" "}
                {exp.location ? `• ${exp.location}` : ""}
              </p>
            </div>
            <div className="text-sm">
              {exp.startDate || "Start Date"} — {exp.endDate || "End Date"}
            </div>
          </div>
          {exp.description && <p className="mt-2">{exp.description}</p>}
          {exp.bullets && exp.bullets.length > 0 && (
            <ul className="mt-2 list-disc list-inside">
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
  borderRadiusClass,
}: {
  data: any[];
  theme: Theme;
  borderRadiusClass: string;
}) => {
  return (
    <div className="space-y-4">
      {data.map((edu, index) => (
        <div
          key={edu.id || index}
          className={`p-3 border-l-4 ${borderRadiusClass}`}
          style={{ borderLeftColor: theme.primaryColor }}>
          <div className="flex justify-between items-start">
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
            <div className="text-sm">
              {edu.startDate || "Start Date"} — {edu.endDate || "End Date"}
            </div>
          </div>
          {edu.gpa && <p className="mt-1">GPA: {edu.gpa}</p>}
          {edu.description && <p className="mt-2">{edu.description}</p>}
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
          <h3 className="font-semibold" style={{ color: theme.secondaryColor }}>
            {category.category || "Category"}
          </h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {category.items.map(
              (skill: string, i: number) =>
                skill && (
                  <span
                    key={i}
                    className="px-2 py-1 text-sm rounded"
                    style={{
                      backgroundColor: theme.primaryColor + "20",
                      color: theme.primaryColor,
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
    <div className="flex flex-wrap gap-4">
      {data.map((lang, index) => (
        <div key={lang.id || index} className="flex items-center">
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
  borderRadiusClass,
}: {
  data: any[];
  theme: Theme;
  borderRadiusClass: string;
}) => {
  return (
    <div className="space-y-4">
      {data.map((project, index) => (
        <div
          key={project.id || index}
          className={`p-3 border-l-4 ${borderRadiusClass}`}
          style={{ borderLeftColor: theme.primaryColor }}>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{project.name || "Project Name"}</h3>
            {(project.startDate || project.endDate) && (
              <div className="text-sm">
                {project.startDate || ""}{" "}
                {project.startDate && project.endDate && "—"}{" "}
                {project.endDate || ""}
              </div>
            )}
          </div>
          {project.description && <p className="mt-2">{project.description}</p>}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {project.technologies.map(
                (tech: string, i: number) =>
                  tech && (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs rounded"
                      style={{
                        backgroundColor: theme.secondaryColor + "20",
                        color: theme.secondaryColor,
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
        <div key={cert.id || index}>
          <h3 className="font-semibold">{cert.name || "Certification Name"}</h3>
          <div className="flex justify-between">
            <p className="text-sm" style={{ color: theme.secondaryColor }}>
              {cert.issuer || "Issuer"}
            </p>
            <p className="text-sm">{cert.date || "Date"}</p>
          </div>
          {cert.link && (
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
              style={{ color: theme.primaryColor }}>
              View Certificate
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

const CustomPreview = ({ data }: { data: any }) => {
  return <div dangerouslySetInnerHTML={{ __html: data.content }} />;
};

export default ResumePreview;
