import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  HardDrive, 
  FolderPlus, 
  Home,
  Star,
  Clock,
  Trash2,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';

interface SidebarProps {
  onCreateFolder: () => void;
  currentFolderId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateFolder, currentFolderId }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'My Drive', path: '/dashboard', active: !currentFolderId },
    { icon: Star, label: 'Starred', path: '/dashboard?filter=starred' },
    { icon: Clock, label: 'Recent', path: '/dashboard?filter=recent' },
    { icon: Trash2, label: 'Trash', path: '/dashboard?filter=trash' },
  ];

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">CloudDrive</span>
        </Link>
      </div>

      {/* New Button */}
      <div className="p-4">
        <Button 
          onClick={onCreateFolder}
          className="w-full gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Storage Info (placeholder) */}
      <div className="p-4 border-t border-border">
        <div className="mb-2 text-sm text-muted-foreground">Storage</div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="w-1/3 h-full gradient-primary rounded-full" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">2.5 GB of 15 GB used</p>
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-border space-y-1">
        <button
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
