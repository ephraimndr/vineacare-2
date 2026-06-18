import express = require("express");
import * as path from "path";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();

// LiveReload setup for local development emulator
if (process.env.FUNCTIONS_EMULATOR === "true") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const connectLiveReload = require("connect-livereload");
    app.use(connectLiveReload());
    console.log("LiveReload middleware registered.");
  } catch (err) {
    console.error("Failed to initialize LiveReload middleware:", err);
  }
}

app.use(express.json());

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/index.html", (req, res) => {
  res.redirect("/");
});

export default app;
