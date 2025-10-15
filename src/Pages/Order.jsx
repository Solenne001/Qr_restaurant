// client/pages/OrderPage.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import style from "../Styles/Order.module.css";

const API_URL = "https://backendresto-production.up.railway.app"; // 🔧 URL backend

const OrderPage = ({ clientInfo }) => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!clientInfo?.clientId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`);
        const data = await res.json();

        if (data.success && data.orders) {
          // On récupère la commande correspondant au client
          const clientOrder = data.orders.find(
            (o) => o.client_id === clientInfo.clientId
          );
          setOrder(clientOrder || null);
        }
      } catch (err) {
        console.error("❌ Erreur fetchOrder :", err);
      }
    };

    fetchOrder();
  }, [clientInfo]);

  if (!order) return <p>Chargement de votre commande...</p>;

  const total = order.dishes.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={style.orderContainer}>
      <h1 className={style.orderTitle}>✅ Commande Confirmée</h1>
      <p className={style.orderMessage}>
        Merci pour votre commande ! Voici le récapitulatif :
      </p>

      <ul className={style.orderList}>
        {order.dishes.map((item, index) => (
          <li key={index} className={style.orderItem}>
            {item.name} x {item.quantity} = {item.price * item.quantity} €
          </li>
        ))}
      </ul>

      <p className={style.orderTotal}>Total : {total} €</p>
      <p className={style.orderStatus}>Statut : {order.status}</p>

      <NavLink to="/menu" className={style.btnBack}>
        Retour au menu
      </NavLink>
    </div>
  );
};

export default OrderPage;
