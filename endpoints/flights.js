/*
	A file for use with the API. Focuses primarily on Flight based endpoints.
*/

import functions from '../helper-files/functions.js';
import { Pool } from 'pg'	// Include the pg module for database integration.
import linqjs from 'linqjs';
import myConnection from '../helper-files/connection.json';
const pool = new Pool(myConnection);	// Set up the postgres pool with specific connection parameters

// Gets flights from database. Paginates them and searches through them based on specific parameters.
const getFlights = (req, res) => {
    
    // Handle pages and entries
	let page = parseInt(req.query.p);      // Page variable (what page we're on)
	let entries = parseInt(req.query.e);   // Entries variable (how many entries on each page)
    
    // If page or entries are empty, make them have defaults
	if (!entries) {
		entries = 25;
	}

	if (!page) {
		page = 1;
	}
    
    // Various getFlights variables to obtain from query string
    let dTimeLower = new Date(req.query.dtime_l);   // Lower bound Departure Time (nothing lower than this)
    let dTimeUpper = new Date(req.query.dtime_u);   // Upper bound Departure Time (nothing higher than this)
    let bTimeLower = new Date(req.query.btime_l);   // Lower bound Boarding Time (nothing lower than this)
    let bTimeUpper = new Date(req.query.btime_u);   // Upper bound Boarding Time (nothing higher than this)
    let aTimeLower = new Date(req.query.atime_l);   // Lower bound Arrival Time (nothing lower than this)
    let aTimeUpper = new Date(req.query.atime_u);   // Upper bound Arrival Time (nothing higher than this)
    let dGate = req.query.dgate;                    // Departure gate
    let aGate = req.query.agate;                    // Arrival gate
    let oAirport = req.query.oairport;              // Origin airport (airport plane leaves from | is an airport code)
    let dAirport = req.query.dairport;              // Destination airport (airport plane arrives to | is an airport code)
    let company = req.query.company;                // Company code for company handling the flight

    // Query: Get all flights and integrate json within various fields for easy viewability
    /*let query = 'SELECT ' + 
	               'f.board_time, ' +
	               'f.depart_time, ' +
	               'f.arrival_time, ' +
                   'f.arrival_gate, ' +
                   'f.depart_gate, ' +
	               'json_agg(seats.* ORDER BY seats.id) AS seats, ' +
	               'json_agg(DISTINCT origin.*) AS origin, ' +
	               'json_agg(DISTINCT destination.*) AS destination, ' +
	               'json_agg(DISTINCT company.*) AS company ' +
                'FROM ' +
	               'flights AS f ' +
	               'INNER JOIN seats ON seats.flightid_fk = f.id ' +
	               'INNER JOIN airportinformation origin ON origin.id = f.origin_fk ' +
	               'INNER JOIN airportinformation destination ON destination.id = f.destination_fk ' +
	               'INNER JOIN companyinformation company ON company.id = f.company_fk ' +
                'GROUP BY ' +
	               'f.id ' +
                'ORDER BY ' +
	               'f.depart_time ASC';*/
    
    let query = "SELECT f.id, f.board_time, f.depart_time, f.arrival_time, f.depart_gate, f.arrival_gate, origin_airport, destination_airport, company, " +
                "seats FROM flights f INNER JOIN ( SELECT flightid_fk, json_agg( json_build_object( 'id', s.id, 'seat_row', s.seat_row, 'seat_column', s.seat_column, " +
                "'guest_first_name', s.guest_first_name, 'guest_last_name', s.guest_last_name, 'user', user_info )  ) seats FROM seats s LEFT JOIN ( SELECT id, json_build_object( " +
                "'username', u.username, 'email', u.email, 'first_name', u.first_name, 'middle_initial', u.middle_initial, 'last_name', u.last_name ) user_info FROM users u " +
                "GROUP BY id ) u on s.non_guest_account_fk = u.id GROUP BY s.flightid_fk ) s on f.id = s.flightid_fk INNER JOIN ( SELECT id, json_build_object( " +
                "'company_name', c.company_name, 'code', c.short_version ) company FROM companyinformation c GROUP BY id ) c ON c.id = f.company_fk INNER JOIN ( " +
                "SELECT id, json_build_object( 'airport_title', origin.airport_title, 'airport_code', origin.airport_code, 'location', origin.location ) origin_airport " +
                "FROM airportinformation origin GROUP BY id ) origin ON origin.id = f.origin_fk INNER JOIN ( SELECT id, json_build_object( 'airport_title', destination.airport_title," +
                "'airport_code', destination.airport_code, 'location', destination.location ) destination_airport FROM airportinformation destination GROUP BY id ) " +
                "destination ON destination.id = f.destination_fk ORDER BY f.id"

    // Call the query
	pool.query(query, (error, results) => {
        
        let filteredResults = results.rows; // Take the JSON response and put it inside of 'filteredResults'
        
        // If dTimeLower is a valid date, filter results for greater Departure Times
        if (functions.isValidDate(dTimeLower)) {
            filteredResults = filteredResults.where(item => item.depart_time >= dTimeLower);
        }
        
        // If dTimeUpper is a valid date, filter results for lesser Departure Times
        if (functions.isValidDate(dTimeUpper)) {
            filteredResults = filteredResults.where(item => item.depart_time <= dTimeUpper);
        }
        
        // If bTimeLower is a valid date, filter results for greater Boarding Times
        if (functions.isValidDate(bTimeLower)) {
            filteredResults = filteredResults.where(item => item.board_time >= bTimeLower);
        }
        
        // If bTimeUpper is a valid date, filter results for lesser Boarding Times
        if (functions.isValidDate(bTimeUpper)) {
            filteredResults = filteredResults.where(item => item.board_time <= bTimeUpper);
        }
        
        // If aTimeLower is a valid date, filter results for greater Arrival Times
        if (functions.isValidDate(aTimeLower)) {
            filteredResults = filteredResults.where(item => item.arrival_time >= aTimeLower);
        }
        
        // If aTimeUpper is a valid date, filter results for lesser Arrival Times
        if (functions.isValidDate(aTimeUpper)) {
            filteredResults = filteredResults.where(item => item.arrival_time <= aTimeUpper);
        }
        
        // If dGate is not null, filter by Departure Gate
        if (dGate) {
            filteredResults = filteredResults.where(item => item.depart_gate == dGate);
        }
        
        // If aGate is not null, filter by Arrival Gate
        if (aGate) {
            filteredResults = filteredResults.where(item => item.arrival_gate == aGate);
        }
        
        // If oAirport is not null, filter by Origin Airport
        if (oAirport) {
            filteredResults = filteredResults.where(item => item.origin[0].airport_code == oAirport);
        }
        
        // If dAirport is not null, filter by Destination Airport
        if (dAirport) {
            filteredResults = filteredResults.where(item => item.destination[0].airport_code == dAirport);
        }

        // If company is not null, filter by Company
        if (company) {
            filteredResults = filteredResults.where(item => item.company[0].short_version == company);
        }
        
		// Filter results by page and entry number by slicing the JSON array
		filteredResults = filteredResults.slice((page-1)*entries , ((page-1)*entries) + entries);

		functions.genericGetResponse(error, filteredResults, res);    // Call a get response and return the official JSON
	});
}

// Export all functions related to flights
const flightFunctions = {
    getFlights
}

export default flightFunctions;
