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

  async function getCountAndSaveToRecord(search) {
    const apiResponse = await searchReed(search.searchTerms);

    try {
      await Search.findByIdAndUpdate(search._id, {
        $push: { dailySearchTermCount: { timestamp, count: apiResponse.totalResults } },
      }).exec();
      console.log(`Count for Search ID:${search._id} added`);
    } catch (err) {
      console.log(`Search ID:${search._id} failed with Error: ${err.message}`);
      errCount++;
    }
  }

  async function runForAllRecords() {
    return Promise.all(searches.map(search => getCountAndSaveToRecord(search)));
  }

  await runForAllRecords();

  if (event.runType === 'standard') {
    if (errCount > 0) {
      return `Standard run complete for ${searches.length} searches with ${errCount} errors`;
    }
    return `Standard run complete for ${searches.length} searches`;
  }
}

exports.handler = main;