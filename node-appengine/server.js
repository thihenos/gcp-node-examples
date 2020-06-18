const express = require('express'),
bodyParser = require('body-parser'),
app = express();


/* Configuração de body */
	app.use(bodyParser.json());

const server = require('http').createServer(app);

/* Condiguração de porta express */
	// Subindo server em porta desejada
	app.listen(process.env.PORT || 3000, function(){
		console.log('Server Started On Port 3000');
	});
/* Fim Condiguração de porta express */

/* Chamada das rotas REST da aplicação */ 
	require('./server/routes')(app);
/* Fim Chamada das rotas REST da aplicação */
