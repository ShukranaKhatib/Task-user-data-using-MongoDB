import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'; // Import icon
import './ForgotPassword.css'; // Import CSS file

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChangePassword = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const response = await axios.post('http://localhost:5000/change-password', { username, newPassword });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message || 'An error occurred');
        }
    };

    const handleBackToLogin = () => {
        navigate('/'); // Navigate back to the login page
    };

    return (
        <div className="forgot-password-container">
            <form onSubmit={handleChangePassword} className="forgot-password-form">
                <h2>Change Password</h2>
                <label htmlFor="username">Username</label>
                <div className="input-container">
                <i className="fas fa-user input-icon"></i>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    
                </div>
                <label htmlFor="password">New Password</label>
                <div className="input-container">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <i className="fas fa-lock"></i>
                </div>
                <button type="submit" className="change-password-button">Change Password</button>
                {message && <p className="message">{message}</p>}
                
                {/* Back to Login Button */}
                <button type="button" className="back-to-login-button" onClick={handleBackToLogin}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Login
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
