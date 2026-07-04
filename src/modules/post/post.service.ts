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

const getPostStats = async () => {

};

const getMyPosts = async () => {

};

const updatePost = async () => {

};

const deletePost = async () => {

};


export const postsService = {
  createPost,
  getAllPosts,
};
