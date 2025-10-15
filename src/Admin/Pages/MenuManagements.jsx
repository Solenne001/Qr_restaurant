import { useState, useEffect } from "react";
import style from "../Style/MenuManagements.module.css";

const API_URL = "https://backendresto-production.up.railway.app/api/admin/menu";

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newItem, setNewItem] = useState({
    restaurant_id: 1, // adapte selon ton contexte
    name: "",
    description: "",
    price: "",
    photo: null,
    category: "",
  });

  // 🔹 Charger tous les plats
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setMenus(data.menus);
      else setMenus([]);
    } catch (err) {
      console.error("❌ fetchMenus:", err);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ajouter un plat
  const handleAdd = async () => {
    if (!newItem.name || !newItem.price || !newItem.category) return;

    try {
      const formData = new FormData();
      formData.append("restaurant_id", newItem.restaurant_id);
      formData.append("name", newItem.name);
      formData.append("description", newItem.description);
      formData.append("price", newItem.price);
      formData.append("category", newItem.category);
      if (newItem.photo) formData.append("photo", newItem.photo);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        fetchMenus();
        setNewItem({
          restaurant_id: 1,
          name: "",
          description: "",
          price: "",
          photo: null,
          category: "",
        });
      }
    } catch (err) {
      console.error("❌ handleAdd:", err);
    }
  };

  // 🔹 Modifier un plat
  const handleEdit = async (id) => {
    const item = menus.find((m) => m.id === id);
    if (!item) return;

    const newName = prompt("Nom du plat :", item.name);
    const newDescription = prompt("Description :", item.description);
    const newPrice = prompt("Prix :", item.price);
    const newCategory = prompt("Catégorie :", item.category);

    if (newName && newPrice && newCategory) {
      try {
        const formData = new FormData();
        formData.append("name", newName);
        formData.append("description", newDescription);
        formData.append("price", newPrice);
        formData.append("category", newCategory);

        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          body: formData,
        });

        fetchMenus();
      } catch (err) {
        console.error("❌ handleEdit:", err);
      }
    }
  };

  // 🔹 Supprimer un plat
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchMenus();
    } catch (err) {
      console.error("❌ handleDelete:", err);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className={style.menuContainer}>
      <h1 className={style.menuTitle}>🍽️ Gestion du Menu</h1>

      {/* Formulaire d'ajout */}
      <div className={style.addForm}>
        <input
          type="text"
          placeholder="Nom du plat"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Prix (€)"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        >
          <option value="">Choisir la catégorie</option>
          <option value="Menu du jour">Menu du jour</option>
          <option value="Petit-déjeuner">Petit-déjeuner</option>
          <option value="Repas">Repas</option>
          <option value="Dessert">Dessert</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewItem({ ...newItem, photo: e.target.files[0] })}
        />
        <button onClick={handleAdd} className={style.btnAdd}>Ajouter</button>
      </div>

      {/* Liste des plats */}
      <div className={style.menuList}>
        {menus.length === 0 ? (
          <p>Aucun plat disponible.</p>
        ) : (
          menus.map((item) => (
            <div key={item.id} className={style.menuItem}>
              <div className={style.itemInfo}>
                {item.photo && <img src={`https://backendresto-production.up.railway.app/${item.photo}`} alt={item.name} className={style.itemImage} />}
                <div>
                  <span className={style.itemName}>{item.name}</span>
                  <span className={style.itemCategory}> ({item.category})</span>
                  <span className={style.itemPrice}> - {item.price} €</span>
                  <p className={style.itemDescription}>{item.description}</p>
                </div>
              </div>
              <div>
                <button onClick={() => handleEdit(item.id)} className={style.btnEdit}>Modifier</button>
                <button onClick={() => handleDelete(item.id)} className={style.btnDelete}>Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
