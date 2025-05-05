import { useMemo, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useResume } from "../contexts/ResumeContext";
import { ResumeSection, Theme } from "../types";
import {
  ensureFontsLoaded,
  applyTextRenderingFixes,
  createPdfRenderingClone,
  formatUrl,
  cleanupPdfRenderingElements,
} from "../utils/pdfUtils";

const ResumePreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentResume, loading, error, loadResume } = useResume();
  const resumeRef = useRef<HTMLDivElement>(null);

  // Add state to track PDF export process
  const [isExporting, setIsExporting] = useState(false);
  const [showPdfInfo, setShowPdfInfo] = useState(true);
  const [compactMode, setCompactMode] = useState(true); // Default to compact mode

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id, loadResume]);

  // Hide PDF info message after a delay
  useEffect(() => {
    if (showPdfInfo) {
      const timer = setTimeout(() => {
        setShowPdfInfo(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showPdfInfo]);

  // Memoize section filtering for layout
  const { sidebarSectionsContent, mainSectionsContent } = useMemo(() => {
    if (!currentResume)
      return { sidebarSectionsContent: [], mainSectionsContent: [] };

    const sorted = [...currentResume.sections].sort(
      (a, b) => a.position - b.position
    );
    const sidebarTypes = currentResume.theme.sidebarSections || [];

    if (currentResume.theme.layoutType === "single-column") {
      return { sidebarSectionsContent: [], mainSectionsContent: sorted };
    }

    const sidebarContent = sorted.filter((section) =>
      sidebarTypes.includes(section.type)
    );
    const mainContent = sorted.filter(
      (section) => !sidebarTypes.includes(section.type)
    );

    return {
      sidebarSectionsContent: sidebarContent,
      mainSectionsContent: mainContent,
    };
  }, [currentResume]); // Depend on the whole currentResume object

  const exportToPDF = async () => {
    const resumeElement = resumeRef.current;
    if (!resumeElement || !currentResume) return;

    setIsExporting(true);

    try {
      // Show export status to user
      const statusElement = document.createElement("div");
      statusElement.style.position = "fixed";
      statusElement.style.top = "20px";
      statusElement.style.left = "50%";
      statusElement.style.transform = "translateX(-50%)";
      statusElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      statusElement.style.color = "white";
      statusElement.style.padding = "10px 20px";
      statusElement.style.borderRadius = "5px";
      statusElement.style.zIndex = "9999";
      statusElement.textContent = "Generating PDF...";
      document.body.appendChild(statusElement);

      // Ensure fonts are properly loaded
      await ensureFontsLoaded();

      // Create a clone for PDF rendering without affecting the UI
      const { clone, container } = createPdfRenderingClone(resumeElement);

      // Set fixed dimensions based on paper size
      let pageWidth, pageHeight;
      if (currentResume.theme.paperSize === "letter") {
        pageWidth = "8.5in";
        pageHeight = "11in";
      } else if (currentResume.theme.paperSize === "legal") {
        pageWidth = "8.5in";
        pageHeight = "14in";
      } else {
        // A4
        pageWidth = "210mm";
        pageHeight = "297mm";
      }

      // Set clone dimensions for proper PDF rendering
      clone.style.width = pageWidth;
      clone.style.minHeight = pageHeight;
      clone.style.maxWidth = pageWidth; // Ensure content doesn't exceed page width
      clone.style.margin = "0"; // Remove any margin that might push content
      clone.style.padding = "0"; // Reset padding on the container
      clone.style.overflow = "hidden"; // Prevent overflow issues

      // Apply specific styles to elements for PDF rendering
      applyPDFStyles(clone, currentResume.theme);

      // Apply text rendering fixes with compact mode setting
      if (compactMode) {
        // Additional scaling for compact mode
        clone.style.transform = "scale(0.95)";
        clone.style.transformOrigin = "top left";

        // Reduce spacing between sections
        const sections = clone.querySelectorAll(".resume-section");
        sections.forEach((section) => {
          if (section instanceof HTMLElement) {
            section.style.marginBottom = "4px";
            section.style.padding = "4px";
          }
        });

        // Reduce line height globally
        const textElements = clone.querySelectorAll(
          "p, span, div, li, h1, h2, h3, h4, h5, h6"
        );
        textElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.lineHeight = "1.2";
            el.style.marginBottom = "1px";
          }
        });
      }

      // Apply standard text fixes
      applyTextRenderingFixes(clone);

      // Force a repaint to ensure element is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Force inner content to respect width constraints after all styling is applied
      const mainContent = clone.querySelector(".main-content-col");
      if (mainContent instanceof HTMLElement) {
        mainContent.style.maxWidth = "100%";

        // Adjust padding based on compact mode
        const currPadding = parseInt(
          window.getComputedStyle(mainContent).padding
        );
        if (compactMode) {
          // More compact padding for dense layout
          mainContent.style.padding = `${Math.max(currPadding * 0.6, 8)}px`;
        } else {
          // Less reduction for normal layout
          mainContent.style.padding = `${Math.max(currPadding * 0.8, 12)}px`;
        }
      }

      // Make sidebar narrower if present
      const sidebar = clone.querySelector(".sidebar-col");
      if (sidebar instanceof HTMLElement) {
        const currWidth = sidebar.style.width || "30%";
        // Adjust width based on compact mode
        const reductionFactor = compactMode ? 0.85 : 0.95;
        sidebar.style.width = currWidth.includes("%")
          ? `${Math.max(parseInt(currWidth) * reductionFactor, 20)}%`
          : `${Math.max(parseInt(currWidth) * reductionFactor, 100)}px`;

        // Adjust padding too
        const sidebarPadding = parseInt(
          window.getComputedStyle(sidebar).padding
        );
        sidebar.style.padding = `${Math.max(
          sidebarPadding * (compactMode ? 0.7 : 0.9),
          8
        )}px`;
      }

      // Ensure links have proper styles for PDF
      const cloneLinks = clone.querySelectorAll("a");
      cloneLinks.forEach((linkElement) => {
        const link = linkElement as HTMLAnchorElement;
        if (link instanceof HTMLAnchorElement) {
          link.style.display = "inline-block";
          link.style.textDecoration = "underline";
          link.style.fontWeight = "bold";
          link.style.color = "#0000EE";
          link.setAttribute("target", "_blank");

          // Add a class for easier identification
          link.classList.add("pdf-export-link");

          // Add extra padding for better clickable area
          link.style.padding = "2px";

          // Set a data-original-href attribute for link processing
          const href = link.getAttribute("href") || "";
          link.setAttribute("data-original-href", href);

          // Make sure the href is set properly
          const formattedUrl = formatUrl(href);
          link.setAttribute("href", formattedUrl);

          // Make link origin more visible for debugging
          console.log(`Processing link: ${href} → ${formattedUrl}`);
        }
      });

      // Use html2canvas with improved settings for text rendering
      const canvas = await html2canvas(clone, {
        scale: compactMode ? 1.4 : 1.5, // Slightly lower scale for compact mode
        backgroundColor: "#FFFFFF",
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
        scrollX: 0,
        scrollY: 0,
        width: clone.offsetWidth,
        height: clone.offsetHeight,
      });

      // Create a PDF with appropriate dimensions
      const format =
        currentResume.theme.paperSize === "letter"
          ? "letter"
          : currentResume.theme.paperSize === "legal"
          ? "legal"
          : "a4";

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: format,
        compress: true,
        putOnlyUsedFonts: true,
        floatPrecision: 16,
        hotfixes: ["px_scaling"], // Fix scaling issues
      });

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to maintain aspect ratio but ensure content fits
      const imgWidth = pdfWidth * 0.95; // Use 95% of page width to ensure margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Capture the positions of links from the clone instead of the original
      // This ensures our scaling and transformations are accounted for
      const linkPositions = Array.from(clone.querySelectorAll("a"))
        .filter(
          (link): link is HTMLAnchorElement => link instanceof HTMLAnchorElement
        )
        .map((link: HTMLAnchorElement) => {
          // Get bounding rect of the link within the canvas
          const rect = link.getBoundingClientRect();
          const cloneRect = clone.getBoundingClientRect();

          // Calculate position relative to the clone
          const x =
            (rect.left - cloneRect.left) * (imgWidth / clone.offsetWidth);
          const y =
            (rect.top - cloneRect.top) * (imgHeight / clone.offsetHeight);
          const width = rect.width * (imgWidth / clone.offsetWidth);
          const height = rect.height * (imgHeight / clone.offsetHeight);

          // Calculate which page this link is on
          const page = Math.floor(y / pdfHeight);

          // Get URL from data attribute or href
          const url = formatUrl(
            link.getAttribute("data-original-href") || link.href
          );

          return {
            url,
            x,
            y: y - page * pdfHeight, // Adjust y position for current page
            width: Math.max(width, 10), // Ensure minimum clickable area
            height: Math.max(height, 10),
            page,
          };
        })
        .filter(Boolean); // Remove any null entries

      try {
        // Set PDF metadata for better file properties
        pdf.setProperties({
          title: `${currentResume.name} - Resume`,
          subject: "Resume",
          author:
            currentResume.sections.find((s) => s.type === "personal")?.data
              ?.name || "Resume Builder User",
          keywords: "resume, cv",
          creator: "Resume Builder App",
        });

        // Get the image data as JPEG (more reliable than PNG for PDFs)
        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // If the image is taller than the page, we need multiple pages
        if (imgHeight <= pdfHeight) {
          // Image fits on one page
          const x = (pdfWidth - imgWidth) / 2; // Center image horizontally
          pdf.addImage(imgData, "JPEG", x, 0, imgWidth, imgHeight);

          // Add links for the single page - process with improved visibility for debugging
          console.log(`Adding ${linkPositions.length} links to PDF`);
          linkPositions
            .filter((link) => link.page === 0)
            .forEach((link, index) => {
              // Ensure link dimensions are reasonable
              const minWidth = 10;
              const minHeight = 10;
              try {
                // Add the link with adjustments to ensure it's clickable
                pdf.link(
                  link.x + x,
                  link.y,
                  Math.max(link.width, minWidth),
                  Math.max(link.height, minHeight),
                  { url: link.url }
                );
                console.log(`Added link ${index + 1}: ${link.url}`);
              } catch (e) {
                console.error(`Error adding link ${link.url}:`, e);
              }
            });
        } else {
          // Image needs multiple pages
          const pageCount = Math.ceil(imgHeight / pdfHeight);

          // For each page
          for (let i = 0; i < pageCount; i++) {
            // If not the first page, add a new page
            if (i > 0) {
              pdf.addPage();
            }

            // Calculate the position for this page
            const position = -i * pdfHeight;
            const x = (pdfWidth - imgWidth) / 2; // Center image horizontally

            // Add the image with the appropriate position
            pdf.addImage(imgData, "JPEG", x, position, imgWidth, imgHeight);

            // Add links for this page with improved handling
            const pageLinks = linkPositions.filter((link) => link.page === i);
            console.log(`Adding ${pageLinks.length} links to page ${i + 1}`);

            pageLinks.forEach((link, index) => {
              // Ensure link dimensions are reasonable
              const minWidth = 10;
              const minHeight = 10;
              try {
                pdf.link(
                  link.x + x,
                  link.y,
                  Math.max(link.width, minWidth),
                  Math.max(link.height, minHeight),
                  { url: link.url }
                );
                console.log(
                  `Added link ${index + 1} to page ${i + 1}: ${link.url}`
                );
              } catch (e) {
                console.error(
                  `Error adding link ${link.url} to page ${i + 1}:`,
                  e
                );
              }
            });
          }
        }

        // Save the PDF
        pdf.save(`${currentResume.name}.pdf`);
      } catch (error) {
        console.error("Error creating PDF from image data:", error);
        // Fallback to a simpler PDF without images if there's an error
        const fallbackPdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: format,
        });

        fallbackPdf.text(
          "We encountered an error creating your PDF. Please try again later.",
          40,
          40
        );
        fallbackPdf.save(`${currentResume.name}_error.pdf`);
      }

      // Clean up temporary elements
      cleanupPdfRenderingElements([container, statusElement]);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Apply specific styling to different resume sections for better PDF rendering
  const applyPDFStyles = (container: HTMLElement, themeConfig: Theme) => {
    // Fix section headers
    const sectionHeaders = container.querySelectorAll(".section-header");
    sectionHeaders.forEach((header) => {
      if (header instanceof HTMLElement) {
        header.style.marginBottom = "8px";
        header.style.pageBreakAfter = "avoid";
        header.style.fontWeight = "bold";
        header.style.color = themeConfig.primaryColor;
      }
    });

    // Improve contact info display
    const contactInfo = container.querySelector(".contact-info");
    if (contactInfo instanceof HTMLElement) {
      contactInfo.style.marginBottom = "15px";
      contactInfo.style.pageBreakInside = "avoid";

      // Format contact links
      const links = contactInfo.querySelectorAll("a");
      links.forEach((link) => {
        if (link instanceof HTMLElement) {
          link.style.marginRight = "10px";
          link.style.display = "inline-block";
        }
      });
    }

    // Format work experience entries
    const workEntries = container.querySelectorAll(
      ".work-entry, .education-entry, .project-entry"
    );
    workEntries.forEach((entry) => {
      if (entry instanceof HTMLElement) {
        entry.style.marginBottom = "12px";
        entry.style.pageBreakInside = "avoid";

        // Format dates and company names
        const dates = entry.querySelectorAll(".date-range");
        dates.forEach((date) => {
          if (date instanceof HTMLElement) {
            date.style.fontStyle = "italic";
            date.style.color = themeConfig.textColor;
          }
        });

        // Format job titles
        const titles = entry.querySelectorAll(
          ".job-title, .degree, .project-title"
        );
        titles.forEach((title) => {
          if (title instanceof HTMLElement) {
            title.style.fontWeight = "bold";
            title.style.color = themeConfig.textColor;
          }
        });
      }
    });

    // Improve bullet points
    const bulletPoints = container.querySelectorAll("li, .bullet-point");
    bulletPoints.forEach((bullet) => {
      if (bullet instanceof HTMLElement) {
        bullet.style.marginBottom = "4px";
        bullet.style.pageBreakInside = "avoid";
        bullet.style.listStylePosition = "outside";
        bullet.style.marginLeft = "20px";
      }
    });

    // Ensure skills are displayed properly
    const skills = container.querySelectorAll(".skill-item, .skill-tag");
    skills.forEach((skill) => {
      if (skill instanceof HTMLElement) {
        skill.style.display = "inline-block";
        skill.style.margin = "3px";
        skill.style.padding = "2px 8px";
        skill.style.border = `1px solid ${themeConfig.primaryColor}`;
        skill.style.borderRadius = "4px";
        skill.style.color = themeConfig.textColor;
        skill.style.pageBreakInside = "avoid";
      }
    });
  };

  // Helper function to remove PDF-specific styles
  const removePDFStyles = (element: HTMLElement) => {
    const styledElements = element.querySelectorAll("[style]");
    styledElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.removeAttribute("style");
      }
    });
  };

  // Helper function to enhance clone styling for PDF export
  const enhanceCloneForPDF = (document: Document, themeConfig: Theme) => {
    const resumePreview = document.getElementById("resume-preview");
    if (!resumePreview) return;

    // Fix font rendering issues
    const styles = document.createElement("style");
    styles.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
      
      * {
        font-family: 'Roboto', Arial, Helvetica, sans-serif !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        letter-spacing: 0.01em !important;
        word-spacing: 0.05em !important;
        text-rendering: geometricPrecision !important;
      }
      
      /* Force all text elements to have consistent rendering */
      p, span, h1, h2, h3, h4, h5, h6, div, li, a {
        overflow: visible !important;
        white-space: normal !important;
        word-break: normal !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
        line-height: 1.5 !important;
        letter-spacing: 0.01em !important;
        font-feature-settings: 'kern' 1, 'liga' 0 !important;
      }
      
      /* Convert flexbox to block for better rendering */
      .flex, [class*="flex-"] {
        display: block !important;
        width: 100% !important;
      }
      
      /* Prevent grid layout issues */
      .grid, [class*="grid-"] {
        display: block !important;
      }
      
      /* Handle list items properly */
      li {
        display: list-item !important;
        page-break-inside: avoid !important;
      }
      
      /* Ensure links are properly formatted */
      a {
        color: ${themeConfig.primaryColor} !important;
        text-decoration: underline !important;
        font-weight: 600 !important;
        display: inline-block !important;
        word-break: break-all !important;
      }
    `;
    document.head.appendChild(styles);

    // Make sure all elements are visible
    const allElements = resumePreview.querySelectorAll("*");
    allElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.color = getComputedStyle(el).color;
        el.style.visibility = "visible";
        el.style.opacity = "1";

        // Force proper font and text rendering
        el.style.fontFamily = "'Roboto', Arial, Helvetica, sans-serif";
        el.style.textRendering = "geometricPrecision";

        // Set consistent spacing
        el.style.letterSpacing = "0.01em";
        el.style.wordSpacing = "0.05em";

        // Ensure proper display
        if (el.tagName === "A") {
          el.style.display = "inline-block";
          el.style.wordBreak = "break-all";
        } else if (
          ["P", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "SPAN"].includes(
            el.tagName
          )
        ) {
          el.style.display = "block";
          el.style.whiteSpace = "normal";
          el.style.overflow = "visible";
          el.style.maxWidth = "100%";
        }
      }
    });

    // Add specific styles for different section types based on theme
    applyPDFStyles(resumePreview, themeConfig);
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
              type="button"
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
              type="button"
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

  // Helper function to render a list of sections
  const renderSections = (sections: ResumeSection[]) => {
    return sections.map((section) => (
      <div
        key={section.id}
        // Add class for page break control
        className={`resume-section page-break-inside-avoid ${
          theme.sectionStyle === "card"
            ? `p-3 mb-4 ${borderRadiusClass} shadow-sm`
            : "" // Adjusted padding/margin for card
        } ${
          theme.sectionStyle === "bordered" ? `border-l-4 pl-3 mb-4` : "" // Adjusted padding/margin for bordered
        } ${
          theme.sectionStyle === "minimal" ? `pt-2 mb-4` : "" // Added margin for minimal
        }`}
        style={{
          backgroundColor:
            theme.sectionStyle === "card"
              ? theme.primaryColor + "10"
              : "transparent",
          borderColor: theme.primaryColor,
          // Add page break avoidance for sections themselves
          // breakInside: 'avoid-page', // CSS standard, might help some renderers
        }}>
        <h2
          // Add class for page break control
          className={`text-xl mb-2 page-break-after-avoid ${
            // Avoid break right after title
            theme.headerStyle === "bold"
              ? "font-bold uppercase tracking-wider"
              : "font-semibold"
          } ${theme.headerStyle === "minimal" ? "border-b pb-1" : ""}`}
          style={{
            color: theme.primaryColor,
            borderColor: theme.secondaryColor,
          }}>
          {section.title}
        </h2>
        {/* Render Section Content */}
        {renderSectionContent(section, theme, borderRadiusClass)}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Resume Preview</h1>
          <div className="flex space-x-4">
            <div className="flex items-center mr-4">
              <input
                type="checkbox"
                id="compact-mode"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="compact-mode"
                className="ml-2 text-sm text-gray-700">
                Compact PDF
              </label>
            </div>
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Resume
            </button>
            <button
              onClick={exportToPDF}
              disabled={isExporting}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${
                  isExporting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}>
              {isExporting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Export to PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* PDF Export Info Message */}
        {showPdfInfo && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <span className="font-bold">PDF Export Fixed!</span> We've
                  added a "Compact PDF" option to ensure your content fits
                  properly in the PDF. Toggle it on if your resume content is
                  getting cut off, or off if you prefer a more spacious layout.
                </p>
                <button
                  className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setShowPdfInfo(false)}>
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resume preview */}
        <div
          id="resume-preview"
          ref={resumeRef}
          style={{
            fontFamily: theme.fontFamily,
            color: theme.textColor,
            backgroundColor: theme.backgroundColor,
            lineHeight: `${lineHeightStyle}`,
            fontWeight: fontWeightStyle,
            width:
              theme.paperSize === "letter"
                ? "8.5in"
                : theme.paperSize === "legal"
                ? "8.5in"
                : "210mm",
            minHeight:
              theme.paperSize === "letter"
                ? "11in"
                : theme.paperSize === "legal"
                ? "14in"
                : "297mm",
            display: "flex",
            flexDirection:
              theme.layoutType === "two-column-right" ? "row-reverse" : "row",
            overflow: "hidden",
            maxWidth: "100%",
            boxSizing: "border-box",
            breakInside: "avoid",
          }}
          className={`resume-preview-container shadow-lg mx-auto rounded overflow-hidden ${fontSizeClass}`}>
          {/* Inject Custom CSS */}
          {theme.customCSS && (
            <style dangerouslySetInnerHTML={{ __html: theme.customCSS }} />
          )}

          {/* --- Main Content Column --- */}
          <div
            className={`main-content-col flex-grow p-8 ${spacingClass}`} // Use padding from theme
            // Ensure main column takes remaining space
            style={{
              flex: "1",
              minWidth: 0, // Prevents overflow issues
              overflowWrap: "break-word", // Ensure long words break properly
              wordBreak: "break-word",
            }}>
            {renderSections(mainSectionsContent)}
          </div>

          {/* --- Sidebar Column (Conditional) --- */}
          {theme.layoutType !== "single-column" &&
            sidebarSectionsContent.length > 0 && (
              <div
                className={`sidebar-col p-6 ${spacingClass}`} // Use padding from theme
                style={{
                  width: theme.sidebarWidth,
                  backgroundColor: theme.sidebarBackgroundColor,
                  color: theme.sidebarTextColor,
                  flexShrink: 0, // Prevent sidebar from shrinking
                  overflowWrap: "break-word", // Ensure long words break properly
                  wordBreak: "break-word",
                }}>
                {renderSections(sidebarSectionsContent)}
              </div>
            )}
        </div>
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

// Updated PersonalInfoPreview to use the shared formatUrl function
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
            className="pdf-link"
            style={{
              color: theme.primaryColor,
              textDecoration: "underline",
              fontWeight: "600",
            }}>
            {formatUrl(data.website)}
          </a>
        )}
        {data.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-link"
            style={{
              color: theme.primaryColor,
              textDecoration: "underline",
              fontWeight: "600",
            }}>
            LinkedIn
          </a>
        )}
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className="pdf-link"
            style={{
              color: theme.primaryColor,
              textDecoration: "underline",
              fontWeight: "600",
            }}>
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
    <div className="space-y-3">
      {data.map((exp, index) => (
        <div key={exp.id || index} className="page-break-inside-avoid">
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
            <ul className="mt-1 list-disc list-inside text-sm space-y-1 page-break-inside-avoid">
              {exp.bullets.map(
                (bullet: string, i: number) =>
                  bullet && (
                    <li key={i} className="page-break-inside-avoid">
                      {bullet}
                    </li>
                  )
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
    <div className="space-y-3">
      {data.map((edu, index) => (
        <div key={edu.id || index} className="page-break-inside-avoid">
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
        <div key={category.id || index} className="page-break-inside-avoid">
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
        <div key={lang.id || index} className="text-sm page-break-inside-avoid">
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
    <div className="space-y-3">
      {data.map((proj, index) => (
        <div key={proj.id || index} className="text-sm page-break-inside-avoid">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{proj.name || "Project Name"}</h3>
            {proj.date && (
              <p className="text-xs whitespace-nowrap pl-4">{proj.date}</p>
            )}
          </div>
          {proj.role && (
            <p
              className="text-xs italic mb-1"
              style={{ color: theme.secondaryColor }}>
              {proj.role}
            </p>
          )}
          {proj.description && (
            <p className="text-xs mb-1">{proj.description}</p>
          )}

          {/* Display link with proper formatting */}
          {proj.link && (
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs pdf-link"
              style={{
                color: theme.primaryColor,
                textDecoration: "underline",
                fontWeight: "600",
              }}>
              {formatUrl(proj.link)}
            </a>
          )}

          {/* Skills/Technologies */}
          {proj.technologies && proj.technologies.length > 0 && (
            <div className="mt-1 text-xs">
              <span className="font-semibold">Technologies: </span>
              <span>{proj.technologies.join(", ")}</span>
            </div>
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
        <div key={cert.id || index} className="text-sm page-break-inside-avoid">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">
              {cert.name || "Certification Name"}
            </h3>
            <p className="text-xs whitespace-nowrap pl-4">
              {cert.date || "Date"}
            </p>
          </div>
          <div className="flex justify-between items-start flex-wrap">
            <p className="text-xs" style={{ color: theme.secondaryColor }}>
              {cert.issuer || "Issuer"}
            </p>
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs pdf-link"
                style={{
                  color: theme.primaryColor,
                  textDecoration: "underline",
                  fontWeight: "600",
                  marginTop: "2px",
                }}>
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
        <div key={pub.id || index} className="text-sm page-break-inside-avoid">
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
              className="text-xs pdf-link"
              style={{
                color: theme.primaryColor,
                textDecoration: "underline",
                fontWeight: "600",
              }}>
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
