// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import ApiContext from "./context/ApiContext";
import { courseApi, voucherApi } from "./api/axiosInstance";
import routes from "./routes";

const clientId =
  "1018910450198-m8sitc37vcjdg1qbe7d3cp00nca00840.apps.googleusercontent.com";

const renderRoute = (route) => {
  const Component = lazy(route.component);
  const Wrapper = route.wrapper
    ? lazy(() =>
        import(`./components/${route.wrapper}`).then((mod) => ({
          default: mod.default || (({ children }) => children),
        }))
      )
    : ({ children }) => children;

  return (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Wrapper>
          <Component {...route.props} />
        </Wrapper>
      }
    >
      {route.children && route.children.map(renderRoute)}
    </Route>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <ApiContext.Provider value={{ courseApi, voucherApi }}>
        <Router>
          <Suspense
            fallback={<div className="text-center p-4">Loading...</div>}
          >
            <Routes>{routes.map(renderRoute)}</Routes>
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            draggable
            pauseOnHover
          />
        </Router>
      </ApiContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
