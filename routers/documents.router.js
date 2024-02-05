import express from "express";
import { prisma } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import needSigninMiddlware from "../middlwares/need-signin.middlware.js";

const router = express.Router();

// 이력서 생성 API
router.post("/documents", needSigninMiddlware, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.user;
  if (!title)
    return res.status(400).json({ errorMessage: "제목을 입력해주세요." });
  if (!content)
    return res.status(400).json({ errorMessage: "자기소개를 입력해주세요." });
  const post = await prisma.posts.create({
    data: {
      userId: +userId,
      title: title,
      content: content,
    },
  });
  return res.status(201).json({ message: "이력서가 등록되었습니다." });
});

// 이력서 전체 목록 조회 API
router.get("/documents", needSigninMiddlware, async (req, res) => {
  const orderKey = req.query.orderKey ?? "postId";
  const orderValue = req.query.orderValue ?? "desc";
  if (!["postId", "status"].includes(orderKey)) {
    return res.status(400).json({ message: "orderKey가 올바르지 않습니다." });
  }
  if (!["asc", "desc"].includes(orderValue.toLowerCase())) {
    return res.status(400).json({ message: "orderValue가 올바르지 않습니다." });
  }
  const documents = await prisma.posts.findMany({
    select: {
      postId: true,
      title: true,
      content: true,
      user: {
        select: {
          name: true,
        },
      },
      status: true,
      createdAt: true,
    },
    orderBy: [
      {
        [orderKey]: orderValue,
      },
    ],
  });
  return res.status(200).json({ data: documents });
});

// 이력서 상세 조회 API
router.get("/documents/:postId", async (req, res) => {
  const { postId } = req.params;
  if (!postId)
    return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
  const post = await prisma.posts.findFirst({
    where: { postId: +postId },
    select: {
      postId: true,
      title: true,
      content: true,
      user: {
        select: {
          name: true,
        },
      },
      createdAt: true,
    },
  });

  return res.status(200).json({ data: post });
});

// 이력서 수정 API
router.put("/documents/:postId", needSigninMiddlware, async (req, res) => {
  const { title, content, status } = req.body;
  const { postId } = req.params;
  const document = await prisma.posts.findUnique({
    where: { postId: +postId },
  });
  if (!document)
    return res.status(404).json({ message: "이력서 조회에 실패하였습니다." });
  const { userId } = req.user;
  if (document.userId !== userId)
    return res
      .status(401)
      .json({ message: "이력서를 수정할 권한이 없습니다." });
  await prisma.posts.update({
    data: {
      title,
      content,
      status,
    },
    where: {
      postId: +postId,
    },
  });

  return res.status(200).json({ data: "이력서가 수정되었습니다." });
});

// 이력서 삭제 API
router.delete("/documents/:postId", needSigninMiddlware, async (req, res) => {
  const { postId } = req.params;
  const document = await prisma.posts.findUnique({
    where: { postId: +postId },
  });
  if (!document)
    return res.status(401).json({ message: "이력서 조회에 실패하였습니다." });
  const { userId } = req.user;
  if (document.userId !== userId)
    return res
      .status(401)
      .json({ message: "이력서를 삭제할 권한이 없습니다." });
  await prisma.posts.delete({ where: { postId: +postId } });

  return res.status(200).json({ data: "게시글이 삭제되었습니다." });
});

export default router;
