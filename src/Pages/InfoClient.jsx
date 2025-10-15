import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../Styles/InfoClient.module.css";

const InfoClient = ({ setClientInfo }) => {
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté frontend
    if ((type === "restaurant" && !table.trim()) || (type === "emporter" && !name.trim())) {
      return alert("Veuillez remplir tous les champs requis");
    }

    try {
      const body = {
        name: type === "emporter" ? (name.trim() || null) : null,
        table_number: type === "restaurant" ? (table.trim() || null) : null,
        type,
      };

      const res = await fetch("https://backendresto-production.up.railway.app/api/client/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setClientInfo({
          name: data.client.name,
          table: data.client.table_number,
          type: data.client.type,
          clientId: data.client.id,
          orderId: data.order.id,
        });
        navigate("/menu");
      } else {
        alert(data.message || "Erreur lors de la création du client");
      }
    } catch (err) {
      console.error("❌ Erreur frontend InfoClient:", err);
      alert("Erreur serveur, réessayez plus tard");
    }
  };

  return (
    <div className={style.infoContainer}>
      <h1 className={style.title}>📝 Vos informations</h1>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.choiceContainer}>
          <p>Choisissez :</p>

          <label className={style.option}>
            <input
              type="radio"
              name="type"
              value="restaurant"
              checked={type === "restaurant"}
              onChange={(e) => { setType(e.target.value); setName(""); }}
            />
            <span>Manger sur place</span>
          </label>

          <label className={style.option}>
            <input
              type="radio"
              name="type"
              value="emporter"
              checked={type === "emporter"}
              onChange={(e) => { setType(e.target.value); setTable(""); }}
            />
            <span>À emporter</span>
          </label>
        </div>

        {type === "restaurant" && (
          <input
            type="number"
            placeholder="Numéro de table"
            value={table}
            onChange={(e) => setTable(e.target.value)}
            required
          />
        )}

        {type === "emporter" && (
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <button type="submit" className={style.btnSubmit}>Valider</button>
      </form>
    </div>
  );
};

export default InfoClient;
