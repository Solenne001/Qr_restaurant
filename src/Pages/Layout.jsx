import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import ClientNotifications from "./ClientNotifications";

function Layout({ clientInfo }) {
  return (
    <div>
      <Navbar />
      <ClientNotifications tableNumber={clientInfo.table || 1} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
