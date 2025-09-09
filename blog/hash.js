const bcrypt = require('bcryptjs');

const plainPassword = 'test123';
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);
});
