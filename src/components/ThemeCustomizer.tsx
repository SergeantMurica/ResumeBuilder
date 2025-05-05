import { Theme } from "../types";

interface ThemeCustomizerProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeCustomizer = ({ theme, setTheme }: ThemeCustomizerProps) => {
  const updateTheme = (key: keyof Theme, value: any) => {
    setTheme({ ...theme, [key]: value });
  };

  const handleSidebarSectionsChange = (type: string) => {
    const currentSections = theme.sidebarSections || [];
    let newSections;
    if (currentSections.includes(type)) {
      newSections = currentSections.filter((t) => t !== type);
    } else {
      newSections = [...currentSections, type];
    }
    updateTheme("sidebarSections", newSections);
  };

  const colorOptions = [
    { value: "#4f46e5", label: "Indigo" },
    { value: "#1d4ed8", label: "Blue" },
    { value: "#0891b2", label: "Cyan" },
    { value: "#0d9488", label: "Teal" },
    { value: "#65a30d", label: "Lime" },
    { value: "#16a34a", label: "Green" },
    { value: "#ca8a04", label: "Yellow" },
    { value: "#ea580c", label: "Orange" },
    { value: "#dc2626", label: "Red" },
    { value: "#db2777", label: "Pink" },
    { value: "#9333ea", label: "Purple" },
    { value: "#111827", label: "Dark" },
    { value: "#f3f4f6", label: "Light" },
    { value: "#ffffff", label: "White" },
    { value: "#000000", label: "Black" },
  ];

