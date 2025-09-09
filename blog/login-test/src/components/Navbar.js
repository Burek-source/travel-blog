import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user }) {
    return (
        <nav style={styles.navbar}>
            <div style={styles.linksContainer}>
                <Link to="/" style={styles.link}>Home</Link>
                {user ? (
                    <>
                        <Link to="/profile" style={styles.link}>Profile</Link>
                        <Link to="/travel-logs" style={styles.link}>Travel Logs</Link>
                        <Link to="/journey-plans" style={styles.link}>Journey Plans</Link>
                    </>
                ) : (
                    <Link to="/login" style={styles.link}>Login</Link>
                )}
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        padding: '1rem 2rem',
        backgroundColor: '#007BFF',  // Blue background for the navbar
        color: '#fff',  // White text
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',  // Subtle shadow for depth
    },
    linksContainer: {
        display: 'flex',
        gap: '1rem',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '500',
        padding: '8px 12px',
        borderRadius: '4px',
        transition: 'background-color 0.3s ease, transform 0.3s ease',  // Smooth hover effect
    },
    linkHover: {
        backgroundColor: '#0056b3',  // Darker blue on hover
        transform: 'scale(1.05)',  // Slightly scale up the link on hover
    },
};

export default Navbar;
