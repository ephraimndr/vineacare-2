import express = require("express");
import cookieParser = require("cookie-parser");
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


app.use(cookieParser());
app.use(express.json());

// View engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// Middleware to verify session and inject uid
app.use(async (req, res, next) => {
  const sessionCookie = req.cookies.__session || "";
  let uid: string | null = null;

  if (sessionCookie) {
    try {
      const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, false);
      uid = decodedClaims.uid;
    } catch (error) {
      console.error("Error verifying session cookie:", error);
    }
  }

  // Inject uid into locals so it's available in all EJS templates
  res.locals.uid = uid;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/index.html", (req, res) => {
  res.redirect("/");
});



// Endpoint to establish session cookie
app.post("/api/sessionLogin", async (req, res) => {
  const idToken = req.body.idToken;
  if (!idToken) {
    res.status(400).send("No ID Token provided");
    return;
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
    const options = { maxAge: expiresIn, httpOnly: true, secure: !isEmulator, path: "/" };
    
    // Ensure user document exists in Firestore
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
    
    if (!userSnapshot.exists) {
      const email = decodedToken.email || "";
      const username = email ? email.split('@')[0] : "unknown";
      await admin.firestore().collection('users').doc(uid).set({
        name: decodedToken.name || "User",
        email: email,
        username: username,
        profile_pic: decodedToken.picture || "",
        sentFriendRequests: [],
        recievedFriendRequests: [],
        myFriends: [],
        myPosts: [],
        myChats: [],
        myGroups: [],
        myEvents: [],
        myJobs: [],
        myApplications: [],
        myBookmarks: [],
        myFeeds: [],
        myLikes: [],
        myComments: [],
        myShares: [],
        lastSeen: null,
        isOnline: true,
        isVerified: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.cookie("__session", sessionCookie, options);
    res.json({ status: "success" });
  } catch (error) {
    console.error("Session login error:", error);
    res.status(401).send("UNAUTHORIZED REQUEST!");
  }
});

app.post("/api/sessionLogout", (req, res) => {
  res.clearCookie("__session", { path: "/" });
  res.json({ status: "success" });
});

export default app;
