import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
            setError('Todos los campos son obligatorios');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/users/register', userData);
            console.log(response.data);
            alert('Usuario registrado con éxito!');
            navigate('/login');
        } catch (err) {
            setError(err.response.data.message || 'Error al registrar el usuario');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <h1 className='title'>Registrar Usuario</h1>
            <div className='register-container'>
                <form onSubmit={handleSubmit} className='register-form'>
                    <div className='inputs-container'>
                        <input
                            className='register-input'
                            type="text"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange}
                            placeholder="Nombre"
                            required
                        />
                        <input
                            className='register-input'
                            type="text"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange}
                            placeholder="Apellido"
                            required
                        />
                        <input
                            className='register-input'
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="Correo electrónico"
                            required
                        />
                        <input
                            className='register-input-password'
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                        <div className='password-icon'>
                            <i onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </i>
                        </div>
                        <button type="submit" className='register-button'>Registrar</button>
                    </div>
                    {error && <p>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
