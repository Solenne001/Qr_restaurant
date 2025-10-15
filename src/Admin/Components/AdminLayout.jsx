import NavbarAdmin from "./AdminNavbar.jsx";
import { Outlet } from "react-router-dom";
import style from "../Style/AdminLayout.module.css";

const AdminLayout = () => {
  return (
    <div className={style.adminContainer}>
      <main className={style.mainContent}>
        <Outlet />
      </main>
      <NavbarAdmin />
    </div>
  );
};

export default AdminLayout;
