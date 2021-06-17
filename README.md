# Considerations
This was my first time setting up AWS infrastructure using CDK. In the past I mostly used Serverless Framework.
There was a learning curve to learn how to achieve the same, so it took a bit longer than it would usually take.

I couldn't affod to refactor the code and due to time had to cut a bunch of corner, but I've tried to document most of the places where it could use refactoring/improvements.

# TODO
There are many `TODOS` around the code, these are other things that should be taken care of: 
- [ ] Setup aws stage / region using `.env`
- [ ] split lambdas into their own package with their handlers;
  - [ ] Fix ddb permissions as per lambda needs;
- [ ] Make it so `ts` builds into a dist folder;
- [ ] Remove some of the verbose logs or add a way to control whether they should display;
- [ ] Use mock in tests instead of creating/reading a record every time for cost reasons;
- [ ] Improve error handling and statusCodes

# Deploying
  - run `$ npm run bootstrap` or `$ yarn bootstrap`
  - Set AWS credentials in the terminal then run `$ npm run deploy` or `$ yarn deploy`