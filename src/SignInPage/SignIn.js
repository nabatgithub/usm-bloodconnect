import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from './components/AuthLayout';
import { Link, useLocation } from 'react-router-dom';
import { Input } from './components/Input';
import styles from './SignIn.module.css';

const SignIn = ({ onSignIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                onSignIn(data.user); // Pass user data to parent component
                if (data.user.role === 'user') {
                    navigate('/');
                } else if (data.user.role === 'admin') {
                    navigate('/admin-home');
                } else if (data.user.role === 'medical-staff') {
                    navigate('/appointment-view-ms');
                }
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    const isFormValid = email.trim() !== '' && password.trim() !== '';

    return (
        <AuthLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.welcome}>
                        Welcome to <span className={styles.brandText}>BloodConnect</span>
                    </h2>
                    <nav className={styles.authNav}>
                        <Link to="/sign-in" className={styles.navLink}>
                            <button
                                className={`${styles.activeButton} ${
                                    location.pathname === '/sign-in' ? styles.active : ''
                                }`}
                            >
                                Sign In
                            </button>
                        </Link>
                        <Link to="/sign-up" className={styles.navLink}>
                            <button
                                className={`${styles.inactiveButton} ${
                                    location.pathname === '/sign-up' ? styles.active : ''
                                }`}
                            >
                                Sign Up
                            </button>
                        </Link>
                    </nav>
                </header>

                <form className={styles.form} onSubmit={handleSignIn}>
                    <Input
                        label="Enter your email address"
                        placeholder="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Enter your password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                    <button
                        type="submit"
                        className={`${styles.submitButton} ${
                            isFormValid ? styles.enabled : styles.disabled
                        }`}
                        disabled={!isFormValid}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default SignIn;