import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, BarChart3, Workflow, FileText } from 'lucide-react';

export default function TopNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/analysis', label: 'Analysis', icon: BarChart3 },
    { path: '/editor', label: 'Editor', icon: Workflow },
    { path: '/report', label: 'Report', icon: FileText },
  ];

  return (
    <nav className="bg-panel-bg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ibm-blue rounded-lg flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <span className="text-text-strong font-semibold text-lg">
                Legacy Logic Studio
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-ibm-blue text-white' 
                      : 'text-text-muted hover:text-text-primary hover:bg-panel-bg-secondary'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Made with Bob
