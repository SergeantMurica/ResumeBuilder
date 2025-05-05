import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useResume } from "../contexts/ResumeContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { resumes, createResume, deleteResume, loading, error } = useResume();
  const [newResumeName, setNewResumeName] = useState("");
  const [showNewResumeForm, setShowNewResumeForm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newResumeName.trim()) return;

    try {
      const resumeId = await createResume(newResumeName);
      setNewResumeName("");
      setShowNewResumeForm(false);
      navigate(`/resume/${resumeId}`);
    } catch (err) {
      console.error("Create resume error:", err);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      await deleteResume(resumeId);
      setDeleteConfirmation(null);
    } catch (err) {
      console.error("Delete resume error:", err);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-600">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-6">
          {showNewResumeForm ? (
            <form
              onSubmit={handleCreateResume}
              className="bg-white p-4 rounded-lg shadow">
              <div className="flex">
                <input
                  type="text"
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  placeholder="Resume name"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700">
                  Create
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowNewResumeForm(false)}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowNewResumeForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              + New Resume
            </button>
          )}
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              You don't have any resumes yet
            </h2>
            <p className="text-gray-500 mb-4">
              Create your first resume to get started
            </p>
            <button
              onClick={() => setShowNewResumeForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {resume.name}
                  </h3>
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Delete resume"
                      onClick={() => setDeleteConfirmation(resume.id)}
                      className="text-gray-400 hover:text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {deleteConfirmation === resume.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-2">
                        <p className="text-sm text-gray-700 mb-2">
                          Delete this resume?
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation(null)}
                            className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Updated: {formatDate(resume.updatedAt.toDate())}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {formatDate(resume.createdAt.toDate())}
                </p>

                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/resume/${resume.id}`}
                    className="text-indigo-600 hover:text-indigo-500">
                    Edit
                  </Link>
                  <Link
                    to={`/resume/${resume.id}/preview`}
                    className="text-indigo-600 hover:text-indigo-500">
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
