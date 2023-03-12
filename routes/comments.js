const express = require("express");
const router = express.Router();
const {Comments, Posts, Users} = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");


//댓글조회 api
router.get("/:postId/comments", authMiddleware, async(req, res) => {
    try{
        const {nickname} = res.locals.user;
        const comments = await Comments.findAll({
            attribute: ["commentsId", "userId", nickname, "comment", "createdAt", "updatedAt"],
            order: [["createdAt", "DESC"]]
        });


        res.status(200).json({comments: comments})
    }catch(err){res.status(400),json({error:"error"})}
});

// 댓글작성api
router.post("/:postId/comments", authMiddleware, async(req, res) => {
    // try{
        const {userId, nickname} = res.locals.user;
        // console.log(userId, nickname)
        //model에서 postId가 not null로 설정되있기때문에 반드시 값이 들어가야함
        //조회에서 postId를 불러오지않으면 나타나지 않아서 상관없다.
        const {postId} = req.params;
        const {comment} = req.body;
        // console.log(comment)

        const now = new Date();
        const created_Comment = await Comments.create({
            UserId : userId,
            postId : postId,
            nickname,
            comment,
            createdAt : now, 
            updatedAt : now,
        })

        console.log

        res.json({
            comments : created_Comment,
            Message : "댓글을 생성하였습니다."
        })
    // }catch(err){"errorMessage": "error"}
})

module.exports = router;