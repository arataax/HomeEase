import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', credentials);
            if (response.data) {
                login(response.data);
                navigate('/');
            } else {
                setError('Error en la autenticación. Verifique sus credenciales.');
            }
        } catch (err) {
            setError('Error al iniciar sesión. Verifique sus credenciales.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <h1 className='title'>Iniciar Sesión</h1>
            <div className='login-container'>
                <form onSubmit={handleSubmit} className='login-form'>
                    <div className='inputs-container'>
                        <input
                            className='login-input'
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Correo electrónico"
                            required
                        />
                        <input
                            className='login-input'
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                        <div className='password-icon'>
                            <i onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </i>
                        </div>
                        <button type="submit" className='login-button'>Iniciar Sesión</button>
                    </div>
                    {error && <p className='login-error'>{error}</p>}
                </form>
                <p>
                    Si no te registraste, crea una cuenta haciendo click{' '}
                    <Link to="/register" className="register-link">acá</Link>.
                </p>
            </div>
        </div>
    );
};

export default Login;

