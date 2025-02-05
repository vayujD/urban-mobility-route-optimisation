import express from 'express';
import { connectDb } from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import Route from './models/route.js';
import User from './models/user.js';
import ScriptOutput from './models/scriptOutput.js';
import { exec } from 'child_process' ;
import util from 'util';

dotenv.config();




const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

// API route to fetch a username
app.get('/api/username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.query.username });
        if (user) {
            res.json({ username: user.username });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// API route to fetch all routes
app.get('/api/routes', async (req, res) => {
    try {
        const routes = await Route.find();
        res.json(routes);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ message: 'Error fetching routes' });
    }
});

// API route to save username to the database
app.post('/api/set-username', async (req, res) => {
    const { username } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.json({ message: 'Username already exists, using existing username' });
        }

        const user = new User({ username });
        await user.save();
        res.json({ message: 'Username set successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving username' });
    }
});

// API route to save a route
app.post('/api/routes', async (req, res) => {
    try {
        const { username, departureTime, source, destination, stopPoints, sourceCoords, destCoords, points } = req.body;
        // console.log('Received route data:', req.body);
        // console.log('destCoords:', destCoords);
        const route = new Route({ username, departureTime, source, destination, stopPoints, sourceCoords, destCoords, points });
        console.log('Route:', route);
        await route.save();


        try {               

            const scriptResponse = await callPythonScript(route.toObject());
            
            if(scriptResponse) {
                // console.log('Script response:', scriptResponse);
                const scriptOutput = new ScriptOutput({ routeId: route._id, outputData: scriptResponse });
                await scriptOutput.save();
                res.status(201).send('Route saved successfully');
            } else {
                throw new Error ('Python script returned no output');
            }

        } catch (scriptError) {
            console.error('Error calling python script:', scriptError);
            res.status(500).send('Error processing python script');
        }

    } catch (error) {
        console.error('Error saving route:', error);
        res.status(400).send(error.message);
    }
});


//to call Python Scipt
async function callPythonScript(route) {
    const execPromise = util.promisify(exec);
    try {
        const routeJsonString = JSON.stringify(route);
        console.log('RouteJSOnStringOutput: ', routeJsonString);

        const { stdout, stderr } = await execPromise(`python3 ./scripts.py '${routeJsonString}'`);
        if (stderr) {
            throw new Error(stderr);
        }

        console.log('Python script stdout:', stdout)
        return JSON.parse(stdout);
    } catch (error) {
        console.error('Error calling python script:', error);
        throw error;
    }
}   

// api route to fetch script output
app.get('/api/script-output/:routeId', async (req, res) => {
    try {
        const scriptOutput = await ScriptOutput.findOne({ routeId: req.params.routeId });
        if (!scriptOutput) {
            return res.status(404).json({ message: 'Script output not found' });
        }
        res.json(scriptOutput);
    } catch (error) {
        console.log('Error fetching script output:', error);
        res.status(500).json({ message: 'Error fetching script output' });
    }
});