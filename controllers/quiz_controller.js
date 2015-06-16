var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
  models.Quiz.findById(quizId).then(function(quiz){
    if (quiz){
      req.quiz = quiz;
      next();
    } else {
      next(new Error("No existe quizId="+quizId));
    }
  }).catch(function(error){next(error);});
};

exports.index = function(req, res){
  models.Quiz.findAll().then(function(quizes){
    res.render('quizes/index.ejs', {quizes:quizes});
  }).catch(function(error){next(error);});
};

exports.show = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    res.render('quizes/show', { quiz: req.quiz});
  });
};

exports.answer = function(req, res){
  models.Quiz.findById(req.params.quizId).then(function(quiz){
    if (req.query.respuesta === req.quiz.respuesta){
      res.render('quizes/answer',{quiz:req.quiz, respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer',{quiz:req.quiz, respuesta: 'Incorrecto'});
    }
  });
};

/*exports.question = function(req, res){
  res.render('quizes/question',{pregunta: 'Capital de italia'});
};*/

/*exports.answer = function(req, res){
  if (req.query.respuesta === 'Roma'){
    res.render('quizes/answer',{respuesta: 'Correcto'});
  } else {
    res.render('quizes/answer',{respuesta: 'Incorrecto'});
  }
};*/
