import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🍴 Restaurant</div>
      <div className={styles.links}>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Accueil
        </NavLink>
        <NavLink 
          to="/menu" 
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Menu
        </NavLink>
        {/* <NavLink 
          to="/cart" 
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Panier
        </NavLink>
        <NavLink 
          to="/order" 
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Commande
        </NavLink> */}
      </div>
    </nav>
  );
}

export default Navbar; 
