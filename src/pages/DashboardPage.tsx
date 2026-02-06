import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { FileItem, FolderPath } from '@/types';
import { toast } from 'sonner';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import FileGrid from '@/components/dashboard/FileGrid';
import UploadZone from '@/components/dashboard/UploadZone';
import CreateFolderModal from '@/components/dashboard/CreateFolderModal';
import { Loader2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentFolderId = searchParams.get('folder') || null;
  
  const [files, setFiles] = useState<FileItem[]>([]);
  const [path, setPath] = useState<FolderPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch files when folder changes
  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getFiles(currentFolderId);
      if (response.success) {
        setFiles(response.files);
        setPath(response.path);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated, fetchFiles]);

  // Handle file upload
  const handleUpload = async (uploadFiles: File[]) => {
    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of uploadFiles) {
      try {
        await apiClient.uploadFile(file, currentFolderId);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    setIsUploading(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded successfully`);
      fetchFiles();
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} file(s) failed to upload`);
    }
  };

  // Handle folder creation
  const handleCreateFolder = async (name: string) => {
    try {
      const response = await apiClient.createFolder(name, currentFolderId);
      if (response.success) {
        toast.success('Folder created successfully');
        setShowCreateFolder(false);
        fetchFiles();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create folder');
    }
  };

  // Handle file/folder deletion
  const handleDelete = async (fileId: string) => {
    try {
      await apiClient.deleteFile(fileId);
      toast.success('Deleted successfully');
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    }
  };

  // Handle file download
  const handleDownload = async (file: FileItem) => {
    try {
      const response = await apiClient.downloadFile(file._id);
      window.open(response.url, '_blank');
    } catch (error: any) {
      toast.error(error.message || 'Failed to download');
    }
  };

  // Navigate to folder
  const handleFolderClick = (folderId: string) => {
    setSearchParams({ folder: folderId });
  };

  // Navigate via breadcrumb
  const handleBreadcrumbClick = (folderId: string | null) => {
    if (folderId) {
      setSearchParams({ folder: folderId });
    } else {
      setSearchParams({});
    }
  };

  // Filter files by search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        onCreateFolder={() => setShowCreateFolder(true)}
        currentFolderId={currentFolderId}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <UploadZone
            onUpload={handleUpload}
            isUploading={isUploading}
          >
            <FileGrid
              files={filteredFiles}
              path={path}
              isLoading={isLoading}
              viewMode={viewMode}
              onFolderClick={handleFolderClick}
              onBreadcrumbClick={handleBreadcrumbClick}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onRefresh={fetchFiles}
            />
          </UploadZone>
        </main>
      </div>

      <CreateFolderModal
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onSubmit={handleCreateFolder}
      />
    </div>
  );
};

export default DashboardPage;
