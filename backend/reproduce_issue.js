const mongoose = require('mongoose');
const User = require('./models/User');
const Tournament = require('./models/Tournament');
require('dotenv').config();

const mongoUri = process.env.MONGOURI || process.env.MONGODB_URI;

const reproduce = async () => {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

        // cleanup previous run
        await User.deleteMany({ email: { $in: ['leader@test.com', 'member@test.com'] } });
        await Tournament.deleteMany({ title: 'Test Team Visibility Tournament' });

        // Create Leader
        const leader = await User.create({
            username: 'LeaderUser',
            email: 'leader@test.com',
            password: 'Password@123', // In real app valid hash needed, but for direct model access it's fine 
            role: 'athlete'
        });

        // Create Member
        const member = await User.create({
            username: 'MemberUser',
            email: 'member@test.com',
            password: 'Password@123',
            role: 'athlete'
        });

        // Create Tournament
        const tournament = await Tournament.create({
            title: 'Test Team Visibility Tournament',
            sport: 'Soccer',
            location: 'Test Location',
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000),
            organizer: leader._id
        });

        // Leader registers team
        // Simulate registration logic from controller
        const registration = {
            user: leader._id,
            teamName: 'The Testers',
            phoneNumber: '1234567890',
            email: 'leader@test.com',
            age: 25,
            gender: 'Male',
            status: 'Approved',
            registrationDate: Date.now(),
            teamSize: 5,
            members: [leader._id, member._id] // Add member directly
        };

        tournament.registrations.push(registration);
        tournament.registeredTeams = 1;
        await tournament.save();

        console.log('Tournament created and team registered with member.');

        // Simulate getUserRegistrations for MEMBER
        // Copy logic from modified controller
        const memberTournaments = await Tournament.find({
            $or: [
                { 'registrations.user': member._id },
                { 'registrations.members': member._id }
            ]
        })
            .populate('registrations.user', 'name email username')
            .populate('registrations.members', 'name email username');

        console.log(`Found ${memberTournaments.length} tournaments for member.`);

        if (memberTournaments.length === 0) {
            console.error('FAIL: Member cannot see the tournament.');
            process.exit(1);
        }

        const t = memberTournaments[0];
        const reg = t.registrations.find(r =>
            r.user._id.toString() === member._id.toString() ||
            r.members.some(m => m._id.toString() === member._id.toString())
        );

        if (!reg) {
            console.error('FAIL: Could not find registration in tournament for member.');
            process.exit(1);
        }

        console.log('Registration members:', reg.members.map(m => m.username));

        if (reg.members.length !== 2) {
            console.error(`FAIL: Expected 2 members, found ${reg.members.length}`);
            process.exit(1);
        }

        if (!reg.members.find(m => m.email === 'member@test.com')) {
            console.error('FAIL: Member details not populated correctly.');
            process.exit(1);
        }

        console.log('SUCCESS: Member can see tournament and member list is populated.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        // cleanup
        if (mongoose.connection.readyState === 1) {
            await User.deleteMany({ email: { $in: ['leader@test.com', 'member@test.com'] } });
            await Tournament.deleteMany({ title: 'Test Team Visibility Tournament' });
            await mongoose.disconnect();
        }
    }
};

reproduce();
