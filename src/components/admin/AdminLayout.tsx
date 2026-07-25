import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Phone, 
  FileText, 
  LayoutDashboard, 
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Leads', url: '/admin/leads', icon: Users },
  { title: 'Calls', url: '/admin/calls', icon: Phone },
  { title: 'Audits', url: '/admin/reports', icon: FileText },
  { title: 'Voice Setup', url: '/admin/voice/setup', icon: Settings },
];

export default function AdminLayout({ children, title, subtitle, breadcrumbs }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-background border-r border-border flex flex-col transition-all duration-300 sticky top-0 h-screen",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Logo */}
        <div className="h-16 border-b border-border flex items-center justify-between px-4">
          {sidebarOpen ? (
            <Link to="/admin" className="flex items-center gap-1">
              <span className="text-primary font-bold">its</span>
              <span className="font-bold text-foreground">Feierabend</span>
              <span className="text-primary font-bold">.ch</span>
            </Link>
          ) : (
            <Link to="/admin" className="flex items-center justify-center w-full">
              <span className="text-primary font-bold text-lg">iF</span>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(!sidebarOpen && "hidden")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {!sidebarOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(true)}
              className="w-full mb-2"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
          {navItems.map((item) => (
            <Link 
              key={item.url} 
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive(item.url) 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                !sidebarOpen && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-3">
          <Button 
            variant="ghost" 
            onClick={signOut}
            className={cn(
              "w-full text-muted-foreground hover:text-foreground",
              sidebarOpen ? "justify-start" : "justify-center px-2"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Abmelden</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-10 h-16 flex items-center px-6">
          <div className="flex-1">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <BreadcrumbItem key={index}>
                      {index > 0 && <BreadcrumbSeparator />}
                      {item.href ? (
                        <BreadcrumbLink asChild>
                          <Link to={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            ) : null}
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
