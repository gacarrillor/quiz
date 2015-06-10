var path = require('path');
var Sequelize = require('sequelize'); // ORM

// Usar BR SQLite
var sequelize = new Sequelize(null, null, null,
  {dialect: "sqlite", storage: "quiz.sqlite"}
);

// Cargar definición de tabla Quiz desde quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz; // exportar def de la tabla Quiz

// sync crea BD y crea e inicializa tabla Quiz en BD
sequelize.sync().then(function(){
  // success ejecuta la funcion una vez creada la tabla
  Quiz.count().then(function(count){
    if (count===0) { // Si la tabla está vacía, se inicializa
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'      
      }).then(function(){console.log('BD inicializada')});
    }
  });
});
