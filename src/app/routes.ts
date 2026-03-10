import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AssetsList } from './pages/AssetsList';
import { AssetDetails } from './pages/AssetDetails';
import { AddAsset } from './pages/AddAsset';
import { Employees } from './pages/Employees';
import { Departments } from './pages/Departments';
import { QRScanner } from './pages/QRScanner';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'assets', Component: AssetsList },
      { path: 'assets/new', Component: AddAsset },
      { path: 'assets/:id', Component: AssetDetails },
      { path: 'assets/:id/edit', Component: AddAsset },
      { path: 'employees', Component: Employees },
      { path: 'departments', Component: Departments },
      { path: 'scan', Component: QRScanner },
      { path: '*', Component: NotFound },
    ],
  },
]);
