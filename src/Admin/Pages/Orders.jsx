import { useEffect, useState } from "react";
import style from "../Style/Orders.module.css";

const API_URL = "https://backendresto-production.up.railway.app/api/admin/orders";

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch commandes
  const fetchOrders = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) {
        // ⚡ Remplacer complètement l'état pour éviter doublons
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("❌ fetchOrders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Marquer une commande "Reçue"
  const markReceived = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/received/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Erreur lors de la mise à jour");
        return;
      }
      // Mettre à jour l'ordre dans l'état
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o._id === orderId ? data.order : o))
      );
    } catch (err) {
      console.error("❌ markReceived:", err);
    }
  };

  if (loading) return <p>Chargement des commandes...</p>;

  // 🔹 Grouper par date
  const ordersByDate = orders.reduce((acc, order) => {
    const date = new Date(order.created_at || order.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  return (
    <div className={style.ordersContainer}>
      <h1 className={style.ordersTitle}>Commandes</h1>

      {orders.length === 0 ? (
        <p>Aucune commande pour le moment.</p>
      ) : (
        Object.keys(ordersByDate).map((date) => (
          <div key={date} className={style.dateGroup}>
            <h2>{date}</h2>
            {ordersByDate[date].map((order) => {
              const total = order.items.reduce(
                (sum, d) => sum + d.price * d.quantity,
                0
              );

              const clientDisplay = order.client_name
                ? order.client_name
                : order.client_table
                ? `Table ${order.client_table}`
                : `Table ${order.order_table}`;

              return (
                <div key={order.id || order._id} className={style.orderCard}>
                  <p>
                    <strong>Client:</strong> {clientDisplay}
                  </p>
                  <p>
                    <strong>Heure:</strong>{" "}
                    {new Date(order.created_at || order.date).toLocaleTimeString()}
                  </p>

                  <ul className={style.orderItems}>
                    {order.items.map((d, index) => (
                      <li key={`${order.id || order._id}-${d.dish_name}-${index}`}>
                        {d.dish_name} × {d.quantity} → {d.price * d.quantity} €
                      </li>
                    ))}
                  </ul>

                  <div className={style.orderFooter}>
                    <p>
                      <strong>Total:</strong> {total} €
                    </p>
                    <p>
                      <strong>Statut:</strong> {order.status}
                    </p>
                  </div>

                  <div className={style.btnGroup}>
                    {order.status === "Reçue" ? null : (
                      <button
                        className={style.btnStatus}
                        onClick={() => markReceived(order.id || order._id)}
                      >
                        Marquer Reçue
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersAdmin;
