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