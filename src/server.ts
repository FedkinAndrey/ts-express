import 'dotenv/config';
import 'reflect-metadata';
import AddressController from './address/address.controller';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import CategoryController from './category/category.controller';
import PostController from './posts/posts.controller';
import {validateEnv} from './utils/validateEnv';
import ormconfig from "./ormconfig";

validateEnv();

(async () => {
  try {
    await ormconfig.initialize();
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }
  const app = new App(
    [
      new PostController(),
      new AuthenticationController(),
      new AddressController(),
      new CategoryController(),
    ],
  );
  app.listen();
})();