var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

var Sequelize = require('sequelize'); // ORM

// Usar BD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  {dialect: protocol, 
   protocol: protocol,
   port:port,
   host:host,
   storage: storage,  // Solo SQLite (.env)
  omitNull: true}  // Solo Pg
);

// Cargar definición de tabla Quiz desde quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Cargar definición de tabla Comment desde comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));

// Definir relaciones entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment, {
  'constraints': true,
  'onUpdate': 'cascade',
  'onDelete': 'cascade',
  'hooks': true
}); 

exports.Quiz = Quiz; // exportar def de la tabla Quiz
exports.Comment = Comment; // exportar def de la tabla Comment

// sync crea BD y crea e inicializa tabla Quiz en BD
sequelize.sync().then(function(){
  // success ejecuta la funcion una vez creada la tabla
  Quiz.count().then(function(count){
    if (count===0) { // Si la tabla está vacía, se inicializa
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'Geografía'    
      });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'Geografía'
      });
      Quiz.create({ pregunta: 'Río más largo del mundo',
                    respuesta: 'Amazonas',
                    tema: 'Geografía'
      });
      Quiz.create({ pregunta: 'Último campeón de Copa América',
                    respuesta: 'Uruguay',
                    tema: 'Deportes'     
      });
      Quiz.create({ pregunta: 'Último campeón de Copa Mundo',
                    respuesta: 'Alemania',
                    tema: 'Deportes'
      });
      Quiz.create({ pregunta: 'Río más importante de Colombia',
                    respuesta: 'Magdalena',
                    tema: 'Geografía'
      })      
      .then(function(){console.log('BD inicializada')});
    }
  });
});
