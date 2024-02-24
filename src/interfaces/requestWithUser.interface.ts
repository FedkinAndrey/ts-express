
import { Request } from 'express';
import User from "../users/user.entity";
// import User from 'users/user.interface.ts1';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;