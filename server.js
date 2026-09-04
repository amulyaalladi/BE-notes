const app = require("./app");
const { MONGODB_URI, PORT } = require("./utils/config");
const mongoose = require("mongoose");

// On Render (and most cloud platforms) the server must bind to 0.0.0.0
// so it's reachable from outside the container. localhost/127.0.0.1 only
// listens on the loopback interface and causes health checks to fail.
const HOST = "0.0.0.0";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, HOST, (error) => {
      if (error) {
        console.log("Error starting the server:", error.message);
        return;
      }
      console.log(`Server is running at http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });