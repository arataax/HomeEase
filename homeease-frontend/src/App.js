import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Main from './components/Main';
import AddProduct from './pages/AddProduct'
import ProductDetail from './pages/ProductDetail';
import Footer from "./components/Footer";
import AdminPanel from './pages/AdminPanel';
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import ManageProducts from "./pages/ManageProducts";
import ProductFeatures from "./pages/ProductFeatures";
import 'font-awesome/css/font-awesome.min.css';
import AddCategory from "./pages/AddCategory";
import Favorites from "./pages/Favorites";
import AdminCategories from "./pages/AdminCategories";
import Reserve from "./pages/Reserve";
import ReservationConfirmation from "./components/ReservationConfirmation";
import Reservations from "./pages/Reservations";
import WhatsappButton from "./components/WhatsappButton";

function App() {
  return (
    <Router>
        <Navbar />
        <WhatsappButton />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/reserve/:id" element={<Reserve />} />
                <Route path="/administracion" element={<AdminPanel />} />
                <Route path="/administracion/lista-productos" element={<ProductList />} />
                <Route path="/administracion/add-product" element={<AddProduct />} />
                <Route path="/administracion/lista-usuarios" element={<UserList />} />
                <Route path="/administracion/manage-products" element={<ManageProducts />} />
                <Route path="/administracion/products/:id/features" element={<ProductFeatures />} />
                <Route path="/administracion/add-category" element={<AddCategory />} />
                <Route path="/administracion/delete-categories" element={<AdminCategories />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/reservation-confirmation" element={<ReservationConfirmation  />} />
                <Route path="/reservations" element={<Reservations  />} />
            </Routes>
            <Footer />
    </Router>
);
}

export default App;
