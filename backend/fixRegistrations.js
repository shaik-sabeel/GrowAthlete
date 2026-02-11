const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');
const dotenv = require('dotenv');

dotenv.config();

const fixRegistrations = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI || 'mongodb://localhost:27017/growathlete');
        console.log('Connected to MongoDB');

        const result = await Tournament.updateMany(
            {},
            { $set: { registrations: [], registeredTeams: 0 } }
        );

        console.log(`Cleared registrations for ${result.modifiedCount} tournaments.`);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixRegistrations();
