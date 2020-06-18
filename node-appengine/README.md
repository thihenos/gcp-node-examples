# Hold - API

topologia:
```mermaid
graph LR
    U[Luke] -->|"[POST] /api/setQueue"| Z[Express]
	    Z --> View{token?}
            View --> |Não| S[401 - Unauthorized]
	        View -->|Sim| C1{Config no cache ?}
        C1-->|Não|M1[Datastore]
        C1-->|Sim|D1{Entidade configurada ?}
        M1 -->DT[Setar dados no Redis]
        DT-->D1
        D1 --> |Não|Default[5 Min]
        D1 --> |Sim|D2[Tempo da entidade]
    end
```


![picture](graph.png)

estrutura de pastas:
```bash
├── server                     # Configuração do server
│   ├── config 				   # Configs - Redis | Datastore | Promisses Handler
│   ├── functions 			   # "Controllers" para conexão com Redis e Datastore
│   ├── secure 				   # Variáveis de ambiente e JSON de autenteicação
│   ├── services 			   # Chamadas de validações
│   └── routes.js              # Roteamento REST
├── bitbucket-pipelines.yml    # Configuração do Pipeline
├── package.json               # Dependências
├── app.yaml                   # Configuração App Engine
├── server.js 				   # Configurações iniciais do serviço
└── README.md      # Esse Arquivo 
```
# Comandos principais:
 - `npm start` : inicia a aplicação apontando para a produção
 - `npm run dev` : inicia a aplicação apontando para a produção, rodando node monitor para desenvolvimento
 
##  Como funciona a API ?
### 1 - Configurações
A intenção do desenvolvimento da *API* é para controlar a quantidade de requisições de integrações para não acarretar problemas de chamadas excessivas. A *API* trabalhará como um semáforo controlando as requisições por quantidade de requisições permitidas e o tempo de espera para a próxima requisição.
Essas configurações serão armazenadas no **Datatore** do projeto **sa-hg-db**, onde poderemos contar com as seguintes informações:
```javascript
// Entidade holdConfig
{
"entity_id" : "10", //Id da entidade
"instance_id": "23", //Id da instância
"max_intersection": "10", //Maximo de chamadas permitidas por essa entidade
"root" : "LUKE-ESTOQUE", //Nome do ROOT que enviariá a chamada
"ttl" : "5", //Tempo de vida na fila do REDIS em minutos
"ttr": "5"// Assim que chegar no seu limite de max_intersection, esse será o tempo que a proxima chamada deverá respeitar em minutos
}
```
### 2 - Usando a API
Inicialmente, o **LUKE** irá enviar uma requisição POST para o endereço 

> /api/setQueue

 Nesta  requisição, deverá ser enviado os seguintes dados 
```javascript
// Exemplo de JSON enviado na requisição
"headers": {
"Content-Type": "application/json",
"token": "TOKEN_VALIDO"
},
"body": {
	"root" : "ENTIDADE" //Será definido e configurado no datastore
}
```
### 3 - A lógica
- A aplicação irá validar a autenticidade do **TOKEN** 
- Iremos validar se as configurações já tenham sido carregadas do Datastore para o Redis
	- Se não foi carregado, será carregado no Redis com validade de um dia
	- Caso tenha sido carregado posteriormente, prosseguiremos para o próximo passo
- Validaremos se o **ROOT** que está invocando a *API* está configurado , em caso positivo
	- Iremos incrementar mais uma chamada no Redis, caso não tenha chego no limite definido na sessão **1 - Configurações** 
	- Retornaremos o status conforme o step anterior definir, com as seguintes informações
	- Lembrando que o `ttr` será retornado em minutos
```javascript
// Em caso positivo
 response.status(200).send({message : 'Chamada permitida!', grant : true});
// Em caso negativo
 response.status(403).send({message : 'Chamada não permitida', ttr: 10 , grant : false});
```
 - Validaremos se o **ROOT** que está invocando a *API* está configurado , em caso negativo, enviaremos a requisição para uma fila **DEFAULT** que terá como padrão o máximo de apenas 5 chamadas.
	- Iremos incrementar mais uma chamada no **Redis** na fila **DEFAULT**, caso não tenha chego no limite de 5 chamadas
	- Retornaremos o status conforme o step anterior definir, com as seguintes informações
	- Lembrando que o `ttr` será retornado em minutos

```javascript
// Em caso positivo
 response.status(200).send({message : 'Chamada permitida!', grant : true});
// Em caso negativo
 response.status(403).send({message : 'Chamada não permitida', ttr: 5, grant : false});
```

## Dicas:
 É extremamente importante que o nodemon esteja instalado na máquina de quem for rodar a aplicação
 
 Caso seja necessário a reconfiguração do Redis, será necessário editar os dados nas variáveis de ambiente, que estarão dentro do do path `server/secure/.env`

# Pipeline
A pipeline vai efetuar o deploy da API no projeto sa-hg-sys no modo standard 
