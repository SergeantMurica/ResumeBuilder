export interface ResumeSection {
  id: string;
  type: string;
  title: string;
  data: any;
  position: number;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  spacing: string;
  headerStyle: "simple" | "modern" | "classic" | "minimal" | "bold";
  sectionStyle: "card" | "flat" | "bordered" | "minimal";
  accentColor: string;
  customCSS: string;
  fontWeight: "light" | "normal" | "medium" | "semibold" | "bold";
  paperSize: "a4" | "letter" | "legal";
  lineHeight: "tight" | "normal" | "relaxed";
  layoutType: "single-column" | "two-column-left" | "two-column-right";
  sidebarSections: string[];
  sidebarWidth: string;
  sidebarBackgroundColor: string;
  sidebarTextColor: string;
}

export interface User {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
