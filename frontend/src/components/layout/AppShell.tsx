import { Outlet } from 'react-router-dom';
import { WorkflowProvider, WorkflowRouteGuard } from '../../workflow/WorkflowContext';
import AppFooter from './AppFooter';
import TopNavigation from './TopNavigation';

export default function AppShell() {
  return (
    <WorkflowProvider>
      <div className="flex min-h-screen flex-col bg-app-bg">
        <TopNavigation />
        <WorkflowRouteGuard />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </WorkflowProvider>
  );
}

// Made with Bob
