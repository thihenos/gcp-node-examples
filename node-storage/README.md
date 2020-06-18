# image-watermark API

estrutura de pastas:
```bash
├── server                     # Configuração do server
│   ├── config 				   # Configs - Redis | Datastore | Promisses Handler
│   ├── functions 			   # "Controllers" para conexão com Redis e Datastore
│   ├── secure 				   # Variáveis de ambiente e JSON de autenteicação
│   └── services 			   # Chamadas de validações
├── bitbucket-pipelines.yml    # Configuração do Pipeline
├── package.json               # Dependências
├── app.yaml                   # Configuração App Engine
├── index.js 				           # Configurações iniciais do serviço
└── README.md                  # Esse Arquivo
```

# Onde estou?
Projeto : autoavaliar-apps
GCloud Function : imageWatermark

# Comandos principais:
 - `npm start` : inicia a aplicação apontando para a produção
 - `npm test` : inicia a aplicação em modo teste

##  Como funciona a API ?
### 1 - Usando a API
Inicialmente, a **HG-API** irá enviar uma requisição POST para o do Cloud Function

> POST https://us-central1-autoavaliar-apps.cloudfunctions.net/imageWatermark

 Nesta  requisição, deverá ser enviado os seguintes dados
```javascript
// Exemplo de JSON enviado na requisição
"message" : {
  "attributes" : {
    "method" : 'storage', //base64 | storage
    "bucketDownload" : 'photo-ecossistema', //Nome do intervalo
    "bucketUpload" : 'photo-ecossistema', //Nome do intervalo
    "country" : 'ar', // br | qualquer pais já será considerado AutoAction
    "token" : <HG_TOKEN> //token enviado pela HG
  },
  "data" : '<BASE64>'
}
```
### 2 - A lógica
- A aplicação irá converter o base64 do atributo DATA da requisição, que consistirá nos endereços das imagens do storage
- A aplicação irá validar a autenticidade do **TOKEN** da HG e irá validar se é correspondente com o SECRET que estará armazenado na variável de ambiente
- Após validar, a API executa a seguinte operação me *promises*
  - Download do arquivo do bucket
  - Resize da imagem para 800X600
  - Aplicação da Marca D'agua
  - Upload no storage
  - Remoção dos arquivos na pasta temp e download

```javascript
// Em caso positivo
  res.status(200).send({message : 'Fotos tratadas com sucesso!'});
// Em caso positivo de autenticação porem sem imagens
  res.status(204).send({message : 'Não há arquivo na requisição!'});
// Em caso negativo
 response.status(403).send({message : 'Chamada não permitida'});
```
# To Do

- Processamento em batch de base64

## Dicas:
 É extremamente importante que o nodemon esteja instalado na máquina de quem for rodar a aplicação

 Caso seja necessário a reconfiguração do Redis, será necessário editar os dados nas variáveis de ambiente, que estarão dentro do do path `server/secure/.env`

 #### Podemos também utilizar!
  * Utilizar a lib [jimp-watermak](https://www.npmjs.com/package/jimp-watermark) para carimbar o logo nas imagens.
  * Utilizar a lib [image-watermak](https://github.com/luthraG/image-watermark) criar marca d'agua.
  * Utilizar a lib para [caption](https://stackoverflow.com/questions/50465099/watermark-in-image-using-nodejs)

# Pipeline
A pipeline vai efetuar o deploy da API no projeto autoavaliar-apps como um Cloud Function com o nome de imageWatermark
