//opimise turbo build step in lecture 1 step 8 ==>  watch it from cohort 3 turborepo lecture
//make a common folder that contains our owned defined types and zodschemas for things like signup and also contains JWT_secret
//env files should be created in the root or for specific applications
//understand how u can do the user validation in the ws-server in the first http request before it modifies into a websocket connection
//make sure to send the auth token from the client for the socket io server
//add the connect_error event in the client if the socket io middleware throws error 
// correct status codes in the http endpoints
// we should probably check for unique username in the signup route
// after signing up the user should be redirected to the signin route to create cookie session
// check the http file for remaining todos
// .env.example
// dont we have to create a dist folder for db package ?
// jwt secret import from env file not working 
// how is cors working with postman even if i have domain set to the url of the nextjs app?