import React, { useState, useEffect, useRef } from "react";
import './AddProduct.css';
import axios from "axios";
import { useAuth } from '../components/AuthContext';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/categories")
      .then(response => {
        console.log("Categorías cargadas:", response.data);
        setCategories(response.data);
      })
      .catch(error => {
        console.error("Error al cargar categorías:", error);
      });
  }, []);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("categoryId", product.categoryId);
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      alert("Producto guardado correctamente");
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: ""
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert(error.message);
    }
  };

  if (!user || !user.admin) {
    return (
      <div className="admin-message">
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="mobile-message">
        <h1>Panel de administración no disponible en dispositivos móviles.</h1>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="add-product-container">
        <h2>Agregar Producto</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre del producto"
          value={product.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={product.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Precio (Ej: 1.00)"
          value={product.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={product.stock}
          onChange={handleChange}
        />
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleChange}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input type="file" onChange={handleFileChange} ref={fileInputRef} />
        <button type="submit">
          Guardar Producto
        </button>
      </div>
    </form>
  );
};

export default AddProduct;

