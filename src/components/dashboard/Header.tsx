import React from 'react';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Grid3X3, 
  List, 
  Bell,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'U';

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center gap-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files and folders..."
            className="pl-10 bg-muted border-0 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-card shadow-sm' : ''}`}
          onClick={() => onViewModeChange('grid')}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${viewMode === 'list' ? 'bg-card shadow-sm' : ''}`}
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="text-muted-foreground">
        <Bell className="w-5 h-5" />
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="gradient-primary text-primary-foreground font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user && (
                <>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
