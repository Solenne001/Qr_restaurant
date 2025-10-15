import  { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const SOCKET_URL = "https://backendresto-production.up.railway.app";

const ClientNotifications = ({ tableNumber }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!tableNumber) return;

    if (!socketRef.current) {
      const socket = io(SOCKET_URL);
      socketRef.current = socket;

      // Normaliser pour correspondre au serveur
      const normalizedId = String(tableNumber).trim().toLowerCase();
      socket.emit("joinClient", normalizedId);

      socket.on("new_order", (data) => {
        playSound();
        Swal.fire({
          icon: "success",
          title: "Commande reçue !",
          text: data.message || "Votre commande a été reçue ✅",
          timer: 12000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [tableNumber]);

  const playSound = () => {
    const audio = new Audio("/notifications.wav");
    audio.play().catch(() => {
      console.warn("🔇 Son de notification bloqué par le navigateur");
    });
  };

  return null;
};

export default ClientNotifications;
