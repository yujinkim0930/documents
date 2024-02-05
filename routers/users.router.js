import express from "express";
import { prisma } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import needSigninMiddlware from "../middlwares/need-signin.middlware.js";

const router = express.Router();

//회원가입 API
router.post("/sign-up", async (req, res, next) => {
  const { email, password, pwCheck, name } = req.body;
  if (!email) {
    return res.status(400).json({ message: "이메일을 입력해주세요." });
  }
  if (!password) {
    return res.status(400).json({ message: "비밀번호를 입력해주세요." });
  }
  if (!pwCheck) {
    return res.status(400).json({ message: "비밀번호를 확인해주세요." });
  }
  if (!name) {
    return res.status(400).json({ message: "이름을 확인해주세요." });
  }
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
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: { email, password: hashedPassword, name },
  });

  return res.status(201).json({ email, name });
});

// 로그인 API
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "이메일을 입력해주세요." });
  }
  if (!password) {
    return res.status(400).json({ message: "비밀번호를 입력해주세요." });
  }
  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    return res.status(404).json({ message: "존재하지 않는 이메일입니다." });
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "custom-secret-key",
    { expiresIn: "12h" }
  );

  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공" });
});

router.get("/users", needSigninMiddlware, async (req, res, next) => {
  const { userId } = req.user;
  const user = await prisma.users.findFirst({
    where: { userId: +userId },
    select: {
      email: true,
      name: true,
    },
  });
  return res.status(200).json({ user });
});

export default router;
