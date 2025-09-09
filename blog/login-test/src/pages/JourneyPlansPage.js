import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JourneyPlansPage() {
    const [plans, setPlans] = useState([]);
    const [form, setForm] = useState({
        name: '',
        locations: '',
        start_date: '',
        end_date: '',
        activities: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await axios.get('http://localhost:5000/journey-plans', { withCredentials: true });
            setPlans(res.data);
        } catch (error) {
            alert('Failed to fetch journey plans.');
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            locations: form.locations.split(',').map(loc => loc.trim()),
            activities: form.activities.split(',').map(act => act.trim()),
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/journey-plans/${editingId}`, payload, { withCredentials: true });
            } else {
                await axios.post('http://localhost:5000/journey-plans', payload, { withCredentials: true });
            }

            setForm({
                name: '',
                locations: '',
                start_date: '',
                end_date: '',
                activities: '',
                description: ''
            });
            setEditingId(null);
            fetchPlans();
        } catch (error) {
            alert('Failed to submit journey plan.');
        }
    };

    const handleEdit = (plan) => {
        setForm({
            name: plan.name,
            locations: JSON.parse(plan.locations || '[]').join(', '),
            start_date: plan.start_date?.slice(0, 10),
            end_date: plan.end_date?.slice(0, 10),
            activities: JSON.parse(plan.activities || '[]').join(', '),
            description: plan.description || ''
        });
        setEditingId(plan.id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/journey-plans/${id}`, { withCredentials: true });
            fetchPlans();
        } catch (error) {
            alert('Failed to delete journey plan.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Journey Plans</h2>

            <div style={styles.formContainer}>
                <input name="name" placeholder="Journey Name" value={form.name} onChange={handleChange} style={styles.input} />
                <input name="locations" placeholder="Locations (comma-separated)" value={form.locations} onChange={handleChange} style={styles.input} />
                <input name="start_date" type="date" value={form.start_date} onChange={handleChange} style={styles.input} />
                <input name="end_date" type="date" value={form.end_date} onChange={handleChange} style={styles.input} />
                <input name="activities" placeholder="Activities (comma-separated)" value={form.activities} onChange={handleChange} style={styles.input} />
                <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.input} />
                <button onClick={handleSubmit} style={styles.submitButton}>
                    {editingId ? 'Update Plan' : 'Create Plan'}
                </button>
            </div>

            <div style={styles.list}>
                {plans.map(plan => (
                    <div key={plan.id} style={styles.card}>
                        <h3>{plan.name}</h3>
                        <p><strong>Locations:</strong> {JSON.parse(plan.locations || '[]').join(', ')}</p>
                        <p><strong>Dates:</strong> {new Date(plan.start_date).toLocaleDateString()}{" "}to{" "} 
                        {new Date(plan.end_date).toLocaleDateString()}</p>

                        <p><strong>Activities:</strong> {JSON.parse(plan.activities || '[]').join(', ')}</p>
                        <p><strong>Description:</strong> {plan.description}</p>
                        <div style={styles.cardActions}>
                            <button onClick={() => handleEdit(plan)} style={styles.editButton}>Edit</button>
                            <button onClick={() => handleDelete(plan.id)} style={styles.deleteButton}>Delete</button>
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
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
    },
    title: {
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#333'
    },
    formContainer: {
        display: 'grid',
        gap: '1rem',
        maxWidth: '600px',
        margin: '0 auto 2rem auto',
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    input: {
        padding: '0.75rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem'
    },
    submitButton: {
        padding: '0.75rem',
        backgroundColor: '#28a745',
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
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    deleteButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default JourneyPlansPage;
