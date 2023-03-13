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
        //model에서 postId가 not null로 설정되있기때문에 반드시 값이 들어가야함
        //조회에서 postId를 불러오지않으면 나타나지 않아서 상관없다.
        const {postId} = req.params;
        const {comment} = req.body;

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


//댓글수정 api
router.put("/:postId/comments/:commentId", authMiddleware, async(req, res) => {
    const {commentId} = req.params;
    console.log(commentId)
    const {comment} = req.body;
    const change_comments = await Comments.findOne({ where : {commentId}})

    change_comments.comment = comment;

    await change_comments.save();

    res.status(200).json({Message: "댓글을 수정하였습니다."})

})

//댓글삭제 api
router.delete("/:postId/comments/:commentId", authMiddleware, async(req, res) => {
    const {commentId} = req.params;
    const destroy_comment = await Comments.findOne({ where : {commentId}});
    if(!destroy_comment) {
        return res.status(404).json({errorMessage: "댓글이 존재하지 않습니다."})
    }

    await destroy_comment.destroy({ commentId : commentId});

    res.status(200).json({Message : "댓글이 삭제되었습니다."});

})


module.exports = router;
