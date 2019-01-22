# Setup
1. Install dependencies
 - MongoDB
 - Node
 - NPM

2. Install NPM dependencies
    ```
    npm install
    ```

3. Make sure you have a MongoDB folder at _project\_dir/data/db/_.
4. Start MongoDB process.
    ```
    npm run db-up
    ```

5. Start Express server.
    ```
    npm start
    ```

# Shutdown
1. Shutdown the MongoDB daemon process.
    ```
    npm run db-down
    ```