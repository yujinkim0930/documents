import express from "express";
import { prisma } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import needSigninMiddlware from "../middlwares/need-signin.middlware.js";

const router = express.Router();

//회원가입 API
router.post("/sign-up", async (req, res) => {
  const { email, client_Id, password, pwCheck, name, grade } = req.body;
  if (grade && !["user", "admin"].includes(grade)) {
    return res.status(400).json({ message: "등급이 올바르지 않습니다." });
  }
  if (!client_Id) {
    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해주세요." });
    }
    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해주세요." });
    }
    if (!pwCheck) {
      return res.status(400).json({ message: "비밀번호를 확인해주세요." });
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
  }
  if (!name) {
    return res.status(400).json({ message: "이름을 확인해주세요." });
  }

  //clientId (kakao)
  if (client_Id) {
    const user = await prisma.users.findFirst({
      where: {
        client_Id,
      },
    });

    if (user) {
      return res
        .status(409)
        .json({ errorMessage: "이미 가입된 사용자입니다." });
    }
    await prisma.users.create({
      data: { client_Id, name, grade },
    });
    return res.status(201).json({ client_Id, name });
  } else {
    // email
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (user) {
      return res
        .status(409)
        .json({ errorMessage: "이미 존재하는 이메일입니다." });
    }
    await prisma.users.create({
      data: { email, password: hashedPassword, name, grade },
    });
    return res.status(201).json({ email, name });
  }
});

// 로그인 API
router.post("/sign-in", async (req, res) => {
  const { client_Id, email, password } = req.body;
  let user;
  if (client_Id) {
    // 카카오 로그인
    user = await prisma.users.findFirst({ where: { client_Id } });

    if (!user)
      return res
        .status(404)
        .json({ message: "올바르지 않은 로그인 정보입니다." });
  } else {
    // 이메일 로그인
    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해주세요." });
    }
    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해주세요." });
    }
    user = await prisma.users.findFirst({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "존재하지 않는 이메일입니다." });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  const accessToken = jwt.sign(
    {
      userId: user.userId,
    },
    process.env.SECRET_KEY,
    { expiresIn: "12h" }
  );
  return res.status(200).json({ accessToken });
});

// 내 정보 조회 API
router.get("/users", needSigninMiddlware, async (req, res) => {
  const user = res.locals.users;
  return res.status(200).json({
    email: user.email,
    name: user.name,
  });
});

export default router;
