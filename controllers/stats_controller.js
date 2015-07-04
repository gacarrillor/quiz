var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res){
  var stats = {
    quizes: 0,
    comments: 0,
    commentsPerQuiz: 0,
    quizesWithNoComment: 0,
    quizesWithComment: 0
  },
  errors = [];
  
  models.Quiz.count()
  .then(function(count){
    stats.quizes = count;
     return models.Comment.count();
  })
  .then(function(count){
    stats.comments = count;
    return stats.quizes ? stats.comments/stats.quizes : 0;
  })
  .then(function(count){
    stats.commentsPerQuiz = count;
    return models.Comment.countQuizesWithComments();
  })
  .then(function(count){
    stats.quizesWithComment = count;
    stats.quizesWithNoComment = stats.quizes - count;
  })
  .catch(function (err) { errors.push(err); })
  .finally(function (){
    res.render('quizes/statistics.ejs', {stats:stats, errors:errors});
  });
};
