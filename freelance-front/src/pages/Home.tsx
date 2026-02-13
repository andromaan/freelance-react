import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Ласкаво просимо на Freelance Platform!</h1>
        <p>Ви успішно увійшли в систему.</p>
        <button onClick={handleLogout} className="logout-button">
          Вийти
        </button>
      </div>
    </div>
  );
};

export default Home;
