const https = require('https');

const sortUtils = require("./mapSorting.js");

/**
 * Given a URL and optional number of items(defaults to all) will provide the top specified number of GeoLocations
 * sorted by highest occurrence counts from the response provided from the URL.
 */
var GeoLocationCounter = (function() {
    // JSON keys to ignore or that are used to navigate response from URL
    var JSON_DATA_KEY = "data";
    var JSON_TARGETING_KEY = "targeting";
    var JSON_GEO_LOCATIONS_KEY = "geo_locations";
    var GEO_LOCATIONS_KEYS_TO_IGNORE = ["location_types"];
    var JSON_GEO_LOCATION_KEY_KEY = "key";
    /*
     * Navigate JSON structure to find GeoLocation objects, generates output JSON structure for response, and
     * uses UniqueItemCountRanker to count and return the desired number of highest occurring GeoLocation Objects.
     */
    let getOrderedListOfGeoLocation = function getOrderedListOfGeoLocation(geoLocationListJson, returnCount, comparator) {
        let root = JSON.parse(geoLocationListJson);
        let objects = root[JSON_DATA_KEY];
        let geoLocationCounter = new sortUtils.UniqueItemCountRanker();
        let geoLocationItemByKey = new Map();
        for(let i = 0; i < objects.length; i++) {
            let targeting = objects[i][JSON_TARGETING_KEY];
            if(!targeting) { continue; }

            let geoLocationsRoot = targeting[JSON_GEO_LOCATIONS_KEY];
            for (let key in geoLocationsRoot) {
                // check if the property/key is defined in the object itself, not in parent
                if (geoLocationsRoot.hasOwnProperty(key) && -1 == GEO_LOCATIONS_KEYS_TO_IGNORE.indexOf(key)) {
                    let geoLocationTypeList = geoLocationsRoot[key];
                    for(let j = 0; j < geoLocationTypeList.length; j++) {
                        let geoLocationProperties = geoLocationTypeList[j];
                        let geoLocationKey = geoLocationProperties[JSON_GEO_LOCATION_KEY_KEY];
                        if(!geoLocationKey) { geoLocationKey = geoLocationProperties; }
                        let geoLocationItem = geoLocationItemByKey[geoLocationKey];
                        if(!geoLocationItem) {
                            geoLocationItem = {};
                            geoLocationItem.properties = geoLocationProperties;
                            geoLocationItem.type = key;
                            geoLocationItemByKey[geoLocationKey] = geoLocationItem;
                        }
                        geoLocationItem.count = geoLocationCounter.count(geoLocationKey);
                    }
                }
            }
        }
        let orderedKeys = geoLocationCounter.getKeysOrderedByCount(returnCount, comparator);
        let geoLocationItems = [];
        for(let i = 0; i < orderedKeys.length; i++) {
            geoLocationItems.push(geoLocationItemByKey[orderedKeys[i]]);
        }
        return geoLocationItems;
    };

    return {
        getTopGeoLocation: function(url, callback, number) {
            var data; // response data
            var request = https.request(
                url,
                (res) => { // builds up response
                    data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        if(callback) {
                            callback(getOrderedListOfGeoLocation(data, number, sortUtils.SortComparators.Descending));
                        }
                    });
                }
            );
            request.on("error", (error) => {
                console.log("Error: " + error.message)
            });
            request.end();
        },
        getOrderedListOfGeoLocation: getOrderedListOfGeoLocation
    };
})();

module.exports = {
    GeoLocationCounter: GeoLocationCounter
};