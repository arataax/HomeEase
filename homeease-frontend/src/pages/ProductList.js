import React, { useEffect, useState } from 'react';
import axios from "axios";
import './ProductList.css';
import { useAuth } from '../components/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories');
        if (!response.ok) throw new Error('Error al obtener las categorías');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveCategory = (productId) => {
    const body = {
      categoryId: selectedCategory
    };

    axios.put(`http://localhost:8080/api/products/${productId}/category`, body)
      .then(() => {
        const updatedProducts = products.map((product) =>
          product.id === productId
            ? { ...product, category: categories.find((cat) => cat.id === selectedCategory) }
            : product
        );
        setProducts(updatedProducts);
        setEditProductId(null);
        setSelectedCategory(null);
      })
      .catch((error) => {
        console.error("Error al guardar la categoría:", error);
        alert("Error al guardar la categoría");
      });
  };

  if (isMobile) {
    return (
      <div className="mobile-message">
        <h1>Panel de administración no disponible en dispositivos móviles.</h1>
      </div>
    );
  }

  if (!user || !user.admin) {
    return (
      <div className="admin-message">
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    )
  }

  return (
    <div className="product-list-container">
      <h2>Lista de Productos</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                {editProductId === product.id ? (
                  <select
                    value={selectedCategory || product.category?.id || ""}
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  product.category ? product.category.name : "Sin categoría"
                )}
              </td>
              <td>
                {editProductId === product.id ? (
                  <div className="action-buttons">
                    <button onClick={() => handleSaveCategory(product.id)} className="save-btn">
                      Guardar
                    </button>
                    <button onClick={() => setEditProductId(null)} className="cancel-btn">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="action-buttons">
                    <button onClick={() => {
                      setEditProductId(product.id);
                      setSelectedCategory(product.category ? product.category.id : '');
                    }} className="edit-btn">
                      Editar Categoría
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="delete-btn">
                      Eliminar Producto
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
