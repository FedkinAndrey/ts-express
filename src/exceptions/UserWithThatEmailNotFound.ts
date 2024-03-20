import HttpException from './HttpException';

class UserWithThatEmailNotFound extends HttpException {
  constructor(email: string) {
    super(400, `User with email ${email} not found`);
  }
}

export default UserWithThatEmailNotFound;