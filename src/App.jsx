import "./App.css";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/Login";
import { useStateValue } from "./StateProvider";
import UseWindowDimensions from "./UseWindowDimensions";

function App() {
  const [{ user }, dispatch] = useStateValue();

  const uid =
    localStorage.getItem("uid") !== undefined
      ? localStorage.getItem("uid")
      : null;

  return (
    //BEM naming conventions
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app_body">
          <Router>
            <Routes>
              <Route path="/" element={<Sidebar />} />
              <Route
                path="/rooms/:roomId"
                element={
                  <>
                    <Sidebar />
                    <Chat />
                  </>
                }
              />
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
