Team 3
======


<img src="https://github.com/UWO-ECE-Software-Engineering/Team-3/blob/master/Team3.png" width="200">

CEAMS – Canadian Engineering Accreditation Management System
------------------------------------------------------------
> **Goal:**
>
> Build a software system that facilitate the management, measurement, and visualization of the outcomes-based assessment and continuous program improvement for the Canadian Engineering Universities.


#### <i class="icon-users"></i> Team

| Name| Email|
| :------- | :---: |
|Chin, Jason|jchin55@uwo.ca
|Fincher, William|wfincher@uwo.ca|
|Hay, Jonathan|jhay22@uwo.ca|
|Hutnik, Evan|ehutnik@uwo.ca|
|Prouse, Jacob|jprouse2@uwo.ca|
|Wei, Song|swei57@uwo.ca|

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