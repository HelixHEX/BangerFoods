import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./utils/theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//pages
import Signin from "./pages/Signin";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import { UserProvider } from "./utils/UserContex";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Recipe from "./pages/Recipe";
import MyRecieps from "./pages/MyRecipes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <UserProvider>
        <ColorModeScript initialColorMode={"light"} />
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute outlet={<Profile />} pathname="/signin" />
              }
            />
            <Route
              path="/my-recipes"
              element={
                <ProtectedRoute outlet={<MyRecieps />} pathname="/signin" />
              }
            />
            <Route path="/recipe/:id" element={<Recipe />} />
          </Routes>
        </Router>
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
