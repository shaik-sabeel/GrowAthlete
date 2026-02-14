const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI || "mongodb+srv://kousilendra:kou123@cluster0.puv5d.mongodb.net/PhotographyProject";

const testStreak = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        const testEmail = 'streak_test_' + Date.now() + '@test.com';

        // 1. Create User
        const user = await User.create({
            username: 'StreakTester',
            email: testEmail,
            password: 'Password@123',
            role: 'athlete'
        });
        console.log('User created. ID:', user._id);

        // Helper to simulate login (copies logic from authRoutes)
        const simulateLogin = async (userId, customNow) => {
            const u = await User.findById(userId);
            const today = customNow ? new Date(customNow) : new Date();
            today.setHours(0, 0, 0, 0);

            let newStreak = u.streak || 0;

            if (u.lastLoginDate) {
                const lastLogin = new Date(u.lastLoginDate);
                lastLogin.setHours(0, 0, 0, 0);

                const diffTime = Math.abs(today - lastLogin);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    newStreak += 1;
                    console.log(`[${customNow || 'Today'}] Consecutive login! Streak +1`);
                } else if (diffDays > 1) {
                    newStreak = 1;
                    console.log(`[${customNow || 'Today'}] Missed ${diffDays} days. Streak reset to 1.`);
                } else {
                    console.log(`[${customNow || 'Today'}] Same day login. Streak unchanged.`);
                }
            } else {
                newStreak = 1;
                console.log(`[${customNow || 'Today'}] First login. Streak initialized to 1.`);
            }

            u.streak = newStreak;
            u.lastLoginDate = customNow ? new Date(customNow) : new Date();
            await u.save();
            return newStreak;
        };

        // Scenario 1: First login (Day 1)
        let s = await simulateLogin(user._id, '2024-01-01T10:00:00');
        console.log(`Streak: ${s} (Expected: 1)`);

        // Scenario 2: Same day login (Day 1)
        s = await simulateLogin(user._id, '2024-01-01T15:00:00');
        console.log(`Streak: ${s} (Expected: 1)`);

        // Scenario 3: Next day login (Day 2)
        s = await simulateLogin(user._id, '2024-01-02T09:00:00');
        console.log(`Streak: ${s} (Expected: 2)`);

        // Scenario 4: Skip a day (Day 4) -> Should reset
        s = await simulateLogin(user._id, '2024-01-04T09:00:00');
        console.log(`Streak: ${s} (Expected: 1)`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
    }
};

testStreak();
