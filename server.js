const app = require("./app");
const { MONGODB_URI, PORT, HOST } = require("./utils/config");
const mongoose = require("mongoose");


mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT,HOST, (error) => {
    if (error) {
        console.log('Error starting the server:', error.message);
        return; // exits the function immediately if there is an error
    }

    console.log(`Server is running at http://${HOST}:${PORT}`);
});

})



.catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
});


