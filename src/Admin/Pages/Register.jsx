// src/Admin/Pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../Style/Register.module.css"; // tu peux le renommer Login.module.css si tu veux

export default function Login() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Code d'accès admin
      const ADMIN_CODE = "123456";

      if (code === ADMIN_CODE) {
        // Simule un "token" (simple sécurité côté client)
        const fakeToken = "admin_token_123456";
        localStorage.setItem("token", fakeToken);

        navigate("/admin/dashboard");
      } else {
        alert("Code invalide !");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      alert("Erreur inattendue, réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.loginPage}>
      <div className={style.loginCard}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div className={style.loginLogo}>A</div>
          <h1 className={style.loginTitle}>Connexion Admin</h1>
          <p className={style.loginSub}>
            Entrez le code secret pour accéder à l’espace admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className={style.loginForm}>
          <div>
            <label className={style.loginLabel}>Code secret</label>
            <input
              type="password"
              placeholder="••••••••"
              className={style.loginInput}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={style.loginBtn} disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className={style.loginNote}>
          Accès réservé uniquement à l’administrateur
        </p>
      </div>
    </div>
  );
}
