import * as express from 'express';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import Post from './post.interface';
import PostEntity from './post.entity';
import postModel from './posts.model';
import {getRepository} from "typeorm";
import config from "../ormconfig";

class PostsController implements Controller {
  public path = '/posts';
  public router = express.Router();
  /* for mongodb */
  // private post = postModel;

  //postgresql
  private postRepository =  config.getRepository(PostEntity);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // this.router.get(this.path, this.getAllPosts);
    // this.router.get(`${this.path}/:id`, this.getPostById);
    // this.router
    //   .all(`${this.path}/*`, authMiddleware)
    //   .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
    //   .delete(`${this.path}/:id`, this.deletePost)
    //   .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);

    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(this.path, validationMiddleware(CreatePostDto), this.createPost);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  /* for mongodb */
  // private getAllPosts = async (request: express.Request, response: express.Response) => {
  //   const posts = await this.post.find();
  //   response.send(posts);
  // }

  /* for postgresql */
  private getAllPosts = async (request: express.Request, response: express.Response) => {
    const posts = await this.postRepository.find();
    response.send(posts);
  }

  /* for mongodb

  private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const post = await this.post.findById(id);
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }
  */

  /* for postgresql */
  private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const post = await this.postRepository.findOneBy({id: +id});
    if (post) {
      response.send(post);
    } else {
      next(new PostNotFoundException(id));
    }
  }
  /* for mongodb
    private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
      const id = request.params.id;
      const postData: Post = request.body;
      const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
      if (post) {
        response.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    }
  */

 /* for postgresql*/
    private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
      const id = request.params.id;
      const postData: Post = request.body;
      await this.postRepository.update(id, postData);
      const updatedPost = await this.postRepository.findOneBy({id: +id});
      if (updatedPost) {
        response.send(updatedPost);
      } else {
        next(new PostNotFoundException(id));
      }
    }

    /* for mongodb */
  // private createPost = async (request: RequestWithUser, response: express.Response) => {
  //   const postData: CreatePostDto = request.body;
  //   const createdPost = new this.post({
  //     ...postData,
  //     author: request.user._id,
  //   });
  //   const savedPost = await createdPost.save();
  //   response.send(savedPost);
  // }

  /* for postgresql */
  private createPost = async (request: express.Request, response: express.Response) => {
    const postData: CreatePostDto = request.body;
    const newPost = this.postRepository.create(postData);
    await this.postRepository.save(newPost);
    response.send(newPost);
  }

  /* for mongodb */
  /*private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const successResponse = await this.post.findByIdAndDelete(id);
    if (successResponse) {
      response.send(200);
    } else {
      next(new PostNotFoundException(id));
    }
  }*/

  /* for postgresql */
  private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const deleteResponse = await this.postRepository.delete(id);
    if (deleteResponse.raw[1]) {
      response.sendStatus(200);
    } else {
      next(new PostNotFoundException(id));
    }
  }
}

export default PostsController;