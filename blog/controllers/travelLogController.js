
const db = require('../db');

exports.getAllLogs = (req, res) => {
    const userId = req.user.id;
    db.query('SELECT * FROM travel_logs WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database error: ', err); // Log the error
            return res.status(500).json({ msg: 'DB error' });
        }
        res.json(results);
    });
};


exports.createLog = (req, res) => {
    const { title, description, start_date, end_date, post_date, tags } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        console.error('Missing user ID in request');
        return res.status(400).json({ msg: 'Missing user ID' });
    }

    const query = `
        INSERT INTO travel_logs 
        (title, description, start_date, end_date, post_date, tags, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        title,
        description,
        start_date,
        end_date,
        post_date,
        JSON.stringify(tags),
        userId
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Insert error:", err); 
            return res.status(500).json({ msg: 'Insert failed', error: err });
        }
        res.json({ id: result.insertId, ...req.body });
    });
};


exports.updateLog = (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, post_date, tags } = req.body;
    const userId = req.user.id;
    db.query(
        'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ? WHERE id = ? AND user_id = ?',
        [title, description, start_date, end_date, post_date, JSON.stringify(tags), id, userId],
        (err) => {
            if (err) return res.status(500).json({ msg: 'Update failed' });
            res.json({ msg: 'Updated successfully' });
        }
    );
};

exports.deleteLog = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    db.query('DELETE FROM travel_logs WHERE id = ? AND user_id = ?', [id, userId], (err) => {
        if (err) return res.status(500).json({ msg: 'Delete failed' });
        res.json({ msg: 'Deleted successfully' });
    });
};
