import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfilePage({ user, setUser }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState(user?.email || '');
    const [address, setAddress] = useState(user?.address || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/profile', {
                email,
                address
            }, { withCredentials: true });

            setSuccessMessage(res.data.msg);
            setError('');
        } catch (err) {
            setSuccessMessage('');
            setError(err.response?.data?.msg || 'Error updating profile');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:5000/update-password', {
                currentPassword,
                newPassword
            }, { withCredentials: true });

            setSuccessMessage(res.data.msg);
            setError('');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setSuccessMessage('');
            setError(err.response?.data?.msg || 'Error updating password');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
            try {
                await axios.delete('http://localhost:5000/profile', { withCredentials: true });
                setUser(null);
                navigate('/signup');
            } catch (err) {
                setError(err.response?.data?.msg || 'Error deleting account');
            }
        }
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome, {user.username}!</h2>

                <div style={styles.section}>
                    <h3>Your Info</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>

                <hr />

                <div style={styles.section}>
                    <h3>Update Profile</h3>
                    {error && <p style={styles.error}>{error}</p>}
                    {successMessage && <p style={styles.success}>{successMessage}</p>}
                    <form onSubmit={handleUpdateProfile} style={styles.form}>
                        <input
                            type="email"
                            placeholder="New Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="New Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Update Profile</button>
                    </form>
                </div>

                <hr />

                <div style={styles.section}>
                    <h3>Change Password</h3>
                    <form onSubmit={handleUpdatePassword} style={styles.form}>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Change Password</button>
                    </form>
                </div>

                <hr />

                <div style={styles.section}>
                    <h3>Delete Account</h3>
                    <button onClick={handleDeleteAccount} style={styles.deleteBtn}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
    },
    card: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1rem',
        color: '#333',
    },
    section: {
        marginBottom: '2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    logoutBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        marginTop: '1rem',
        cursor: 'pointer',
    },
    deleteBtn: {
        padding: '0.75rem',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '0.5rem',
    },
    success: {
        color: 'green',
        marginBottom: '0.5rem',
    },
};

export default ProfilePage;
