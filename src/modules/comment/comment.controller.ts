import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utilties/catchAsync";
import httpsStatus from "http-status";
import { sendResponse } from "../../utilties/sendResponse";
import { commentService } from "./comment.service";

const createComment = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const authorId = req.user?.id as string;
    const result = await commentService.createComment(authorId, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpsStatus.CREATED,
        message: "Comment created successfully",
        data: result
    })
})

const getCommentsByAuthorId = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const { authorId } = req.params
    const result = await commentService.getCommentByAuthorId(authorId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpsStatus.OK,
        message: "Comments retrieved successfully",
        data: result
    })
})


const getCommentsByCommentId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const moderateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const commentController = {
  createComment,
  getCommentsByAuthorId,
  getCommentsByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};
