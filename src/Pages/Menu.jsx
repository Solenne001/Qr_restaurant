import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import style from "../Styles/Menu.module.css";
import { CartContext } from "../context/CartContext";
import QrScanner from "../Components/QR/QrScanner"; // ton composant existant

const API_URL = "https://backendresto-production.up.railway.app";

const Menu = () => {
  const { cart, setCart } = useContext(CartContext);
  const [tableId, setTableId] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Récupérer l'id de la table après scan
  const handleScan = (scannedText) => {
    if (!scannedText) return;
    const parts = scannedText.split("/");
    const table = parts[parts.length - 1];
    setTableId(table);
  };

  // 🔹 Charger le menu après scan
  useEffect(() => {
    if (!tableId) return;

    const fetchDishes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/dishes`);
        const data = await res.json();
        if (data.success && data.dishes.length > 0) {
          setDishes(data.dishes);
        } else {
          setDishes([]);
        }
      } catch (err) {
        console.error("❌ Erreur fetchDishes :", err);
        setError("Impossible de charger le menu");
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [tableId]);

  // 🔹 Ajouter au panier
  const addToCart = (dish) => {
    if (!tableId) return alert("⚠️ Veuillez scanner le QR code de votre table d'abord.");

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

  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 🔹 Affichage
  if (!tableId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Scanner le QR Code de votre table</h2>
        <QrScanner onScan={handleScan} />
      </div>
    );
  }

  return (
    <div className={style.menuContainer}>
      <h1 className={style.menuTitle}>🍽️ Menu - Table {tableId}</h1>

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
              <button className={style.btnAdd} onClick={() => addToCart(dish)}>
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
                  {item.name} - {item.price} € x {item.quantity} ={" "}
                  {item.price * item.quantity} €
                  <button className={style.btnCancel} onClick={() => removeFromCart(index)}>
                    Annuler
                  </button>
                </li>
              ))}
            </ul>
            <p>Total : {total} €</p>
            <NavLink to="/cart" className={style.btnOrder}>
              Passer commande
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
