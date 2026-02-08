const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tournament = require('./models/Tournament');

const path = require('path');
require("dotenv").config();
console.log('Loaded env keys:', Object.keys(process.env));

const tournaments = [
    {
        title: "Regional Tennis Championship",
        sport: "Tennis",
        location: "New York, USA",
        startDate: new Date("2024-10-15"),
        endDate: new Date("2024-10-20"),
        status: "Upcoming",
        entryFee: 50,
        prizePool: "$5000",
        maxTeams: 32,
        description: "The biggest regional tennis showdown of the year.",
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Summer Basketball League",
        sport: "Basketball",
        location: "Los Angeles, CA",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2024-08-30"),
        status: "Upcoming",
        entryFee: 100,
        prizePool: "$10000",
        maxTeams: 16,
        description: "Professional summer league for aspiring basketball players.",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop"
    },
    {
        title: "City Soccer Cup",
        sport: "Soccer",
        location: "London, UK",
        startDate: new Date("2024-09-10"),
        endDate: new Date("2024-09-15"),
        status: "Open",
        entryFee: 200,
        prizePool: "Trophies & Medals",
        maxTeams: 20,
        description: "Amateur soccer tournament open to all city clubs.",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop"
    }
];

const seedDB = async () => {
    try {
        const uri = process.env.MONGOURI;
        if (!uri) throw new Error("MONGOURI is missing from .env");
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Optional: Clear existing seeded data if needed, or just append
        // await Tournament.deleteMany({});

        for (const t of tournaments) {
            // Check if exists to avoid duplicates on multiple runs
            const exists = await Tournament.findOne({ title: t.title });
            if (!exists) {
                // Determine dateRange string
                const range = `${t.startDate.toLocaleDateString()} - ${t.endDate.toLocaleDateString()}`;
                await Tournament.create({ ...t, dateRange: range });
                console.log(`Added: ${t.title}`);
            } else {
                console.log(`Skipped (exists): ${t.title}`);
            }
        }

        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
