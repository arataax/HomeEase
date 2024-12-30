import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Main from './components/Main';
import AddProduct from './pages/AddProduct'
import ProductDetail from './components/ProductDetail';
import Footer from "./components/Footer";
import AdminPanel from './pages/AdminPanel';
import ProductList from "./components/ProductList";

function App() {
  return (
    <Router>
        <Navbar />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/administracion" element={<AdminPanel />} />
                <Route path="/administracion/lista-productos" element={<ProductList />} />
            </Routes>
        <Footer />
    </Router>
);
}

export default App;
