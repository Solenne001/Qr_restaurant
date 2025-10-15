// Dashboard.jsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import CountUp from "react-countup";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import style from "../Style/Dashboard.module.css";

const socket = io("https://backendresto-production.up.railway.app");
const API_URL = "https://backendresto-production.up.railway.app/api/admin/sales";


const COLORS = ["#f59e0b", "#10b981", "#6366f1", "#f97316", "#ef4444"];

// ⚡ Fallback données statiques
const fallbackMonthly = [
  { month: "2025-01", totalSales: 1000 },
  { month: "2025-02", totalSales: 1500 },
  { month: "2025-03", totalSales: 1200 },
];

const fallbackOrdersPerDay = [
  { date: "2025-09-01", totalOrders: 5 },
  { date: "2025-09-02", totalOrders: 8 },
  { date: "2025-09-03", totalOrders: 3 },
];

const fallbackTopDishes = [
  { dish: "Burger", count: 15 },
  { dish: "Pizza", count: 10 },
  { dish: "Pasta", count: 8 },
  { dish: "Salade", count: 5 },
  { dish: "Tacos", count: 3 },
];

const Dashboard = () => {
  const [dailyOrders, setDailyOrders] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlySales, setMonthlySales] = useState(fallbackMonthly);
  const [ordersPerDay, setOrdersPerDay] = useState(fallbackOrdersPerDay);
  const [topDishes, setTopDishes] = useState(fallbackTopDishes);
  const [time, setTime] = useState(new Date());

  const fetchData = async () => {
    try {
      const [
        ordersRes,
        revenueRes,
        monthlyRes,
        ordersPerDayRes,
        topDishesRes
      ] = await Promise.all([
        fetch(`${API_URL}/orders-today`).then(r => r.json()),
        fetch(`${API_URL}/revenue-today`).then(r => r.json()),
        fetch(`${API_URL}/monthly`).then(r => r.json()),
        fetch(`${API_URL}/orders-per-day`).then(r => r.json()),
        fetch(`${API_URL}/top-dishes`).then(r => r.json())
      ]);

      if (ordersRes.success) setDailyOrders(Number(ordersRes.orders) || 0);
      if (revenueRes.success) setDailyRevenue(Number(revenueRes.revenue) || 0);

      if (monthlyRes.success && Array.isArray(monthlyRes.monthlySales)) {
        const formatted = monthlyRes.monthlySales.map(s => ({
          month: s.month,
          totalSales: Number(s.totalSales) || 0
        }));
        console.log("MonthlySales:", formatted);
        setMonthlySales(formatted.length ? formatted : fallbackMonthly);
      }

      if (ordersPerDayRes.success && Array.isArray(ordersPerDayRes.ordersPerDay)) {
        const formatted = ordersPerDayRes.ordersPerDay.map(o => ({
          date: o.date,
          totalOrders: Number(o.totalOrders) || 0
        }));
        console.log("OrdersPerDay:", formatted);
        setOrdersPerDay(formatted.length ? formatted : fallbackOrdersPerDay);
      }

      if (topDishesRes.success && Array.isArray(topDishesRes.topDishes)) {
        const formatted = topDishesRes.topDishes.map(d => ({
          dish: d.name,
          count: Number(d.totalSold) || 0
        }));
        console.log("TopDishes:", formatted);
        setTopDishes(formatted.length ? formatted : fallbackTopDishes);
      }

    } catch (err) {
      console.error("Erreur fetch Dashboard:", err);
      // En cas d'erreur, utiliser les fallback
      setMonthlySales(fallbackMonthly);
      setOrdersPerDay(fallbackOrdersPerDay);
      setTopDishes(fallbackTopDishes);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => setTime(new Date()), 1000);

    socket.on("order:update", fetchData);

    return () => {
      clearInterval(interval);
      socket.off("order:update");
    };
  }, []);


  return (
    <div className={style.dashboardContainer}>
      <header className={style.header}>
        <h1>Dashboard Admin</h1>
      </header>

      {/* 4 cadres supérieurs */}
      <div className={style.statsGrid}>
        <div className={`${style.statCard} ${style.ordersCard}`}>
          <div className={style.icon}>📦</div>
          <div className={style.number}><CountUp end={dailyOrders} duration={1} separator="," /></div>
          <div className={style.label}>Commandes aujourd’hui</div>
        </div>

        <div className={`${style.statCard} ${style.revenueCard}`}>
          <div className={style.icon}>💰</div>
          <div className={style.number}><CountUp end={dailyRevenue} duration={1} decimals={2} decimal="." /> FCFA</div>
          <div className={style.label}>Chiffre d’affaires</div>
        </div>

        <div className={`${style.statCard} ${style.topDishCard}`}>
          <div className={style.icon}>🥇</div>
          <div className={style.number}>{topDishes[0]?.count || 0}</div>
          <div className={style.label}>{topDishes[0]?.dish || "-"} le plus vendu</div>
        </div>

        <div className={`${style.statCard} ${style.timeCard}`}>
          <div className={style.icon}>🕒</div>
          <div className={style.number}>{time.toLocaleTimeString()}</div>
          <div className={style.label}>Heure actuelle</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className={style.charts}>
        {/* Ventes par mois */}
        <div className={style.chart}>
          <h3>Ventes par mois</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalSales" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Nombre de commandes par jour */}
        <div className={style.chart}>
          <h3>Nombre de commandes par jour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalOrders" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 plats vendus */}
        <div className={style.chart}>
          <h3>Top 5 plats vendus</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topDishes}
                dataKey="count"
                nameKey="dish"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {topDishes.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
