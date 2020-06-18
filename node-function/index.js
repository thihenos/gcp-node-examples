/**
 * Autor : @thihenos
 * Script de testes para Google Cloud Function
 *
 * Descrição: 
 * Parametros:
    - teste: texto simples para ser exibido no retorno
 */

exports.examplo = (req, res) => {
  res.status(200).send(req.body.message);
};
