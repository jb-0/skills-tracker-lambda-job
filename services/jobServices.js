const https = require('https');
const { permittedKeywords } = require('./data/permittedKeywords');
const { permittedLocations } = require('./data/permittedLocations');

/**
 * Build query string, sanitise as needed and encode
 * @param {Object} query Only keywords, locationName and distanceFromLocation are used.
 * @return {Object} Returns a Encoded and sanitised query string, and also an object version.
 */
const prepareQuery = (query) => {
  const q = query;

  // Validate that the distance provided is a valid integer, otherwise default to 10
  const distanceFromLocationAsFloat = parseFloat(q.distanceFromLocation, 10);

  if (Number.isNaN(distanceFromLocationAsFloat)) {
    q.distanceFromLocation = 10;
  } else {
    const distanceFromLocationAsInt = Math.round(distanceFromLocationAsFloat);
    q.distanceFromLocation = Math.trunc(distanceFromLocationAsInt);
  }

  // Validate keywords exist in pre-defined list, drop those that do not.
  // These are sorted to allow matching to duplicate saved searches
  const keywordsArray = q.keywords.split(' ');
  keywordsArray.sort();
  q.keywords = '';

  keywordsArray.forEach((keyword) => {
    if (permittedKeywords.includes(keyword.toLowerCase())) {
      q.keywords += `${keyword} `;
    }
  });

  q.keywords = q.keywords.trim();

  // Validate location exists in pre-defined list, if not default to london
  if (!permittedLocations.includes(q.locationName.toLowerCase())) q.locationName = 'london';

  // Encoded query
  const encodedQuery = `keywords=${q.keywords}&locationName=${
    q.locationName}&distanceFromLocation=${q.distanceFromLocation}`;

  return { encodedQuery: encodeURI(encodedQuery), cleanQueryObject: q };
};

/**
 * Search reed using the jobseeker API (https://www.reed.co.uk/developers/jobseeker)
 * @param {Object} query Only keywords, locationName and distanceFromLocation are used.
 * @return {Object} First page of query results from reed API
 */
const searchReed = (query) => {
  // Define options for the upcoming https request, per reed's API documentation Basic Auth is used
  // and the issued key is provided as the username, password is left blank.
  const options = {
    hostname: 'www.reed.co.uk',
    path: `/api/1.0/search?${prepareQuery(query).encodedQuery}`,
    port: 443,
    method: 'GET',
    headers: {
      Authorization: `Basic ${process.env.REED_B64}`,
    },
  };

  // Returning a promise, this means await can be used to await all data to be returned prior to
  // providing an api response
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let results = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        results += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(results));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
};

module.exports = {
  searchReed,
  prepareQuery,
};
