const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');
const dotenv = require('dotenv');

dotenv.config();

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI || 'mongodb://localhost:27017/growathlete');
        console.log('Connected to MongoDB');

        const tournaments = await Tournament.find({});

        tournaments.forEach(t => {
            console.log(`Tournament: ${t.title} (${t._id})`);
            if (t.registrations && t.registrations.length > 0) {
                console.log(`  Registrations (${t.registrations.length}):`);
                t.registrations.forEach((r, i) => {
                    console.log(`    [${i}] TeamName: '${r.teamName}', Size: ${r.teamSize}, Members: ${r.members ? r.members.length : 0}`);
                });
            } else {
                console.log('  No registrations.');
            }
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

inspect();
