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
exports.Quiz = Quiz; // exportar def de la tabla Quiz

// sync crea BD y crea e inicializa tabla Quiz en BD
sequelize.sync().then(function(){
  // success ejecuta la funcion una vez creada la tabla
  Quiz.count().then(function(count){
    if (count===0) { // Si la tabla está vacía, se inicializa
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma'      
      });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa'      
      });
      Quiz.create({ pregunta: 'Río más largo del mundo',
                    respuesta: 'Amazonas'      
      });
      Quiz.create({ pregunta: 'Último campeón de Copa América',
                    respuesta: 'Uruguay'      
      });
      Quiz.create({ pregunta: 'Último campeón de Copa Mundo',
                    respuesta: 'Alemania'      
      });
      Quiz.create({ pregunta: 'Río más importante de Colombia',
                    respuesta: 'Magdalena'      
      })      
      .then(function(){console.log('BD inicializada')});
    }
  });
});
