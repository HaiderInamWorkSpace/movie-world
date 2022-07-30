const express = require('express');
const router = express.Router();
var sentiment = require( 'wink-sentiment' );
const { Comment } = require("../models/Comment");
const { Movie } = require("../models/Movie");
const { auth } = require("../middleware/auth");
const e = require('express');


router.post("/saveComment", auth, (req, res) => {
    
    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        // console.log(err)
        if (err) return res.json({ success: false, err })

        Comment.find({ '_id': comment._id })
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({ success: false, err })
                return res.status(200).json({ success: true, result })
            })
    })

    const inputReview = sentiment(req.body.content);
    console.log("")
    console.log("")
    console.log("Sentiment analysis is being performed below")
    console.log("")
    console.log(inputReview);
    console.log("")
    // console.log(inputReview.tokenizedPhrase.length)
    // var noSentimentCounter = 0;
    // inputReview.tokenizedPhrase.map( singleObject => {
    //   if(singleObject.score >= 0){
    //     console.log("Positive Token")
    //   }else if(singleObject.score < 0){
    //     console.log("Negative Token")
    //   }else{
    //     noSentimentCounter++
    //   }
    // })
    // if(noSentimentCounter === inputReview.tokenizedPhrase.length){
    //   console.log("No sentiment found")
    // } else {
    //   console.log("Sentiment Detected")
    // }
    
    const sentimentScore = Math.round(inputReview.normalizedScore*2)/2

    
    

    Movie.findOne({_id: req.body.postId}, function(err, foundMovie){
        if(foundMovie){
          console.log("Please note for illustration purposes rating below is not average rating of all ratings")
          console.log("")
          console.log("Rating generated after integrating rating formula with sentiment analysis is: " + determineRatingScore(sentimentScore) + " out of 10")
          console.log("")
          const calculateAverage = ((foundMovie.rating*foundMovie.ratingCount)+determineRatingScore(sentimentScore))/(foundMovie.ratingCount+1)
          const averageRating = Math.round(calculateAverage * 10) / 10;
            Movie.replaceOne(
                //conditions
                {_id: req.body.postId},
                //updates
                {title: req.body.title, rating: averageRating, ratingCount: foundMovie.ratingCount+1},
                {overwrite: true},
                function(err){
                  if(!err){
                    console.log("Successfully updated movie rating");
                  } else {
                    console.log(err);
                  }
                });
        }
        else{
          console.log("Please note for illustration purposes rating below is not average rating of all ratings")
          console.log("")
          console.log("Rating generated after sentiment analysis: " + determineRatingScore(sentimentScore) + " out of 10")
          console.log("")
            const calculateAverage  = ((req.body.rating*req.body.ratingCount)+determineRatingScore(sentimentScore))/(req.body.ratingCount+1)
            const averageRating = Math.round(calculateAverage * 10) / 10;
            const movieDocument = new Movie({
                _id: req.body.postId,
                title: req.body.title,
                rating: averageRating,
                ratingCount: req.body.ratingCount+1
            });
            
              //Save new movie document in Movie Collection
              movieDocument.save(function(err){
                if(!err){
                  console.log("New Movie Document has successfully stored in Movie Collection");
                } else{
                  console.log(err);
                }
              });          
        }
      });

})

router.post("/getComments", (req, res) => {

    Comment.find({ "postId": req.body.movieId })
        .populate('writer')
        .exec((err, comments) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, comments })
        })

    
});

router.post("/getTests", (req, res) => {

    Movie.findOne({ "_id": req.body.movieId })
        .exec((err, movie) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, movie })
        })
    
});

function determineRatingScore(sentimentScore){

  if(sentimentScore > 3){
    ratingScore = 10
  } else if (sentimentScore < 3){
    ratingScore = 0
  }else {
    switch(sentimentScore){
      case -3:
        ratingScore = 0;
        break;        
      case -2.5:
        ratingScore = 1;
        break;
      case -2:
        ratingScore = 2;
        break;
      case -1.5:
        ratingScore = 3;
        break;
      case -1:
        ratingScore = 4;
        break;
      case -0.5:
        ratingScore = 4.5;
        break;
      case 0:
        ratingScore = 5;
        break;
      case 0.5:
        ratingScore = 5.5;
        break;
      case 1:
        ratingScore = 6;
        break;
      case 1.5:
        ratingScore = 7;
        break;
      case 2:
        ratingScore = 8;
        break;
      case 2.5:
        ratingScore = 9;
        break;
      case 3:
        ratingScore = 10;
        break;
      default:
        ratingScore = 0;
    }
  }
  
  return ratingScore;
}


module.exports = router;
