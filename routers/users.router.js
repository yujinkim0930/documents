import express from "express";
import { prisma } from "../models/index.js";

const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  const { email, password, pwCheck, name } = req.body;
  const isExistUser = await prisma.users.findFirst({
    where: { email },
  });
  if (isExistUser) {
    return res
      .status(409)
      .json({ errorMessage: "이미 존재하는 이메일입니다." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ errorMessage: "비밀번호는 최소 6자리 이상이어야 합니다." });
  }
  if (password !== pwCheck) {
    return res
      .status(401)
      .json({ errorMessage: "비밀번호가 일치하지 않습니다." });
  }
  const user = await prisma.users.create({
    data: { email, password, name },
  });

  return res.status(201).json({ email, name });
});

export default router;
