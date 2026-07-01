Backend Application Setup using Express.js

1. Install Node.js and npm (Node Package Manager) if you haven't already. You can download them from the official Node.js website: https://nodejs.org/
2. Check if Node.js and npm are installed correctly by running the following commands in your terminal:
   ```
   node -v
   npm -v
   ```
3. Create a new folder for your backend application and open it in VS Code.
4. Initialize a new Node.js project by running the following command in your terminal:
   ```
   npm init -y
   ```

or 

    ```
    npm init
    ```
    This will create a `package.json` file in your project folder.


    note: you use `npm init -y` to automatically generate a `package.json` file with default settings, while `npm init` allows you to customize the settings interactively.
5. Install Express.js by running the following command in your terminal:
   ```
   npm install express
   ```
6. Create a new file named `server.js` in your project folder. This file will be the entry point of your backend application.
7. Open `server.js` and add the following code to set up a basic Express server:

    ```javascript
    const express = require('express');
    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
    ```
8. Save the `server.js` file.
9. Start the server by running the following command in your terminal:
    ```
    node server.js
    ```
10. Open your web browser and navigate to `http://localhost:3000`. You should see the message "Hello, World!" displayed in your browser.

under scripts in package.json:

"dev": "nodemon server.js"