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
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.CREATED,
      message: "Post Created Successfully",
      data: result,
    });
  },
);
const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postsService.getAllPosts();
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Post Fetched successfully",
      data: result,
    });
  },
);
const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post ID Requires In Params");
    }
    const result = await postsService.getPostById(postId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Post retrived successfully",
      data: result,
    });
  },
);
const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role == "ADMIN";

    const postId = req.params.postId;
    const payload = req.body;
    const result = await postsService.updatePost(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Post Updated successfully",
      data: result,
    });
  },
);
const getPostStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postsService.getPostStats();
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Post Stats Retrived successfully",
      data: result,
    });
  },
  
);
const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    // console.log("hellow wordl", authorId);
    const result = await postsService.getMyPosts(authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Post retrived successfully",
      data: result,
    });
  },
);
const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role == "ADMIN";
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post id Required in params");
    }

    await postsService.deletePost(
      postId as string,
      authorId as string,
      isAdmin as boolean,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpsStatus.OK,
      message: "Post Deleted successfully",
      data: null,
    });
  },
);

export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  getPostStats,
  getMyPosts,
  updatePost,
  deletePost,
};
