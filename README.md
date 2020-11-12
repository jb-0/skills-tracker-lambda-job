# Skills tracker lambda job

//TODO update README

## Requirements
You will need to have Node.js installed to run this project, please visit the node site for install
instructions: https://nodejs.org/en/download/

## Installation
Once you have NPM installed you can run the following shell commands to install this project, two
npm:
```
git clone https://github.com/jb-0/skills-tracker-lambda-job.git
cd skills-tracker-lambda-job
npm install
```

## Environment variables
- **DEV_DB_PATH** - The path to your development mongo instance, for example 
mongodb://127.0.0.1:27017/skillsearch
- **REED_B64** - REED API key converted to base64 https://www.reed.co.uk/developers/jobseeker

## Running the application
To run the app you can execute the following commands in the project root directory:
```
node index.js
```

Using your preferred web browser you can navigate to localhost:3000 to view and use the app.