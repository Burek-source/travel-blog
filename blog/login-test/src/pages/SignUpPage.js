import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignUpPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/signup', formData);
            alert('Account created successfully!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Sign up failed. Try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Sign Up</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        value={formData.username}
                        style={styles.input}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password}
                        style={styles.input}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                        style={styles.input}
                        required
                    />
                    <input
                        name="address"
                        placeholder="Address"
                        onChange={handleChange}
                        value={formData.address}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>Sign Up</button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
                <p style={styles.loginText}>
                    Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    card: {
        padding: '2rem',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#28a745',
        color: 'white',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginTop: '0.5rem',
        textAlign: 'center',
    },
    loginText: {
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
    },
    link: {
        color: '#28a745',
        fontWeight: 'bold',
        textDecoration: 'none',
    }
};

export default SignUpPage;
