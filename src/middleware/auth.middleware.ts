import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import User from '../users/user.entity';
import ormconfig from "../ormconfig";

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const headers = request.headers;
  const userRepository = ormconfig.getRepository(User);
  if (headers && headers['authorization']) {
    const secret = process.env.JWT_SECRET;
    const auth = headers['authorization'] as string;
    try {
      const verificationResponse = jwt.verify(auth, secret) as DataStoredInToken;
      const id = verificationResponse.id;
      const user = await userRepository.findOne({where: {id: id}});
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;