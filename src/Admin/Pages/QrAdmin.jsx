import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";
import style from "../Style/QrAdmin.module.css";

const API_URL = "https://backendresto-production.up.railway.app/api/qrs";

const QrAdmin = () => {
  const [tableNumber, setTableNumber] = useState("");
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧭 Charger tous les QR existants
  const fetchQrs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setQrs(data.qrs);
    } catch (err) {
      console.error("❌ Erreur fetchQrs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrs();
  }, []);

  // 🧩 Créer un QR et l’enregistrer
  const generateQr = async () => {
    if (!tableNumber.trim()) {
      return Swal.fire("Erreur", "Entre un numéro de table valide.", "error");
    }

    // const qrUrl = `${window.location.origin}/menu/${tableNumber}`;
    const qrUrl = `https://menuqr-alpha.vercel.app/menu/${tableNumber}`;


     try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNumber, qrUrl }),
    });

    const data = await res.json();

    if (!data.success) {
      return Swal.fire("Erreur", data.message || "Impossible de créer le QR", "error");
    }

    setQrs((prev) => [data.qr, ...prev]);
    setTableNumber("");
    Swal.fire("Succès", "QR code créé avec succès !", "success");
  } catch (err) {
    console.error("❌ Erreur generateQr:", err);
    Swal.fire("Erreur", "Problème serveur.", "error");
  }
};

  // 🗑️ Supprimer un QR
  const deleteQr = async (id) => {
    const confirm = await Swal.fire({
      title: "Supprimer ce QR ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setQrs((prev) => prev.filter((q) => q.id !== id));
        Swal.fire("Supprimé", "QR supprimé avec succès.", "success");
      }
    } catch (err) {
      console.error("❌ Erreur deleteQr:", err);
      Swal.fire("Erreur", "Impossible de supprimer ce QR.", "error");
    }
  };

  // 💾 Télécharger un QR
  const downloadQr = (tableNumber) => {
    const canvas = document.getElementById(`qr-${tableNumber}`);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `table-${tableNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Chargement des QR codes...</p>;

  return (
    <div className={style.qrContainer}>
      <h1 className={style.qrTitle}>📱 Gestion des QR Codes</h1>

      <div className={style.qrForm}>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Numéro ou nom de table"
          className={style.qrInput}
        />
        <button onClick={generateQr} className={style.qrButton}>
          Générer QR
        </button>
      </div>

      {qrs.length === 0 ? (
        <p>Aucun QR code pour le moment.</p>
      ) : (
        <div className={style.qrList}>
          {qrs.map((qr) => (
            <div key={qr.id} className={style.qrCard}>
              <h3>Table : {qr.table_number}</h3>
              <QRCodeCanvas
                id={`qr-${qr.table_number}`}
                value={qr.qr_url}
                size={150}
                includeMargin={true}
              />
              <div className={style.qrActions}>
                <button onClick={() => downloadQr(qr.table_number)} className={style.qrBtnDownload}>
                  Télécharger
                </button>
                <button onClick={() => deleteQr(qr.id)} className={style.qrBtnDelete}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QrAdmin;
