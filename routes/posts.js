const express = require("express");
const { Op, DATE } = require("sequelize");
const {Posts} = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();



//게시글 조회api
router.get("/", async (req, res) => {
  try{
   const posts = await Posts.findAll({
     attributes: ["postId", "UserId", "nickname","title", "createdAt", "updatedAt"],
     order : [["createdAt", "DESC"]],
   });

   res.status(200).json({ posts: posts });
 }catch(err){return res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})}
 });



//게시글 상세조회api
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({
    attributes: ["postId", "UserId", "title", "content", "createdAt", "updatedAt"],
    where: { postId },
  });
  
  return res.status(200).json({ post: post });
});

//게시글 작성api
router.post("/", authMiddleware, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { title, content } = req.body;
// console.log("===================", title, content)

  const now = new Date();
  const post = await Posts.create({
    UserId: userId,
    nickname,
    title,
    content,
    createdAt: now , 
    updatedAt: now
  });

  return res.status(201).json({ data: post });
});



// 게시글 수정
router.put("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  // 게시글을 조회합니다.
  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 수정합니다.
  await Posts.update(
    { title, content }, // title과 content 컬럼을 수정합니다.
    {
      where: {
        [Op.and]: [{ postId }, { UserId: userId }],
      },
    }
  );

  return res.status(200).json({ data: "게시글이 수정되었습니다." });
});



// 게시글 삭제
router.delete("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  // 게시글을 조회합니다.
  const post = await Posts.findOne({ where: { postId } });

  if (!post) {
    return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
  } else if (post.UserId !== userId) {
    return res.status(401).json({ message: "권한이 없습니다." });
  }

  // 게시글의 권한을 확인하고, 게시글을 삭제합니다.
  await Posts.destroy({
    where: {
      [Op.and]: [{ postId }, { UserId: userId }],
    },
  });

  return res.status(200).json({ data: "게시글이 삭제되었습니다." });
});

module.exports = router;
