import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";
import { ResumeSection, Theme } from "../../types";

interface Resume {
  id: string;
  name: string;
  sections: ResumeSection[];
  theme: Theme;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume | null;
  loading: boolean;
  error: string | null;
  createResume: (name: string) => Promise<string>;
  updateResume: (resumeId: string, data: Partial<Resume>) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  loadResume: (resumeId: string) => Promise<void>;
  setSections: (sections: ResumeSection[]) => void;
  setTheme: (theme: Theme) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}

interface ResumeProviderProps {
  children: ReactNode;
}

export function ResumeProvider({ children }: ResumeProviderProps) {
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial theme and section for new resumes
  const defaultTheme: Theme = {
    primaryColor: "#4f46e5",
    secondaryColor: "#818cf8",
    textColor: "#1f2937",
    backgroundColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: "medium",
    borderRadius: "md",
    spacing: "normal",
    headerStyle: "modern",
    sectionStyle: "card",
    accentColor: "#fca5a5",
    customCSS: "",
    fontWeight: "normal",
    paperSize: "a4",
    lineHeight: "normal",
  };

  const defaultSection: ResumeSection = {
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
  };

  const loadResumes = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const resumesRef = collection(db, "users", currentUser.uid, "resumes");
      const q = query(resumesRef, orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(q);

      const loadedResumes: Resume[] = [];
      querySnapshot.forEach((doc) => {
        loadedResumes.push({
          ...doc.data(),
          id: doc.id,
        } as Resume);
      });

      setResumes(loadedResumes);
      setError(null);
    } catch (err: any) {
      // Catch specific error type if possible
      console.error("Error loading resumes:", err);
      setError(`Failed to load your resumes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadResumes();
    } else {
      setResumes([]);
      setCurrentResume(null);
      setLoading(false);
      setError(null);
    }
  }, [currentUser, loadResumes]);

  const createResume = useCallback(
    async (name: string) => {
      if (!currentUser) throw new Error("User not authenticated");

      const newResumeId = uuidv4();
      const now = Timestamp.now();

      try {
        const newResumeData = {
          // Don't include id here firestore will auto generate
          name,
          sections: [defaultSection],
          theme: defaultTheme,
          createdAt: now,
          updatedAt: now,
        };

        const resumeRef = doc(
          db,
          "users",
          currentUser.uid,
          "resumes",
          newResumeId
        );
        await setDoc(resumeRef, newResumeData);

        // Construct the full resume object for local state AFTER successful write
        const newResume: Resume = {
          ...newResumeData,
          id: newResumeId,
        };

        setResumes((prev) => [newResume, ...prev]);
        setCurrentResume(newResume);
        return newResumeId;
      } catch (err: any) {
        console.error("Error creating resume:", err);
        throw new Error(`Failed to create resume: ${err.message}`);
      }
    },
    [currentUser, defaultSection, defaultTheme]
  );

  const updateResume = useCallback(
    async (
      resumeId: string,
      data: Partial<Omit<Resume, "id" | "createdAt">>
    ) => {
      if (!currentUser) throw new Error("User not authenticated");

      try {
        const resumeRef = doc(
          db,
          "users",
          currentUser.uid,
          "resumes",
          resumeId
        );
        const updateData = {
          ...data,
          updatedAt: Timestamp.now(),
        };

        await setDoc(resumeRef, updateData, { merge: true });

        // Update local state AFTER successful write
        const updatedTimestamp = updateData.updatedAt;
        setResumes((prev) =>
          prev.map((resume) =>
            resume.id === resumeId
              ? { ...resume, ...data, updatedAt: updatedTimestamp }
              : resume
          )
        );

        if (currentResume?.id === resumeId) {
          setCurrentResume((prev) =>
            prev ? { ...prev, ...data, updatedAt: updatedTimestamp } : null
          );
        }
      } catch (err: any) {
        console.error("Error updating resume:", err);
        throw new Error(`Failed to update resume: ${err.message}`);
      }
    },
    [currentUser, currentResume]
  );

  const deleteResume = useCallback(
    async (resumeId: string) => {
      if (!currentUser) throw new Error("User not authenticated");

      try {
        const resumeRef = doc(
          db,
          "users",
          currentUser.uid,
          "resumes",
          resumeId
        );
        await deleteDoc(resumeRef);

        setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));

        if (currentResume?.id === resumeId) {
          setCurrentResume(null);
        }
      } catch (err: any) {
        console.error("Error deleting resume:", err);
        throw new Error(`Failed to delete resume: ${err.message}`);
      }
    },
    [currentUser, currentResume]
  );

  const loadResume = useCallback(
    async (resumeId: string) => {
      if (!currentUser) throw new Error("User not authenticated");

      try {
        setLoading(true);
        const resumeRef = doc(
          db,
          "users",
          currentUser.uid,
          "resumes",
          resumeId
        );
        const resumeSnap = await getDoc(resumeRef);

        if (resumeSnap.exists()) {
          const data = resumeSnap.data();
          const resume = {
            ...data,
            id: resumeSnap.id,
          } as Resume;

          setCurrentResume(resume);
          setError(null);
        } else {
          setError("Resume not found");
          setCurrentResume(null);
        }
      } catch (err: any) {
        console.error("Error loading resume:", err);
        setError(`Failed to load resume: ${err.message}`);
        setCurrentResume(null);
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const setSections = useCallback(
    (sections: ResumeSection[]) => {
      if (currentResume) {
        updateResume(currentResume.id, { sections });
      }
    },
    [currentResume, updateResume]
  );

  const setTheme = useCallback(
    (theme: Theme) => {
      if (currentResume) {
        updateResume(currentResume.id, { theme });
      }
    },
    [currentResume, updateResume]
  );

  const value = {
    resumes,
    currentResume,
    loading,
    error,
    createResume,
    updateResume,
    deleteResume,
    loadResume,
    setSections,
    setTheme,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}
