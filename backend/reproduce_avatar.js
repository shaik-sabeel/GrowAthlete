const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI || "mongodb+srv://kousilendra:kou123@cluster0.puv5d.mongodb.net/PhotographyProject?retryWrites=true&w=majority&appName=Cluster0";

const reproduce = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        const testEmail = 'avatar_test_' + Date.now() + '@test.com';

        // Create a user
        const user = await User.create({
            username: 'AvatarTestUser',
            email: testEmail,
            password: 'Password@123',
            role: 'athlete'
        });
        console.log('User created:', user._id);

        // Simulate update payload from frontend
        // In ProfileEdit.jsx, if fields are empty, they are sent as empty strings
        const updateData = {};
        const fields = ['gender', 'sport', 'level'];
        // frontend sends them as empty strings if not selected
        fields.forEach(f => updateData[f] = "");

        console.log('Attempting update with:', updateData);

        try {
            // Simulate the logic in authRoutes.js
            const finalUpdate = {};
            if (updateData.gender !== undefined) finalUpdate.gender = updateData.gender;
            if (updateData.sport !== undefined) finalUpdate.sport = updateData.sport;
            if (updateData.level !== undefined) finalUpdate.level = updateData.level;

            console.log('Final update object applied to mongoose:', finalUpdate);

            // This mimics the controller logic
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                finalUpdate,
                { new: true, runValidators: true }
            );
            console.log('Update SUCCESS (Unexpected if validation works)');
        } catch (err) {
            console.log('Update FAILED as expected with error:', err.message);
            if (err.name === 'ValidationError') {
                console.log('Confirmed: ValidationError caught.');
            }
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
};

reproduce();
