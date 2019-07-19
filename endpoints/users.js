/*
	A file for use with the API. Focuses primarily on User based endpoints.
*/

import functions from '../helper-files/functions.js';
import { Pool } from 'pg';	// Include the pg module for database integration.
import linqjs from 'linqjs';
import myConnection from '../helper-files/connection.json';
const pool = new Pool(myConnection);	// Set up the postgres pool with specific connection parameters

// Get Users from database and basic information.
const getUsers = (req, res) => {
    
    // Handle pages and entries
    let page = parseInt(req.query.p);      // Page variable (what we're on)
    let entries = parseInt(req.query.e);   // Entries variable (how many entries on each page)
    
    // If page or entries are empty, make them have defaults
    
    if (!entries) {
        entries = 25;
    }
    
    if (!page) {
        page = 1;
    }
    
    // Various getUsers variables to obtain from query string
    let id = req.query.id;                  // User ID 
    let username = req.query.username;      // User Name
    let email = req.query.email;            // Email
    let firstName = req.query.firstname;    // User First Name
    let lastName = req.query.lastname;      // User Last Name
    
    let query = "SELECT * FROM users"
    
    pool.query(query, (error, results) => {
        let filteredResults = results.rows; // Take the JSON response and put it inside of 'filteredResults'
        
        // If id exists, search for the specific ID
        if (id) {
            filteredResults = filteredResults.where(item => item.id == id);
        }
        
        // If username exists, search for the specific username
        if (username) {
            filteredResults = filteredResults.where(item => item.username == username);
        }
        
        // If Email exists, search for the specific email
        if (email) {
            filteredResults = filteredResults.where(item => item.email == email);
        }
        
        // If firstName exists, search for the specific first name
        if (firstName) {
            filteredResults = filteredResults.where(item => item.first_name);
        }
        
        // If lastName exists, search for the specific last name
        if (lastName) {
            filteredResults = filteredResults.where(item => item.last_name)
        }
        
        // Filter results by page and entry number by slicing the JSON array
        filteredResults = filteredResults.slice((page-1)*entries , ((page-1)*entries) + entries);
        
        functions.genericGetResponse(error, filteredResults, res);  // Call a get response and return the official JSON
    });
}

const userFunctions = {
    getUsers
}

export default userFunctions;