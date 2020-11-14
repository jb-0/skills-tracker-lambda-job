# Skills tracker lambda job
This Node.js project is designed to be deployed as an AWS Lambda function, it is an extension of my
skills tracker repository https://github.com/jb-0/skills-tracker. While there are may ways for a
lambda function to be triggered, I have opted to use an AWS CloudWatch event to trigger it on a daily
basis.

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

## Running the function
To run the function you can execute the below command in the project root directory. The function 
accepts an object containing the runType, currently only 'standard' is valid input.
```
node -e "(async () => console.log(await require('./index').handler({runType:'standard'})))();" 
```

For convenience the above function is already defined in package.json as a test, so "npm test" can
also be executed to achieve the same result.
