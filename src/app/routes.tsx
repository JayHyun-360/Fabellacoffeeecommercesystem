import { createBrowserRouter, Navigate } from 'react-router';
import { CustomerPage } from './pages/CustomerPage';
import { StaffPage } from './pages/StaffPage';
import { AdminPage } from './pages/AdminPage';

export const router = createBrowserRouter([
  { path: '/', Component: CustomerPage },
  { path: '/staff', Component: StaffPage },
  { path: '/admin', Component: AdminPage },
  { path: '*', Component: () => <Navigate to="/" replace /> },
]);
