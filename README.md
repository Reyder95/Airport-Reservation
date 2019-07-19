# Airport-Reservation API

## Overview
This is an API for use with an Airport Reservation Website (will be on this github account when I get around to building the front end). There are only a few endpoints necessary currently, but as more functionality comes I may update the API with more endpoints.

## Endpoints and Parameters

### /get_flights
Retrieves flights, along with destination and origin airports, company, seat information and if a seat is associated with an account. Note: All times are to be in proper JavaScript Timestamp Notation (2019-10-30T17:10:00.000Z) [Preferably UTC time]
* Depart Time Bounds
  * dtime_l - Depart Time Lower Range (nothing lower than this time)
  * dtime_u - Depart Time Upper Range (nothing greater than this time)
* Arrival Time Bounds
  * atime_l - Arrival Time Lower Range (nothing lower than this time)
  * atime_u - Arrival Time Upper Range (nothing greater than this time)
* Board Time Bounds
  * btime_l - Board Time Lower Range (nothing lower than this time)
  * btime_u - Board Time Upper Range (nothing greater than this time)
* Depart Gate
  * dgate - Gate that flight is departing from
* Arrival Gate
  * agate - Gate that the flight is arriving to
* Origin Airport
  * oairport - Airport CODE that the flight starts at. (EWR for Newark Internation Airport is an airport code, for example)
* Destination Airport
  * dairport - Airport CODE that the flight ends at. (EWR for Newark International Airport is an airport code, for example)
* Company
  * company - Company CODE that the flight is run by (UA for United Airlines is a company code, for example)

### /get_users
Retrieves users and the various information on each user.
* Identification
  * id - Use a user's ID to obtain their information
* Username
  * username - Get a user based on a specific username
* Email
  * email - Get a user based on a specific email
* First Name
  * first_name - Get a user based on a specific first name.
* Last Name
  * last_name - Get a user based on a specific last name
