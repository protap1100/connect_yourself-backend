import { commentStatus, postStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayLoad, IUpdatePostPayload } from "./post.interface";

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
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },
  // });

  // const post = prisma.post.findUniqueOrThrow({
  //   where: {
  //     id: postId,
  //   },
  //   include: {
  //     author: {
  //       omit: {
  //         password: true,
  //       },
  //     },
  //     comments: {
  //       where: {
  //         status: commentStatus.APPROVED,
  //       },
  //       orderBy: {
  //         createdAt: "asc",
  //       },
  //     },
  //     _count :{
  //       select:{
  //         comments: true,
  //       }
  //     }

  //   },
  // });

  // return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // throw new Error("fakse error");
    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: commentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
};

const getPostStats = async () => {
  const transactionsResult = await prisma.$transaction(async (tx) => {
    const totalPost = await tx.post.count();
    const totalPublishedPost = await tx.post.count({
      where: {
        status: postStatus.PUBLISHED,
      },
    });
    const totalDraftPost = await tx.post.count({
      where: {
        status: postStatus.DRAFT,
      },
    });
    const totalArchivedPost = await tx.post.count({
      where: {
        status: postStatus.ARCHIVED,
      },
    });
    const totalComment = await tx.comment.count();

    const totalApprovedComment = await tx.comment.count({
      where: {
        status: commentStatus.APPROVED,
      },
    });

    const totalRejectedComment = await tx.comment.count({
      where: {
        status: commentStatus.REJECTED,
      },
    });
    return {
      totalPost,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComment,
      totalApprovedComment,
      totalRejectedComment
    }



  });
  return transactionsResult;
};

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

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }
  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUnique({
    // const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  const result = await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return result;
};

export const postsService = {
  createPost,
  getAllPosts,
  getPostById,
  getPostStats,
  getMyPosts,
  updatePost,
  deletePost,
};
