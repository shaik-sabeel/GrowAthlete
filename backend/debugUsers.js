const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log('Connected to DB');

        // Reset password for ALL athletes to ensure they can login
        const salt = await bcrypt.genSalt(10);
        const newPassword = 'Athlete@123';
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await User.updateMany(
            { role: 'athlete' },
            { $set: { password: hashedPassword } }
        );

        console.log(`Reset passwords for ${result.modifiedCount} athlete(s) to '${newPassword}'`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listUsers();
