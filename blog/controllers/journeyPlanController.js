const db = require('../db');

exports.getAllPlans = (req, res) => {
    const userId = req.user.id;
    db.query('SELECT * FROM journey_plans WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ msg: 'DB error' });
        res.json(results);
    });
};

exports.createPlan = (req, res) => {
    const { name, locations, start_date, end_date, activities, description } = req.body;
    const userId = req.user.id;

    if (!name || !Array.isArray(locations) || !Array.isArray(activities)) {
        return res.status(400).json({ msg: 'Invalid input' });
    }

    db.query(
        'INSERT INTO journey_plans (user_id, name, locations, start_date, end_date, activities, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, name, JSON.stringify(locations), start_date, end_date, JSON.stringify(activities), description],
        (err, result) => {
            if (err) return res.status(500).json({ msg: 'Insert failed' });
            res.json({ id: result.insertId, ...req.body });
        }
    );
};

exports.updatePlan = (req, res) => {
    const { id } = req.params;
    const { name, locations, start_date, end_date, activities, description } = req.body;
    const userId = req.user.id;

    db.query(
        'UPDATE journey_plans SET name = ?, locations = ?, start_date = ?, end_date = ?, activities = ?, description = ? WHERE id = ? AND user_id = ?',
        [name, JSON.stringify(locations), start_date, end_date, JSON.stringify(activities), description, id, userId],
        (err) => {
            if (err) return res.status(500).json({ msg: 'Update failed' });
            res.json({ msg: 'Updated successfully' });
        }
    );
};

exports.deletePlan = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    db.query('DELETE FROM journey_plans WHERE id = ? AND user_id = ?', [id, userId], (err) => {
        if (err) return res.status(500).json({ msg: 'Delete failed' });
        res.json({ msg: 'Deleted successfully' });
    });
};