  const fontOptions = [
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Lato", label: "Lato" },
    { value: "Poppins", label: "Poppins" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Merriweather", label: "Merriweather" },
    { value: "Georgia", label: "Georgia" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Verdana", label: "Verdana" },
    { value: "Courier New", label: "Courier New" },
    { value: "Gill Sans", label: "Gill Sans" },
    { value: "Trebuchet MS", label: "Trebuchet MS" },
  ];

  const sizeOptions = [
    { value: "extra-small", label: "Extra Small" },
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "extra-large", label: "Extra Large" },
  ];

  const radiusOptions = [
    { value: "none", label: "None" },
    { value: "xs", label: "Extra Small" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" },
    { value: "full", label: "Full" },
  ];

  const spacingOptions = [
    { value: "compact", label: "Compact" },
    { value: "normal", label: "Normal" },
    { value: "relaxed", label: "Relaxed" },
    { value: "expanded", label: "Expanded" },
  ];

  const headerStyleOptions = [
    { value: "simple", label: "Simple" },
    { value: "modern", label: "Modern" },
    { value: "classic", label: "Classic" },
    { value: "minimal", label: "Minimal" },
    { value: "bold", label: "Bold" },
    { value: "fancy", label: "Fancy" },
  ];

  const sectionStyleOptions = [
    { value: "card", label: "Card" },
    { value: "flat", label: "Flat" },
    { value: "bordered", label: "Bordered" },
    { value: "minimal", label: "Minimal" },
    { value: "borderless", label: "Borderless" },
    { value: "shadowed", label: "Shadowed" },
  ];

  const fontWeightOptions = [
    { value: "light", label: "Light" },
    { value: "normal", label: "Normal" },
    { value: "medium", label: "Medium" },
    { value: "semibold", label: "Semi-Bold" },
    { value: "bold", label: "Bold" },
    { value: "extrabold", label: "Extra Bold" },
  ];

  const paperSizeOptions = [
    { value: "a4", label: "A4" },
    { value: "letter", label: "Letter" },
    { value: "legal", label: "Legal" },
    { value: "custom", label: "Custom" },
  ];

  const lineHeightOptions = [
    { value: "tight", label: "Tight" },
    { value: "normal", label: "Normal" },
    { value: "relaxed", label: "Relaxed" },
    { value: "loose", label: "Loose" },
    { value: "extra-loose", label: "Extra Loose" },
  ];

  const layoutTypeOptions = [
    { value: "single-column", label: "Single Column" },
    { value: "two-column-left", label: "Two Column (Sidebar Left)" },
    { value: "two-column-right", label: "Two Column (Sidebar Right)" },
    { value: "three-column", label: "Three Column" },
  ];

  const widthOptions = [
    "25%",
    "30%",
    "35%",
    "40%",
    "45%",
    "50%",
    "55%",
    "60%",
    "65%",
    "70%",
    "75%",
    "80%",
    "85%",
    "90%",
    "95%",
    "100%",
  ];

  const availableSectionTypes = [
    "personalInfo",
    "skills",
    "languages",
    "workExperience",
    "education",
    "projects",
    "achievements",
    "certificates",
    "interests",
  ];

  const ThemePreview = () => {
    return (
      <div
        className="border rounded-lg p-4 h-64 overflow-hidden"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
          borderRadius:
            theme.borderRadius === "none"
              ? "0"
              : theme.borderRadius === "sm"
              ? "0.125rem"
              : theme.borderRadius === "md"
              ? "0.375rem"
              : "0.5rem",
        }}>
        <div
          className="mb-4 pb-2 border-b"
          style={{
            borderColor: theme.primaryColor,
            fontWeight:
              theme.fontWeight === "light"
                ? 300
                : theme.fontWeight === "normal"
                ? 400
                : theme.fontWeight === "medium"
                ? 500
                : theme.fontWeight === "semibold"
                ? 600
                : 700,
          }}>
          <h2 className="text-xl mb-1" style={{ color: theme.primaryColor }}>
            Resume Preview
          </h2>
          <p className="text-sm" style={{ color: theme.secondaryColor }}>
            This is how your theme looks
          </p>
        </div>

        <div className="mb-3">
          <h3
            className="text-base font-medium mb-1"
            style={{ color: theme.primaryColor }}>
            Sample Section
          </h3>
          <p
            className="text-sm"
            style={{
              lineHeight:
                theme.lineHeight === "tight"
                  ? 1.25
                  : theme.lineHeight === "normal"
                  ? 1.5
                  : 1.75,
            }}>
            This is an example of how your content will appear with the selected
            theme settings.
          </p>
        </div>

        <div
          className="p-2 mt-2 rounded"
          style={{
            backgroundColor:
              theme.sectionStyle === "card"
                ? theme.primaryColor + "10"
                : "transparent",
            borderLeft:
              theme.sectionStyle === "bordered"
                ? `3px solid ${theme.primaryColor}`
                : "none",
          }}>
          <span
            className="text-sm font-medium"
            style={{ color: theme.secondaryColor }}>
            Themed element
          </span>
          <div className="flex mt-1 gap-2">
            <span
              className="inline-block px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: theme.accentColor + "30",
                color: theme.accentColor,
              }}>
              Tag 1
            </span>
            <span
              className="inline-block px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: theme.primaryColor + "30",
                color: theme.primaryColor,
              }}>
              Tag 2
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Theme Customization</h2>
        <ThemePreview />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Colors</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    type="button"
                    key={color.value}
                    className={`w-8 h-8 rounded-full ${
                      theme.primaryColor === color.value
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateTheme("primaryColor", color.value)}
                    title={color.label}
                  />
                ))}
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme("primaryColor", e.target.value)}
                  className="w-8 h-8 rounded-full"
                  title="Custom color"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    type="button"
                    key={color.value}
                    className={`w-8 h-8 rounded-full ${
                      theme.secondaryColor === color.value
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateTheme("secondaryColor", color.value)}
                    title={color.label}
                  />
                ))}
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) =>
                    updateTheme("secondaryColor", e.target.value)
                  }
                  className="w-8 h-8 rounded-full"
                  title="Custom color"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    type="button"
                    key={color.value}
                    className={`w-8 h-8 rounded-full ${
                      theme.accentColor === color.value
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateTheme("accentColor", color.value)}
                    title={color.label}
                  />
                ))}
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) => updateTheme("accentColor", e.target.value)}
                  className="w-8 h-8 rounded-full"
                  title="Custom color"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Color
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "#000000", label: "Black" },
                  { value: "#1f2937", label: "Dark Gray" },
                  { value: "#4b5563", label: "Gray" },
                  { value: "#6b7280", label: "Medium Gray" },
                ].map((color) => (
                  <button
                    type="button"
                    key={color.value}
                    className={`w-8 h-8 rounded-full ${
                      theme.textColor === color.value
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateTheme("textColor", color.value)}
                    title={color.label}
                  />
                ))}
                <input
                  type="color"
                  value={theme.textColor}
                  onChange={(e) => updateTheme("textColor", e.target.value)}
                  className="w-8 h-8 rounded-full"
                  title="Custom color"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "#ffffff", label: "White" },
                  { value: "#f9fafb", label: "Light Gray" },
                  { value: "#f3f4f6", label: "Gray" },
                  { value: "#f0f9ff", label: "Light Blue" },
                  { value: "#ecfdf5", label: "Light Green" },
                ].map((color) => (
                  <button
                    type="button"
                    key={color.value}
                    className={`w-8 h-8 rounded-full border border-gray-200 ${
                      theme.backgroundColor === color.value
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateTheme("backgroundColor", color.value)}
                    title={color.label}
                  />
                ))}
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    updateTheme("backgroundColor", e.target.value)
                  }
                  className="w-8 h-8 rounded-full"
                  title="Custom color"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Typography & Layout</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                aria-label="Font Family"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.fontFamily}
                onChange={(e) => updateTheme("fontFamily", e.target.value)}>
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Weight
              </label>
              <select
                aria-label="Font Weight"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.fontWeight}
                onChange={(e) => updateTheme("fontWeight", e.target.value)}>
                {fontWeightOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                aria-label="Font Size"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.fontSize}
                onChange={(e) => updateTheme("fontSize", e.target.value)}>
                {sizeOptions.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line Height
              </label>
              <select
                aria-label="Line Height"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.lineHeight}
                onChange={(e) => updateTheme("lineHeight", e.target.value)}>
                {lineHeightOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius
              </label>
              <select
                aria-label="Border Radius"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.borderRadius}
                onChange={(e) => updateTheme("borderRadius", e.target.value)}>
                {radiusOptions.map((radius) => (
                  <option key={radius.value} value={radius.value}>
                    {radius.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spacing
              </label>
              <select
                aria-label="Spacing"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.spacing}
                onChange={(e) => updateTheme("spacing", e.target.value)}>
                {spacingOptions.map((spacing) => (
                  <option key={spacing.value} value={spacing.value}>
                    {spacing.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paper Size
              </label>
              <select
                aria-label="Paper Size"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.paperSize}
                onChange={(e) => updateTheme("paperSize", e.target.value)}>
                {paperSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Style Options</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Style
              </label>
              <select
                aria-label="Header Style"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.headerStyle}
                onChange={(e) => updateTheme("headerStyle", e.target.value)}>
                {headerStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Style
              </label>
              <select
                aria-label="Section Style"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.sectionStyle}
                onChange={(e) => updateTheme("sectionStyle", e.target.value)}>
                {sectionStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom CSS
              </label>
              <textarea
                rows={5}
                className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
                value={theme.customCSS || ""}
                onChange={(e) => updateTheme("customCSS", e.target.value)}
                placeholder=".resume-section h3 { font-style: italic; }"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add custom CSS rules to further customize your resume
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Layout Type
              </label>
              <select
                aria-label="Layout Type"
                className="block w-full p-2 border border-gray-300 rounded-md"
                value={theme.layoutType}
                onChange={(e) => updateTheme("layoutType", e.target.value)}>
                {layoutTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sidebar Width (Only show if two-column) */}
            {theme.layoutType !== "single-column" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sidebar Width
                </label>
                <select
                  aria-label="Sidebar Width"
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  value={theme.sidebarWidth}
                  onChange={(e) => updateTheme("sidebarWidth", e.target.value)}>
                  {widthOptions.map((width) => (
                    <option key={width} value={width}>
                      {width}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sidebar Background Color (Only show if two-column) */}
            {theme.layoutType !== "single-column" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sidebar Background
                </label>
                <input
                  type="color"
                  value={theme.sidebarBackgroundColor}
                  onChange={(e) =>
                    updateTheme("sidebarBackgroundColor", e.target.value)
                  }
                  className="w-full h-10 p-1 border border-gray-300 rounded-md"
                  title="Sidebar Background Color"
                />
              </div>
            )}

            {/* Sidebar Text Color (Only show if two-column) */}
            {theme.layoutType !== "single-column" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sidebar Text Color
                </label>
                <input
                  type="color"
                  value={theme.sidebarTextColor}
                  onChange={(e) =>
                    updateTheme("sidebarTextColor", e.target.value)
                  }
                  className="w-full h-10 p-1 border border-gray-300 rounded-md"
                  title="Sidebar Text Color"
                />
              </div>
            )}

            {/* Sidebar Sections (Only show if two-column) */}
            {theme.layoutType !== "single-column" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sections in Sidebar
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSectionTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSidebarSectionsChange(type)}
                      className={`px-3 py-1 rounded text-sm border ${
                        (theme.sidebarSections || []).includes(type)
                          ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Select which section types appear in the sidebar.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Presets</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: "Professional",
                theme: {
                  primaryColor: "#1d4ed8",
                  secondaryColor: "#3b82f6",
                  textColor: "#1f2937",
                  backgroundColor: "#ffffff",
                  fontFamily: "Roboto",
                  fontSize: "medium",
                  borderRadius: "md",
                  spacing: "normal",
                  headerStyle: "modern",
                  sectionStyle: "bordered",
                  accentColor: "#0ea5e9",
                  fontWeight: "normal",
                  lineHeight: "normal",
                },
              },
              {
                name: "Minimal",
                theme: {
                  primaryColor: "#111827",
                  secondaryColor: "#4b5563",
                  textColor: "#1f2937",
                  backgroundColor: "#ffffff",
                  fontFamily: "Inter",
                  fontSize: "small",
                  borderRadius: "none",
                  spacing: "compact",
                  headerStyle: "minimal",
                  sectionStyle: "flat",
                  accentColor: "#6b7280",
                  fontWeight: "light",
                  lineHeight: "tight",
                },
              },
              {
                name: "Creative",
                theme: {
                  primaryColor: "#9333ea",
                  secondaryColor: "#c084fc",
                  textColor: "#1f2937",
                  backgroundColor: "#f9fafb",
                  fontFamily: "Montserrat",
                  fontSize: "medium",
                  borderRadius: "lg",
                  spacing: "relaxed",
                  headerStyle: "bold",
                  sectionStyle: "card",
                  accentColor: "#ec4899",
                  fontWeight: "medium",
                  lineHeight: "relaxed",
                },
              },
              {
                name: "Executive",
                theme: {
                  primaryColor: "#0f172a",
                  secondaryColor: "#334155",
                  textColor: "#0f172a",
                  backgroundColor: "#f8fafc",
                  fontFamily: "Times New Roman",
                  fontSize: "medium",
                  borderRadius: "sm",
                  spacing: "normal",
                  headerStyle: "classic",
                  sectionStyle: "bordered",
                  accentColor: "#475569",
                  fontWeight: "normal",
                  lineHeight: "normal",
                },
              },
            ].map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() =>
                  setTheme({ ...theme, ...(preset.theme as Theme) })
                }
                className="p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-center">
                <div
                  className="w-full h-2 mb-2 rounded-sm"
                  style={{ backgroundColor: preset.theme.primaryColor }}></div>
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
