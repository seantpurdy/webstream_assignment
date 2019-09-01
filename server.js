/* Basic Server entry point */
const HttpDispatcher = require('./node_modules/httpdispatcher');
const http = require('http');
const dispatcher = new HttpDispatcher();

const hostname = '127.0.0.1';
const port = 3000;

var GeoLocationRanker = require('./src/geoLocationRanker.js');

const server = http.createServer((request, response) => {
    try {
         console.log("dispatching request: " + request.url);
         dispatcher.dispatch(request, response);
     } catch(err) {
         console.log("ERROR: " + err);
     }
});

dispatcher.onGet("/geoLocation/ranking", function(request, response) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    GeoLocationRanker.GeoLocationCounter.getTopGeoLocation(
        'https://app.wordstream.com/services/v1/wordstream/interview_data',
         function(topGeoLocations) { // callback function for when response is received
             let output = JSON.stringify({
                topGeoLocations: topGeoLocations
             });
             console.log("===> SENDING::\n" + output);
             response.end(output);
         },
         5
     );
});

dispatcher.onError(function(request, response) {
    response.writeHead(404);
    response.end("Error, the URL doesn't exist");
});

server.listen(port, hostname, () => {
    console.log(`Server running, navigate to http://${hostname}:${port}/geoLocation/ranking`);
});