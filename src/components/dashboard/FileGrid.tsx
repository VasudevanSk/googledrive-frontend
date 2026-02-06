import React from 'react';
import { FileItem, FolderPath } from '@/types';
import { 
  Folder, 
  File, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio,
  FileArchive,
  MoreVertical,
  Download,
  Trash2,
  Pencil,
  ChevronRight,
  Home,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface FileGridProps {
  files: FileItem[];
  path: FolderPath[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  onFolderClick: (folderId: string) => void;
  onBreadcrumbClick: (folderId: string | null) => void;
  onDownload: (file: FileItem) => void;
  onDelete: (fileId: string) => void;
  onRefresh: () => void;
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'folder') {
    return <Folder className="w-12 h-12 text-primary fill-primary/20" />;
  }

  const mimeType = file.mimeType || '';
  
  if (mimeType.startsWith('image/')) {
    return <FileImage className="w-12 h-12 text-green-500" />;
  }
  if (mimeType.startsWith('video/')) {
    return <FileVideo className="w-12 h-12 text-purple-500" />;
  }
  if (mimeType.startsWith('audio/')) {
    return <FileAudio className="w-12 h-12 text-pink-500" />;
  }
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
    return <FileText className="w-12 h-12 text-blue-500" />;
  }
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) {
    return <FileArchive className="w-12 h-12 text-yellow-500" />;
  }
  
  return <File className="w-12 h-12 text-muted-foreground" />;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const FileGrid: React.FC<FileGridProps> = ({
  files,
  path,
  isLoading,
  viewMode,
  onFolderClick,
  onBreadcrumbClick,
  onDownload,
  onDelete,
}) => {
  const folders = files.filter((f) => f.type === 'folder');
  const regularFiles = files.filter((f) => f.type === 'file');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm">
        <button
          onClick={() => onBreadcrumbClick(null)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Home className="w-4 h-4" />
          <span>My Drive</span>
        </button>
        {path.map((folder, index) => (
          <React.Fragment key={folder._id}>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <button
              onClick={() => onBreadcrumbClick(folder._id)}
              className={`px-2 py-1 rounded hover:bg-muted transition-colors ${
                index === path.length - 1 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Empty State */}
      {files.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Folder className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No files yet</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here or create a new folder
          </p>
          <label htmlFor="file-upload">
            <Button className="gradient-primary text-primary-foreground cursor-pointer">
              Upload Files
            </Button>
          </label>
        </div>
      )}

      {/* Folders Section */}
      {folders.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Folders</h2>
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
            : 'space-y-2'
          }>
            {folders.map((folder) => (
              <FileCard
                key={folder._id}
                file={folder}
                viewMode={viewMode}
                onClick={() => onFolderClick(folder._id)}
                onDownload={() => {}}
                onDelete={() => onDelete(folder._id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Files Section */}
      {regularFiles.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Files</h2>
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
            : 'space-y-2'
          }>
            {regularFiles.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                viewMode={viewMode}
                onClick={() => onDownload(file)}
                onDownload={() => onDownload(file)}
                onDelete={() => onDelete(file._id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// File Card Component
interface FileCardProps {
  file: FileItem;
  viewMode: 'grid' | 'list';
  onClick: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  viewMode,
  onClick,
  onDownload,
  onDelete,
}) => {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow group">
        <div 
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={onClick}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            {React.cloneElement(getFileIcon(file), { className: 'w-6 h-6' })}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground w-20 text-right">
          {formatFileSize(file.size)}
        </span>
        <FileActions file={file} onDownload={onDownload} onDelete={onDelete} />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all group animate-fade-in cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div onClick={onClick} className="flex-1">
          {getFileIcon(file)}
        </div>
        <FileActions file={file} onDownload={onDownload} onDelete={onDelete} />
      </div>
      <div onClick={onClick}>
        <p className="font-medium truncate mb-1" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
        </p>
        {file.type === 'file' && (
          <p className="text-xs text-muted-foreground mt-1">
            {formatFileSize(file.size)}
          </p>
        )}
      </div>
    </div>
  );
};

// File Actions Dropdown
interface FileActionsProps {
  file: FileItem;
  onDownload: () => void;
  onDelete: () => void;
}

const FileActions: React.FC<FileActionsProps> = ({ file, onDownload, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {file.type === 'file' && (
          <DropdownMenuItem onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FileGrid;
