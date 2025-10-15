import React from "react";
import { Link } from "react-router-dom";
import styles from "../Styles/Home.module.css";

function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Bienvenue au Restaurant 🍽️</h1>
        <p className={styles.subtitle}>Découvrez nos plats savoureux et passez commande en ligne.</p>
        <Link to="/menu">
          <button className={styles.button}>Voir le Menu</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
