import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import User from '../users/user.entity';
import LogInDto from './logIn.dto';
import ormconfig from "../ormconfig";

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private userRepository = ormconfig.getRepository(User);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    if (
      await this.userRepository.findOne({
        where: {
          email: userData.email
        }
      })
    ) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      await this.userRepository.save(user);
      user.password = undefined;
      const tokenData = this.createToken(user);
      // response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      response.setHeader('Authorization', `${tokenData.token}`);
      response.send(user);
    }
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const logInData: LogInDto = request.body;
    const user = await this.userRepository.findOne({
      where: {
        email: logInData.email
      }
    });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        user.password = undefined;
        const tokenData = this.createToken(user);
        // response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
        response.setHeader('Authorization', `${tokenData.token}`);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private loggingOut = (request: express.Request, response: express.Response) => {
    response.setHeader('Authorization', '');
    response.send(200);
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60 * 24 * 365;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
    };
  }
}

export default AuthenticationController;