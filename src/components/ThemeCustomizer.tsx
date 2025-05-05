// components/ThemeCustomizer.tsx
import { Theme } from "../../types";

interface ThemeCustomizerProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeCustomizer = ({ theme, setTheme }: ThemeCustomizerProps) => {
  const updateTheme = (key: keyof Theme, value: string) => {
    setTheme({ ...theme, [key]: value });
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
  ];

  const sizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const radiusOptions = [
    { value: "none", label: "None" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ];

  const spacingOptions = [
    { value: "compact", label: "Compact" },
    { value: "normal", label: "Normal" },
    { value: "relaxed", label: "Relaxed" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Theme Customization</h2>

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
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
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
                title="Font Family"
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
                Font Size
              </label>
              <select
                title="Font Size"
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
                Border Radius
              </label>
              <select
                title="Border Radius"
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
                title="Spacing"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
