const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users.js");
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");

const app = express();
const PORT = 3016;



app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use('/', usersRouter);
app.use("/posts", [postsRouter, commentsRouter]);



app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})