import React, { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../contexts/ThemeContext";
import { FiUpload, FiFile, FiEye, FiDownload, FiTrash2, FiX } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import toast from "react-hot-toast";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumeUpload = () => {
  const { user } = useSelector((state) => state.user);
  const { isDark } = useTheme();
  const [resumes, setResumes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Sample resumes for demonstration
  useState(() => {
    setResumes([
      {
        id: 1,
        name: "Software_Engineer_Resume.pdf",
        size: "245 KB",
        uploadDate: "2024-01-15",
        type: "application/pdf",
        url: "#"
      }
    ]);
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileSelect = (file) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setPreviewFile(URL.createObjectURL(file));
      setCurrentPage(1);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newResume = {
        id: Date.now(),
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile)
      };

      setResumes(prev => [newResume, ...prev]);
      setSelectedFile(null);
      setPreviewFile(null);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    setResumes(prev => prev.filter(resume => resume.id !== id));
    toast.success("Resume deleted successfully!");
  };

  const handleDownload = (resume) => {
    // In a real app, this would download the actual file
    toast.success(`Downloading ${resume.name}`);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewFile(null);
    setCurrentPage(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // if (!user || user.role !== "jobseeker") {
  //   return (
  //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h2>
  //         <p className="text-gray-600 dark:text-gray-400">This feature is only available for job seekers.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Upload and manage your professional resumes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload New Resume</h3>
              
              {/* Drag & Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop your resume here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">PDF files only, max 5MB</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* File Preview */}
              {selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiFile className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearSelection}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="mt-3 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FiUpload className="h-4 w-4" />
                        <span>Upload Resume</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Existing Resumes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Resumes</h3>
              
              {resumes.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No resumes uploaded yet</p>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FiFile className="h-6 w-6 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{resume.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {resume.size} • {resume.uploadDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDownload(resume)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Download"
                        >
                          <FiDownload className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume Preview</h3>
            
            {previewFile ? (
              <div className="space-y-4">
                {/* PDF Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {numPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                      disabled={currentPage >= numPages}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                  
                  <button
                    onClick={clearSelection}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>

                {/* PDF Viewer */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <Document
                    file={previewFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex justify-center"
                  >
                    <Page
                      pageNumber={currentPage}
                      width={400}
                      className="shadow-lg"
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <FiEye className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Select a resume to preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;

