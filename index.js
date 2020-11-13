// Require packages
require('dotenv').config();
const mongoose = require('mongoose');

// Require DB model
const { Search } = require('./models/searchModel');

// Require services functions
const { searchReed } = require('./services/jobServices');

async function main(event) {
  /* ***************************************
  DB CONNECTION
  *************************************** */
  const DB_PATH = process.env.PROD
    ? process.env.PROD_DB_PATH
    : process.env.DEV_DB_PATH;

  try {
    await mongoose.connect(DB_PATH, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (error) {
    console.log(error);
  }

  /* ***************************************
  MAIN JOB
  *************************************** */
  const searches = await Search.find();
  const timestamp = new Date();
  let errCount = 0;




  searches.map(async (search) => {
    const apiResponse = await searchReed(search.searchTerms);
    try {
      await Search.findByIdAndUpdate(search._id, {
        $push: { dailySearchTermCount: { timestamp, count: apiResponse.totalResults } },
      }).exec();
      console.log('count added to saved search');
    } catch (err) {
      console.log(`Search ID:${search._id} failed with Error: ${err.message}`);
      errCount++;
    }
  });

  console.log('Event:', event);
  return errCount;
}

exports.handler = main;