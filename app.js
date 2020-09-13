//jshint esversion:6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose= require("mongoose")
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb+srv://admin-maulishree:Shamshree@cluster0-pr3un.mongodb.net/webDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

var postSchema = {
  title: String,
  author: String,
  postContent: String,
  date: String,
  genre: String,
  imageLink:String,
  likes: Number
};

var poemSchema = {
  title: String,
  content:String,
  author: String,
  date: String,
  likes: Number,
  imageLink: String
}
const Post = mongoose.model("Post", postSchema);
const Poem = mongoose.model("Poem", poemSchema);
app.get("/",function(req,res)
{
  https.get("https://api.quotable.io/random", function(response) {
    response.on("data", function(data) {
      const content =JSON.parse(data).content;
      const author =JSON.parse(data).author;
      res.render("home",{
        contentbody : content,
        authorbody : author
      });
    })
  })
});

app.get("/members",function(req,res)
{
  res.render("members");
});
app.get("/compcat",function(req,res)
{
  res.render("compcat");
});
app.get("/compose", function(req,res)
{
  res.render("compose");
});
app.get("/genres",function(req,res)
{
  Post.find({}, function(err, posts){
    res.render("genres", {

      posts: posts
      });
  });
});
app.get("/poetry", function(req,res)
{
  Poem.find({}, function(err, poems){
  res.render("poetry",{
    poems: poems
  });
});
});
app.post("/compcat",function(req,res)
{
  var post= new Post({
    title: req.body.postTitle,
    author: req.body.postAuthor,
    genre: req.body.postGenre,
    date: req.body.Date,
    postContent: req.body.postBody,
    imageLink: req.body.postImage,
    likes: 0

  });
  post.save(function(err){
      if (!err){
          res.redirect("/genres");
      }
    });
});




app.post("/compose",function(req,res)
{
  var poem=new Poem({
    title: req.body.poemTitle,
    author:req.body.poemAuthor,
    date: req.body.Date,
    content:req.body.poemBody,
    imageLink: req.body.poemImage,
    likes: req.body.poemViews
  });
  poem.save(function(err)
{
  if(!err){
    res.redirect("/poetry");
  }
});
});
app.get("/posts/:postId",function(req,res)
{
  const requestedPostId= req.params.postId ;

  Post.findOne({_id: requestedPostId}, function(err, post){
    Poem.updateOne({_id: requestedPostId}, {likes: post.likes + 1 }, function(err)
  {
    console.log(err);
  })
    res.render("posts",
    {title:post.title,
      postContent:post.postContent,
      author: post.author,
      date: post.date,
      imageLink: post.imageLink,
      likes: post.likes
    });
    });
  });
 app.get("/poems/:poemId", function(req,res){
   const requestedPoemId = req.params.poemId;

   Poem.findOne({_id: requestedPoemId}, function(err, poem){
     var newlikes=poem.likes + 1;
     Poem.updateOne({_id: requestedPoemId}, {likes: newlikes }, function(err)
   {
     console.log(err);
   })
      res.render("poems",
   {
     title: poem.title,
     author: poem.author,
     date: poem.date,
     content:poem.content,
     imageLink: poem.imageLink,
     likes: poem.likes
   })
   })
 })
// Post.updateOne({genre:"6"},function(err)
// {
//   if(err)
//   {
//     console.log(err);
//
//   }else {
//     console.log("success");
//   }
// })


app.listen(9000, function() {
  console.log("Server started on port 7000");
});
