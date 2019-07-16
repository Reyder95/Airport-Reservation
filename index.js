import express from 'express';	// Includes express module
import cors from 'cors';	// Includes cors module

const app = express();	// Loads express into the app object
const port = 1337;	// The port that the server runs on

import flights from './endpoints/flights.js';

app.use(cors());	// Activates cors (to avoid any stupid cors errors)

app.get('/', (req, res) => {
	res.json({
		info: "Airport Reservation API developed using PostgreSQL, and NodeJS. Front end website developed in ReactJS"	
	});
});

app.get('/get_flights', flights.getFlights);

app.listen(port, () => {
	console.log(`App running on port ${ port }.`);
});