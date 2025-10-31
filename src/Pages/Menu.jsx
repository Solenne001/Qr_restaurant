import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import style from "../Styles/Menu.module.css";
import { CartContext } from "../context/CartContext";

const API_URL = "https://backendresto-production.up.railway.app";

const Menu = () => {
  const { cart, setCart } = useContext(CartContext);
  const [tableId, setTableId] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogged = !!localStorage.getItem("token"); // ✅ vérifier connexion

  // ✅ Récupérer le numéro de table depuis l'URL si présent
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) setTableId(table);
  }, []);

  // ✅ Charger les plats
  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/dishes`);
        const data = await res.json();
        if (data.success) setDishes(data.dishes);
        else setDishes([]);
      } catch (err) {
        console.error("❌ Erreur fetchDishes :", err);
        setError("Impossible de charger le menu");
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // ✅ Ajouter au panier
  const addToCart = (dish) => {
    if (!isLogged) return alert("⚠️ Vous devez vous connecter pour commander.");

    const exists = cart.find((item) => item.id === (dish.id || dish._id));
    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === (dish.id || dish._id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...dish, id: dish.id || dish._id, quantity: 1 }]);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className={style.menuContainer}>
      <h1 className={style.menuTitle}>
        🍽️ Menu {tableId ? `- Table ${tableId}` : ""}
      </h1>

      {loading && <p>Chargement du menu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className={style.menuList}>
        {dishes.map((dish) => (
          <div key={dish.id || dish._id} className={style.menuCard}>
            {dish.image && (
              <img src={dish.image} alt={dish.name} className={style.menuImage} />
            )}
            <div className={style.menuContent}>
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <p>{dish.price} €</p>
              <button
                className={style.btnAdd}
                onClick={() => addToCart(dish)}
                disabled={!isLogged}
              >
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={style.cart}>
        <h2 className={style.cartTitle}>🛒 Panier</h2>
        {cart.length === 0 ? (
          <p>Aucune commande pour l’instant.</p>
        ) : (
          <>
            <ul className={style.cartList}>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price} € x {item.quantity} = {item.price * item.quantity} €
                </li>
              ))}
            </ul>

            <p>Total : {total} €</p>

            {isLogged ? (
              <NavLink to={`/cart${tableId ? `?table=${tableId}` : ""}`} className={style.btnOrder}>
                Passer commande ✅
              </NavLink>
            ) : (
              <p style={{ color: "red" }}>Connectez-vous pour passer commande</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
