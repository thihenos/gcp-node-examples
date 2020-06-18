'use strict';

module.exports = function (app) {

	/* Chamadas REST */
		app.get('/teste', function( req, res) {
			res.send({message : 'Passamos!'})
		});


	/* Fim Chamada REST */

	//Se o usuário digitar qualquer rota REST que nao esteja cadastrada aqui, ele será direcionado para a tela de login
	app.route('/*').get(function (req, res) {
	  res.status(401).send({message : 'Eita! Não autorizado!', grant : false});
	});


};