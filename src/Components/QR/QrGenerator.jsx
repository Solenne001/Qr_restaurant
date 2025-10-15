import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QrGenerator = ({ tableId }) => {
  const qrRef = useRef();

  const url = `http://localhost:3000/menu/${tableId}`; 

  const downloadQr = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const imageURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `QR_table_${tableId}.png`;
    link.click();
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>QR Code pour la table {tableId}</h3>
      <div ref={qrRef}>
        <QRCodeCanvas value={url} size={200} />
      </div>
      <button onClick={downloadQr} style={{ marginTop: "10px" }}>
        Télécharger le QR
      </button>
    </div>
  );
};

export default QrGenerator;
