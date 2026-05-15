import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout, AdminLayout, AuthLayout } from "../components/layout";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../components/ui/Spinner";

// Lazy loading
const HomePage = lazy(() => import("../pages/HomePage"));
const MapPage = lazy(() => import("../pages/MapPage"));
const NewReportPage = lazy(() => import("../pages/NewReportPage"));
const ReportDetailPage = lazy(() => import("../pages/ReportDetailPage"));
const PostsPage = lazy(() => import("../pages/PostsPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const ReportsManagerPage = lazy(() => import("../pages/admin/ReportsManagerPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const CriticalZonesPage = lazy(() => import("../pages/admin/CriticalZonesPage"));
const ChatbotPage = lazy(() => import("../pages/ChatbotPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  // ===== LOGIN (public) =====
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // ===== APP PROTÉGÉE (Layout normal) =====
  {
    element: <ProtectedRoute />,
    children: [
      {
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
          {
            path: "chatbot",
            element: (
              <SuspenseWrapper>
                <ChatbotPage />
              </SuspenseWrapper>
            ),
          },
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

      // ===== ADMIN (Layout admin séparé) =====
      {
        element: <ProtectedRoute requireAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: "admin",
                element: (
                  <SuspenseWrapper>
                    <DashboardPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "admin/reports",
                element: (
                  <SuspenseWrapper>
                    <ReportsManagerPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: "admin/critical-zones",
                element: (
                  <SuspenseWrapper>
                    <CriticalZonesPage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}