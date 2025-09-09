import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TravelLogsPage() {
    const [logs, setLogs] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        post_date: '',
        tags: '',
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/travel-logs', { withCredentials: true });
            setLogs(res.data);
        } catch (err) {
            alert("Failed to fetch travel logs.");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            tags: form.tags.split(',').map(tag => tag.trim()),
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/travel-logs/${editingId}`, payload, { withCredentials: true });
            } else {
                await axios.post('http://localhost:5000/travel-logs', payload, { withCredentials: true });
            }

            setForm({ title: '', description: '', start_date: '', end_date: '', post_date: '', tags: '' });
            setEditingId(null);
            fetchLogs();
        } catch (err) {
            alert("Failed to submit travel log.");
        }
    };

    const handleEdit = (log) => {
        setForm({
            title: log.title,
            description: log.description,
            start_date: log.start_date?.slice(0, 10),
            end_date: log.end_date?.slice(0, 10),
            post_date: log.post_date?.slice(0, 10),
            tags: JSON.parse(log.tags || '[]').join(', '),
        });
        setEditingId(log.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/travel-logs/${id}`, { withCredentials: true });
            fetchLogs();
        } catch (err) {
            alert("Failed to delete log.");
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Travel Logs</h2>

            <div style={styles.formContainer}>
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} style={styles.input} />
                <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.input} />
                <input name="start_date" type="date" value={form.start_date} onChange={handleChange} style={styles.input} />
                <input name="end_date" type="date" value={form.end_date} onChange={handleChange} style={styles.input} />
                <input name="post_date" type="date" value={form.post_date} onChange={handleChange} style={styles.input} />
                <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} style={styles.input} />
                <button onClick={handleSubmit} style={styles.submitButton}>
                    {editingId ? 'Update Log' : 'Create Log'}
                </button>
            </div>

            <div style={styles.list}>
                {logs.map(log => (
                    <div key={log.id} style={styles.card}>
                        <h3>{log.title}</h3>
                        <p><strong>Description:</strong> {log.description}</p>
                        <p>
                            <strong>Dates:</strong> {new Date(log.start_date).toLocaleDateString()}{" "}
                            to{" "}{new Date(log.end_date).toLocaleDateString()}
                        </p>
                        
                        <p><strong>Post Date:</strong> {new Date(log.post_date).toLocaleDateString()}</p>
                        <p><strong>Tags:</strong> {JSON.parse(log.tags || '[]').join(', ')}</p>
                        <div style={styles.cardActions}>
                            <button onClick={() => handleEdit(log)} style={styles.editButton}>Edit</button>
                            <button onClick={() => handleDelete(log.id)} style={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        backgroundColor: '#f4f4f4',
        minHeight: '100vh',
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333'
    },
    formContainer: {
        display: 'grid',
        gap: '1rem',
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '10px',
        maxWidth: '600px',
        margin: '0 auto 2rem auto',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc'
    },
    submitButton: {
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto'
    },
    card: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    cardActions: {
        marginTop: '1rem',
        display: 'flex',
        gap: '1rem'
    },
    editButton: {
        backgroundColor: '#17a2b8',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default TravelLogsPage;
