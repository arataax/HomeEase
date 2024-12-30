import React, { useState } from "react";
import './AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    if (file) {
      formData.append("image", file);
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {
        const errorMessage = await response.text(); // Captura el mensaje del backend
        throw new Error(errorMessage);
      }
    
      alert("Producto guardado correctamente");
    } catch (error) {
        console.error("Error al guardar el producto:", error);
        alert(error.message);
      }
  };


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
          placeholder="Precio(Ej:1.00)"
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
        <input type="file" onChange={handleFileChange} />
        <button type="submit">
          Guardar Producto
        </button>
      </div>
    </form>
  );
};

export default AddProduct;

