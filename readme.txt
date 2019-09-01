Requirements to run:
-Node.js
-Browser

To install:
1- cd to Root directory of project
2- Run command: npm install

To run:
1- cd to root directory of project
2- Run command: npm start
   -Should see message saying server was started with link to page
3- In a browser navigate to http://127.0.0.1:3000/geoLocation/ranking
   -Should see the response with the top 5

To stop:
1- in terminal where running just Ctrl+c
2- if prompted enter y to 'Terminate batch job'

To run tests:
1- cd to root directory of project
2- Run command: npm test

ASSUMPTIONS
- Would want to provide not just key of top 5, but also the data along with that
- Want to grab the data from the URL that you guys provided and not just from local file
- Just sorted on the GeoLocation object count, did not attempt to apply secondary sorts when counts were equal

Design Description
Created basic Server named server.js as entry point using 127.0.0.1:3000 as address. Then used dispatcher to respond
to path /geoLocation/ranking. Server in turn will call out to GeoLocationCounter in geoLocationRanker.js providing a
callback since there is an asynchronous request being made to get the data from the passed URL, which contains the code
that makes the request to 'https://app.wordstream.com/services/v1/wordstream/interview_data' and
the logic to parse it into the GeoLocation data desired.

The GeoLocationCounter, then loops through the parsed GeoLocation objects, and uses a UniqueItemCountRanker from
mapSorting.js to count the number of occurrences of the key values or uses the object itself if there is no key
property ({"countries": ["US"]} countries only contain strings).

The UniqueItemCountRanker then provides a method getKeysOrderedByCount, which will takes a count of items to return,
and the desired SortComparator from mapSorting.js in order to get the ordered keys of the top counted. The
getKeysOrderedByCount then uses MapSorter.getSortedKeysFromMap from mapSorting.js, in order to sort the passed
javascript Map object and returning an array of keys in the order the also passed comparator specifies.

SortComparator are required to define a compare method which is used as a normal comparator v1 < v2 is negative, v1 > v2 is positive, and v1 = v2 is 0, allows
for Ascending and Descending sorting as well as definition of object specific comparators or more complex ones.

The MapSorter method getSortedKeysFromMap, provides a basic algorithm that loops through passed Map entries and builds
a list which it currently uses a binarySearch on the list to find the proper insertion point for the entry. Swapping
search algorithms should be simple just write another method to get insertion index that uses comparator and replace
call to binarySearchInsertionIndex with it.

Finally, once desired ordered list of keys is provided back to GeoLocationCounter method then it creates Array of
GeoLocation objects linked to the keys in the same order, along with the count and GeoLocation type values. The callback
passed from server.js call is then used to generate the desired JSON response containing the GeoLocation objects.