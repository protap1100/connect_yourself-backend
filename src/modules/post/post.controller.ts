import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilties/catchAsync";
import { postsService } from "./post.service";
import httpsStatus from "http-status";
import { sendResponse } from "../../utilties/sendResponse";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const result = await postsService.createPost(payload, id as string);
    sendResponse(res,{
      success: true,
      statusCode : httpsStatus.CREATED,
      message : "Post Created Successfully",
      data: result
    });
  },
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postsService.getAllPosts();  
     sendResponse(res,{
      success: true,
      statusCode : httpsStatus.OK,
      message : "Post Fetched successfully",
      data: result
    })
  },
);

const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const postController = {
  createPost,
  getAllPosts,
  getPostStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
