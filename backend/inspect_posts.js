const mongoose = require("mongoose");
const CommunityPost = require("./models/CommunityPost");

console.log("Connecting to MongoDB...");

mongoose
    .connect("mongodb://127.0.0.1:27017/growAthleteDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
    })
    .then(async () => {
        console.log("✅ MongoDB connection successful!");

        try {
            const posts = await CommunityPost.find({ "media.0": { $exists: true } }).select("media content author createdAt").sort({ createdAt: -1 }).limit(10);

            console.log(`Found ${posts.length} posts with media:`);
            posts.forEach(post => {
                console.log(`\nPost ID: ${post._id}`);
                console.log(`Content: ${post.content.substring(0, 50)}...`);
                console.log("Media:", JSON.stringify(post.media, null, 2));
            });

        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            mongoose.connection.close();
            process.exit(0);
        }
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });
