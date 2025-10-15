// client/pages/Cart.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import style from "../Styles/Cart.module.css";
import { CartContext } from "../context/CartContext";

const API_URL = "https://backendresto-production.up.railway.app"; // URL backend

const Cart = ({ clientInfo }) => {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calcul du total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!clientInfo || !clientInfo.clientId) {
      return alert("⚠️ Veuillez d’abord remplir vos informations client.");
    }

    if (cart.length === 0) {
      return alert("Votre panier est vide.");
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: clientInfo.clientId, // correspond à _id du client
          dishes: cart.map((item) => ({
            dishId: item.id || item._id, // selon ton objet dish
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Commande envoyée avec succès !");
        setCart([]); // vider le panier
        navigate("/order"); // redirige vers la page OrderPage
      } else {
        alert(`❌ Erreur lors de la commande : ${data.message || "inconnue"}`);
      }
    } catch (err) {
      console.error("Erreur handleOrder:", err);
      alert("❌ Erreur serveur, veuillez réessayer.");
    }
  };

  return (
    <div className={style.cartContainer}>
      <h1 className={style.cartTitle}>🛒 Votre Panier</h1>
      {cart.length === 0 ? (
        <p>Aucun plat ajouté.</p>
      ) : (
        <>
          <ul className={style.cartList}>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - {item.price} € x {item.quantity} = {item.price * item.quantity} €
              </li>
            ))}
          </ul>
          <p className={style.cartTotal}>Total : {total} €</p>
          <button className={style.btnOrder} onClick={handleOrder}>
            ✅ Confirmer la commande
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
