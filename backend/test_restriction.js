const mongoose = require('mongoose');
const User = require('./models/User');
const Tournament = require('./models/Tournament');
require('dotenv').config();

const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI;

const checkRestriction = async () => {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

        // cleanup
        await User.deleteMany({ email: { $in: ['leader1@test.com', 'leader2@test.com', 'member@test.com'] } });
        await Tournament.deleteMany({ title: 'Test Restriction Tournament' });

        // Create Users
        const leader1 = await User.create({ username: 'Leader1', email: 'leader1@test.com', password: 'Password@123', role: 'athlete' });
        const leader2 = await User.create({ username: 'Leader2', email: 'leader2@test.com', password: 'Password@123', role: 'athlete' });
        const member = await User.create({ username: 'Member', email: 'member@test.com', password: 'Password@123', role: 'athlete' });

        // Create Tournament
        const tournament = await Tournament.create({
            title: 'Test Restriction Tournament',
            sport: 'Soccer',
            location: 'Test Location',
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000),
            organizer: leader1._id
        });

        // 1. Leader1 creates Team 1 with Member
        const team1Data = {
            user: leader1._id,
            teamName: 'Team 1',
            phoneNumber: '1234567890',
            email: 'leader1@test.com',
            age: 25,
            gender: 'Male',
            status: 'Approved',
            registrationDate: Date.now(),
            teamSize: 5,
            members: [leader1._id, member._id]
        };
        tournament.registrations.push(team1Data);
        tournament.registeredTeams = 1;
        await tournament.save();
        console.log('Team 1 created with Leader1 and Member.');

        // 2. Member tries to create a new team (should fail)
        // We simulate the check logic here
        const isMemberRestricted = tournament.registrations.find(
            (r) => r.user.toString() === member._id.toString() || r.members.includes(member._id)
        );

        if (isMemberRestricted) {
            console.log('SUCCESS: Member is correctly identified as already registered when trying to create a team.');
        } else {
            console.error('FAIL: Member was NOT identified as already registered.');
            process.exit(1);
        }

        // 3. Member tries to join Team 2 (created by Leader2)
        // Create Team 2 first
        const team2Data = {
            user: leader2._id,
            teamName: 'Team 2',
            phoneNumber: '0987654321',
            email: 'leader2@test.com',
            age: 26,
            gender: 'Male',
            status: 'Approved',
            registrationDate: Date.now(),
            teamSize: 5,
            members: [leader2._id]
        };
        tournament.registrations.push(team2Data);
        tournament.registeredTeams = 2;
        await tournament.save();
        console.log('Team 2 created.');

        const team2 = tournament.registrations.find(r => r.teamName === 'Team 2');

        // Simulate join check
        const isAlreadyRegistered = tournament.registrations.some(r =>
            r.user.toString() === member._id.toString() || r.members.includes(member._id)
        );

        if (isAlreadyRegistered) {
            console.log('SUCCESS: Member is correctly identified as already registered when trying to join another team.');
        } else {
            console.error('FAIL: Member was NOT identified as already registered when trying to join.');
            process.exit(1);
        }

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await User.deleteMany({ email: { $in: ['leader1@test.com', 'leader2@test.com', 'member@test.com'] } });
            await Tournament.deleteMany({ title: 'Test Restriction Tournament' });
            await mongoose.disconnect();
        }
    }
};

checkRestriction();
