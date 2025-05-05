/**
 * Utility functions for PDF export and handling
 */

/**
 * Ensures fonts are properly loaded before generating a PDF
 * @returns Promise that resolves when fonts are ready
 */
export const ensureFontsLoaded = async (): Promise<void> => {
  // First wait for document fonts to be ready
  await document.fonts.ready;

  // Add Roboto font for consistent rendering
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
  document.head.appendChild(fontLink);

  // Give some time for the fonts to load
  await new Promise((resolve) => setTimeout(resolve, 300));

  return Promise.resolve();
};

/**
 * Applies consistent styles to text elements to prevent rendering issues
 * @param element The HTML element to process
 */
export const applyTextRenderingFixes = (element: HTMLElement): void => {
  if (!element) return;

  // First, scale down the content slightly to ensure it fits better
  element.style.transform = "scale(0.95)";
  element.style.transformOrigin = "top left";

  // Apply to all text elements
  const textElements = element.querySelectorAll(
    "p, span, h1, h2, h3, h4, h5, h6, div, li, a"
  );
  textElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      // Fix text rendering
      el.style.letterSpacing = "0";
      el.style.wordSpacing = "0.02em";
      el.style.textRendering = "geometricPrecision";
      el.style.fontKerning = "normal";
      el.style.fontFeatureSettings = "'kern' 1, 'liga' 0";

      // Fix visibility and overflow
      el.style.overflow = "visible";
      el.style.whiteSpace = "normal";
      el.style.lineHeight = "1.2";

      // Fix position and dimensions
      el.style.position = "relative";
      el.style.maxWidth = "100%";

      // Make text slightly smaller
      const currentSize = window.getComputedStyle(el).fontSize;
      const size = parseFloat(currentSize);
      if (!isNaN(size)) {
        // Reduce by 5-10% depending on element type
        const reduction = el.tagName.match(/^H[1-3]$/) ? 0.95 : 0.9;
        el.style.fontSize = `${size * reduction}px`;
      }

      // Minimize margins and padding
      el.style.margin = "0";
      el.style.padding = "0";
    }
  });

  // Convert flexbox to block for better rendering
  const flexElements = element.querySelectorAll('.flex, [class*="flex-"]');
  flexElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.display = "block";
      el.style.width = "100%";
      el.style.marginBottom = "2px";
    }
  });

  // Ensure grid elements display properly
  const gridElements = element.querySelectorAll('.grid, [class*="grid-"]');
  gridElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.display = "block";
      el.style.width = "100%";
    }
  });

  // Reduce spacing between elements
  const spacingElements = element.querySelectorAll(
    ".space-y-3, .space-y-5, .space-y-8"
  );
  spacingElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.classList.remove("space-y-3", "space-y-5", "space-y-8");
      el.classList.add("space-y-1");
    }
  });

  // Compress headings
  const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => {
    if (heading instanceof HTMLElement) {
      heading.style.marginTop = "3px";
      heading.style.marginBottom = "2px";
      heading.style.lineHeight = "1.1";
    }
  });

  // Ensure sections take less space
  const sections = element.querySelectorAll(".resume-section");
  sections.forEach((section) => {
    if (section instanceof HTMLElement) {
      section.style.marginBottom = "4px";
      section.style.paddingTop = "2px";
      section.style.paddingBottom = "2px";
    }
  });

  // Ensure links are properly formatted
  const links = element.querySelectorAll("a");
  links.forEach((link) => {
    if (link instanceof HTMLElement) {
      link.style.display = "inline-block";
      link.style.wordBreak = "break-all";
      link.style.fontWeight = "bold";
      link.style.textDecoration = "underline";
      link.style.padding = "0";
      link.style.margin = "0";
    }
  });
};

/**
 * Creates an isolated clone of an element for PDF rendering
 * @param element Original element to clone
 * @returns The cloned element in an offscreen container
 */
export const createPdfRenderingClone = (
  element: HTMLElement
): {
  clone: HTMLElement;
  container: HTMLElement;
} => {
  if (!element) {
    throw new Error("Element not provided for cloning");
  }

  // Create clone
  const clone = element.cloneNode(true) as HTMLElement;

  // Create temporary offscreen container
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.opacity = "0";
  container.style.pointerEvents = "none";
  container.style.zIndex = "-1000";

  // Add the clone to the container
  container.appendChild(clone);

  // Add the container to the document
  document.body.appendChild(container);

  // Add PDF rendering class
  clone.classList.add("pdf-rendering");

  return { clone, container };
};

/**
 * Process URLs to ensure they have proper formatting
 * @param url The URL to process
 * @returns Properly formatted URL
 */
export const formatUrl = (url: string): string => {
  if (!url) return "";

  // Remove extra spaces
  let formattedUrl = url.trim();

  // First check if it's already a complete URL with a protocol
  if (formattedUrl.match(/^(https?|mailto|tel):/i)) {
    return formattedUrl; // Already has a valid protocol
  }

  // Handle anchor links (internal links)
  if (formattedUrl.startsWith("#")) {
    // Convert to a full URL to ensure PDF compatibility
    const currentUrl = window.location.href.split("#")[0];
    return `${currentUrl}${formattedUrl}`;
  }

  // Handle email addresses
  if (formattedUrl.includes("@") && !formattedUrl.includes(" ")) {
    return "mailto:" + formattedUrl;
  }

  // Handle phone numbers
  if (/^[\+\d\s\(\)\-]{7,}$/.test(formattedUrl)) {
    // Remove all non-digit characters for tel: links
    const digitsOnly = formattedUrl.replace(/[^\d+]/g, "");
    return "tel:" + digitsOnly;
  }

  // If it looks like a domain (contains a dot and no spaces)
  if (
    formattedUrl.includes(".") &&
    !formattedUrl.includes(" ") &&
    !formattedUrl.includes("/")
  ) {
    // It's likely a domain name without protocol
    return "https://" + formattedUrl;
  }

  // For everything else, assume it's a web URL needing https://
  if (
    !formattedUrl.startsWith("http://") &&
    !formattedUrl.startsWith("https://")
  ) {
    formattedUrl = "https://" + formattedUrl;
  }

  return formattedUrl;
};

/**
 * Cleanup the temporary elements created for PDF rendering
 * @param elements List of elements to remove from the DOM
 */
export const cleanupPdfRenderingElements = (elements: HTMLElement[]): void => {
  if (!elements || !elements.length) return;

  elements.forEach((element) => {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};
