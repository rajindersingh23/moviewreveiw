const cors = require('cors');
const express = require('express');
const config = require("config");
const users = require("./routes/user");
const admin = require("./routes/admin");
const movies = require("./routes/movies");
const reviews = require("./routes/review");
const auth = require("./routes/authenticate")
const app = express();

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined ");
    process.exit(1);
  }

  app.use(express.json());
app.use(cors());

app.use("/api/user", users)
app.use("/api/admin", admin)
app.use("/api/movies", movies)
app.use("/api/review", reviews)
app.use("/api/auth", auth)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));