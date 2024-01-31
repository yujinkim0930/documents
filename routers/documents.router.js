import express from "express";
import { prisma } from "../models/index.js";

const router = express.Router();

// 이력서 생성 API
router.post("/documents", async (req, res, next) => {
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
});

export default router;
