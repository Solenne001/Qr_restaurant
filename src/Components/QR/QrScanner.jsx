import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QrScanner = ({ onScan }) => {
  const [error, setError] = useState("");

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Scanner le QR Code</h2>

      <QrReader
        onResult={(result, err) => {
          if (!!result) {
            onScan(result?.text); // renvoie le texte scanné au parent
          }
          if (!!err) {
            setError(err.message);
          }
        }}
        constraints={{ facingMode: "environment" }}
        style={{ width: "100%", maxWidth: "400px" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QrScanner;
