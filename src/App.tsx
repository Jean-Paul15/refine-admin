import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  UserOutlined,
  MailOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import {
  AuthPage,
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import authProvider from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { DashboardPage } from "./pages/dashboard";
import {
  ProfileCreate,
  ProfileEdit,
  ProfileList,
  ProfileShow,
} from "./pages/profiles";
import {
  NewsletterSubscriberCreate,
  NewsletterSubscriberEdit,
  NewsletterSubscriberList,
  NewsletterSubscriberShow,
} from "./pages/newsletter-subscribers";
import {
  ArticleCreate,
  ArticleEditEnhanced,
  ArticleList,
  ArticleShow,
} from "./pages/articles";
import {
  ActionCreate,
  ActionEdit,
  ActionList,
  ActionShow,
} from "./pages/actions";
import {
  SettingCreate,
  SettingEdit,
  SettingList,
  SettingShow,
} from "./pages/settings";
import { supabaseClient } from "./utility";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useErrorHandler } from "./hooks/useErrorHandler";

function App() {
  // Initialiser la gestion d'erreurs globale
  useErrorHandler();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <GitHubBanner />
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <AntdApp>
              <DevtoolsProvider>
                <Refine
                  dataProvider={dataProvider(supabaseClient)}
                  liveProvider={liveProvider(supabaseClient)}
                  authProvider={authProvider}
                  routerProvider={routerBindings}
                  notificationProvider={useNotificationProvider}
                  resources={[
                    {
                      name: "dashboard",
                      list: "/",
                      meta: {
                        label: "Tableau de bord",
                        icon: <DashboardOutlined />,
                      },
                    },
                    {
                      name: "profiles",
                      list: "/profiles",
                      create: "/profiles/create",
                      edit: "/profiles/edit/:id",
                      show: "/profiles/show/:id",
                      meta: {
                        label: "Profils",
                        icon: <UserOutlined />,
                        canDelete: true,
                      },
                    },
                    {
                      name: "newsletter_subscribers",
                      list: "/newsletter-subscribers",
                      create: "/newsletter-subscribers/create",
                      edit: "/newsletter-subscribers/edit/:id",
                      show: "/newsletter-subscribers/show/:id",
                      meta: {
                        label: "Newsletter",
                        icon: <MailOutlined />,
                        canDelete: true,
                      },
                    },
                    {
                      name: "articles",
                      list: "/articles",
                      create: "/articles/create",
                      edit: "/articles/edit/:id",
                      show: "/articles/show/:id",
                      meta: {
                        label: "Articles",
                        icon: <FileTextOutlined />,
                        canDelete: true,
                      },
                    },
                    {
                      name: "actions",
                      list: "/actions",
                      create: "/actions/create",
                      edit: "/actions/edit/:id",
                      show: "/actions/show/:id",
                      meta: {
                        label: "Actions",
                        icon: <ThunderboltOutlined />,
                        canDelete: true,
                      },
                    },
                    {
                      name: "settings",
                      list: "/settings",
                      create: "/settings/create",
                      edit: "/settings/edit/:id",
                      show: "/settings/show/:id",
                      meta: {
                        label: "Paramètres",
                        icon: <SettingOutlined />,
                        canDelete: true,
                      },
                    },
                  ]}
                  options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                    useNewQueryKeys: true,
                    projectId: "2uz6ep-c1RGJo-TT9IBX",
                  }}
                >
                  <Routes>
                    <Route
                      element={
                        <Authenticated
                          key="authenticated-inner"
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <ThemedLayoutV2
                            Header={Header}
                            Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                          >
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      }
                    >
                      <Route
                        index
                        element={<DashboardPage />}
                      />
                      <Route path="/profiles">
                        <Route index element={<ProfileList />} />
                        <Route path="create" element={<ProfileCreate />} />
                        <Route path="edit/:id" element={<ProfileEdit />} />
                        <Route path="show/:id" element={<ProfileShow />} />
                      </Route>
                      <Route path="/newsletter-subscribers">
                        <Route index element={<NewsletterSubscriberList />} />
                        <Route path="create" element={<NewsletterSubscriberCreate />} />
                        <Route path="edit/:id" element={<NewsletterSubscriberEdit />} />
                        <Route path="show/:id" element={<NewsletterSubscriberShow />} />
                      </Route>
                      <Route path="/articles">
                        <Route index element={<ArticleList />} />
                        <Route path="create" element={<ArticleCreate />} />
                        <Route path="edit/:id" element={<ArticleEditEnhanced />} />
                        <Route path="show/:id" element={<ArticleShow />} />
                      </Route>
                      <Route path="/actions">
                        <Route index element={<ActionList />} />
                        <Route path="create" element={<ActionCreate />} />
                        <Route path="edit/:id" element={<ActionEdit />} />
                        <Route path="show/:id" element={<ActionShow />} />
                      </Route>
                      <Route path="/settings">
                        <Route index element={<SettingList />} />
                        <Route path="create" element={<SettingCreate />} />
                        <Route path="edit/:id" element={<SettingEdit />} />
                        <Route path="show/:id" element={<SettingShow />} />
                      </Route>
                      <Route path="*" element={<ErrorComponent />} />
                    </Route>
                    <Route
                      element={
                        <Authenticated
                          key="authenticated-outer"
                          fallback={<Outlet />}
                        >
                          <NavigateToResource />
                        </Authenticated>
                      }
                    >
                      <Route
                        path="/login"
                        element={
                          <AuthPage
                            type="login"
                            formProps={{
                              initialValues: {
                                email: "info@refine.dev",
                                password: "refine-supabase",
                              },
                            }}
                          />
                        }
                      />
                      <Route
                        path="/register"
                        element={<AuthPage type="register" />}
                      />
                      <Route
                        path="/forgot-password"
                        element={<AuthPage type="forgotPassword" />}
                      />
                    </Route>
                  </Routes>

                  <RefineKbar />
                  <UnsavedChangesNotifier />
                  <DocumentTitleHandler />
                </Refine>
                <DevtoolsPanel />
              </DevtoolsProvider>
            </AntdApp>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
