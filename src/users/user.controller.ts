import * as express from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import PostEntity from "../posts/post.entity";
import config from "../ormconfig";

class UserController implements Controller {
  public path = '/users';
  public router = express.Router();
  private postRepository = config.getRepository(PostEntity);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostsOfUser);
  }

  private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
    const userId = +request.params.id;
    if (userId === +request.user.id) {
      try {
        const posts = await this.postRepository.find({
          where: { author: { id: String(userId) } },
          relations: ['categories']
        });
        response.send(posts);
      } catch (error) {
        next(error);
      }
    } else {
      next(new NotAuthorizedException());
    }
  }
}

export default UserController;
