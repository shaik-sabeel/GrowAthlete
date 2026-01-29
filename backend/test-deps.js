
console.log("Testing dependencies...");
try {
    console.log("Requiring express...");
    require("express");
    console.log("Requiring cors...");
    require("cors");
    console.log("Requiring cookie-parser...");
    require("cookie-parser");
    console.log("Requiring mongoose...");
    require("mongoose");
    console.log("Requiring helmet...");
    require("helmet");
    console.log("Requiring express-rate-limit...");
    require("express-rate-limit");
    console.log("Requiring dotenv...");
    require("dotenv").config();
    console.log("All dependencies loaded!");
} catch (e) {
    console.error("CRASHED:", e);
}
