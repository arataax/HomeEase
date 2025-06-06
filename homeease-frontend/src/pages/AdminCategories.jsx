import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCategories.css';
import { useAuth } from '../components/AuthContext';

const AdminCategories = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/api/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleDeleteClick = (categoryId) => {
        const selectedCategory = categories.find(category => category.id === categoryId);
        setCategoryToDelete(selectedCategory);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        axios.delete(`http://localhost:8080/api/categories/${categoryToDelete.id}`)
            .then(response => {
                setCategories(categories.filter(category => category.id !== categoryToDelete.id));
                setIsDeleteModalOpen(false);
            })
            .catch(error => {
                console.error('Error deleting category:', error);
            });
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    if (isMobile) {
        return (
            <div className="admin-message">
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
        <div className="admin-categories-container">
            <h1 className="admin-categories-title">Administrar Categorías</h1>
            <ul className="categories-list">
                {categories.map(category => (
                    <li key={category.id} className="category-item">
                        <h3 className="category-name">{category.name}</h3>
                        <p className="category-description">{category.description}</p>
                        <button className="delete-button" onClick={() => handleDeleteClick(category.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h4 className="modal-title">
                            ¿Estás seguro de que deseas eliminar la categoría "{categoryToDelete?.name}"?
                        </h4>
                        <div className="modal-buttons">
                            <button
                                className="modal-confirm-button"
                                onClick={handleConfirmDelete}
                            >
                                Sí, eliminar
                            </button>
                            <button
                                className="modal-cancel-button"
                                onClick={handleCancelDelete}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
