import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
import WelcomePage from "./pages/WelcomePage";
import Toolbar from "./components/Toolbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChristmasBackground from "./components/ChristmasBackground";

function App() {
  return (
    <div className="app-container">
      <ChristmasBackground />
      <div className="content-container">
        <BrowserRouter>
          <Toolbar />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
