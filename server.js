import express from 'express';
import { connectDb } from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import Route from './models/route.js';
import User from './models/user.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
        const user = new User({ username });
        await user.save();
        res.json({ message: 'Username set successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving username' });
    }
});

// API route to save a route
app.post('/routes', async (req, res) => {
    try {
        const { username, departureTime, coordinates } = req.body;
        const route = new Route({ username, departureTime, coordinates });
        await route.save();
        res.status(201).send('Route saved successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});