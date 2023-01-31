import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Auth from "./components/Auth";
import Blogs from "./components/Blogs";
import UserBlogs from "./components/UserBlogs";
import BlogDetail from "./components/BlogDetail";
import AddBlog from "./components/AddBlog";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store";
import { useEffect } from "react";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();

  const ProtectedComponent = ({ login, children }) => {
    if (!login) return <Navigate to="/login" replace />;
    return children;
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispatch(authActions.login());
    }
    console.log(isLoggedIn);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          {!isLoggedIn ? (
            <Route path="/login" element={<Auth />} />
          ) : (
            <>
              <Route
                exact
                path="/*"
                element={
                  <ProtectedComponent login={isLoggedIn} children={<Blogs />} />
                }
              />
              <Route
                path="/blogs/add"
                element={
                  <ProtectedComponent
                    login={isLoggedIn}
                    children={<AddBlog />}
                  />
                }
              />
              <Route
                path="/myBlogs"
                element={
                  <ProtectedComponent
                    login={isLoggedIn}
                    children={<UserBlogs />}
                  />
                }
              />
              <Route
                path="/myBlogs/:id"
                element={
                  <ProtectedComponent
                    login={isLoggedIn}
                    children={<BlogDetail />}
                  />
                }
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
