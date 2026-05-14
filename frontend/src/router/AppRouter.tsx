import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout, AdminLayout } from "../components/layout";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../components/ui/Spinner";

// Lazy loading des pages pour optimisation
const HomePage = lazy(() => import("../pages/HomePage"));
const MapPage = lazy(() => import("../pages/MapPage"));
const NewReportPage = lazy(() => import("../pages/NewReportPage"));
const ReportDetailPage = lazy(() => import("../pages/ReportDetailPage"));
const PostsPage = lazy(() => import("../pages/PostsPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const ReportsManagerPage = lazy(() => import("../pages/admin/ReportsManagerPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

// Composant de chargement pendant le lazy loading
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

// Suspense wrapper
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "map",
        element: (
          <SuspenseWrapper>
            <MapPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "posts",
        element: (
          <SuspenseWrapper>
            <PostsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "reports/:id",
        element: (
          <SuspenseWrapper>
            <ReportDetailPage />
          </SuspenseWrapper>
        ),
      },
      // Routes protégées (citoyen connecté)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "new-report",
            element: (
              <SuspenseWrapper>
                <NewReportPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: "profile",
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      // Routes protégées (admin)
      {
        element: <ProtectedRoute requireAdmin />,
        children: [
          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: (
                  <SuspenseWrapper>
                    <DashboardPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "reports",
                element: (
                  <SuspenseWrapper>
                    <ReportsManagerPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
      // Page 404
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}