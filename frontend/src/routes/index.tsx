import { createBrowserRouter } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import HomePage from '../pages/HomePage';
import UploadPage from '../pages/UploadPage';
import AnalysisPage from '../pages/AnalysisPage';
import EditorPage from '../pages/EditorPage';
import ReportPage from '../pages/ReportPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'upload',
        element: <UploadPage />,
      },
      {
        path: 'analysis',
        element: <AnalysisPage />,
      },
      {
        path: 'editor',
        element: <EditorPage />,
      },
      {
        path: 'report',
        element: <ReportPage />,
      },
    ],
  },
]);

// Made with Bob
