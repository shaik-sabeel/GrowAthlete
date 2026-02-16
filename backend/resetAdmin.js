const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log('Connected to DB');

        const email = 'admin@growathlete.local';
        let admin = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        if (admin) {
            admin.password = hashedPassword;
            await admin.save();
            console.log(`Admin password reset to 'Admin@123'`);
        } else {
            // Create if not exists
            admin = new User({
                username: 'Administrator',
                email: email,
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            await admin.save();
            console.log(`Admin account created with password 'Admin@123'`);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdmin();
