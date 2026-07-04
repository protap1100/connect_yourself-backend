import { prisma } from "../../lib/prisma";
import { ICreatePostPayLoad } from "./post.interface";

const createPost = async (payload: ICreatePostPayLoad, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return posts;
};

const getPostById = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });
  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comment: true,
    },
  });
  return updatedPost;
};

const getPostStats = async () => {};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};

const updatePost = async () => {};

const deletePost = async () => {};

export const postsService = {
  createPost,
  getAllPosts,
  getPostById,
  getPostStats,
  getMyPosts,
  updatePost,
  deletePost,
};
