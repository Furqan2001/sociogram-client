import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "./App.css";

import AuthRoute from "./util/AuthRoute";
import { AuthProvider } from "./context/auth";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register.js";
import SinglePost from "./pages/SinglePost";

function App(props) {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<AuthRoute />}>
              <Route exact path="/login" element={<Login />} />
            </Route>
            <Route exact path="/register" element={<AuthRoute />}>
              <Route exact path="/register" element={<Register />} />
            </Route>
            <Route exact path="/posts/:postId" element={<SinglePost />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
