// src/Admin/Components/AdminNavbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaTachometerAlt,
  FaUtensils,
  FaShoppingCart,
  FaSignOutAlt,
  FaQrcode,
} from "react-icons/fa";
import style from "../Style/AdminNavbar.module.css";
import adminAvatar from "../../Assets/admin.png";

const NavbarAdmin = ({ adminName = "Solena" }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const {logout} = useAuth();

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token
    navigate("/login"); // Redirection vers login
    logout();
  };

  // Liens de navigation
  const links = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/menu", label: "Menu", icon: <FaUtensils /> },
    { path: "/admin/orders", label: "Commandes", icon: <FaShoppingCart /> },
    { path: "/admin/qr", label: "QR Codes", icon: <FaQrcode /> }, // Nouveau lien
  ];

  return (
    <nav
      className={`${style.navbar} ${expanded ? style.expanded : ""}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Info Admin */}
      <div className={style.adminInfo}>
        <img src={adminAvatar} alt="Admin" className={style.adminAvatar} />
        {expanded && (
          <div className={style.adminDetails}>
            <span className={style.adminName}>{adminName}</span>
          </div>
        )}
      </div>

      {/* Liens */}
      <div className={style.navLinks}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => (isActive ? style.active : "")}
            title={!expanded ? link.label : ""}
          >
            <span className={style.icon}>{link.icon}</span>
            {expanded && <span className={style.label}>{link.label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Déconnexion */}
      <div className={style.logoutContainer}>
        <button className={style.btnLogout} onClick={handleLogout}>
          <FaSignOutAlt /> {expanded ? "Déconnexion" : ""}
        </button>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
