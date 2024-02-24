// import 'dotenv/config';
// import App from './app';
// import PostsController from './posts/posts.controller';
// import {validateEnv} from './utils/validateEnv';
// import AuthenticationController from "./authentication/authentication.controller";
// import UserController from "./users/user.controller";
// import ReportController from "./report/report.controller";
//
// validateEnv();
//
// const app = new App(
//   [
//     new PostsController(),
//     new AuthenticationController(),
//     new UserController(),
//     new ReportController(),
//   ],
// );
//
// app.listen();


import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import config from './ormconfig';
import PostController from './posts/posts.controller';
import {validateEnv} from './utils/validateEnv';

validateEnv();

(async () => {
  try {
    await config.initialize()
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }
  const app = new App(
    [
      new PostController(),
    ],
  );
  app.listen();
})();