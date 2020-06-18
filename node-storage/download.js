const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename: "./secret/keyFile.json"});

console.log(`-------------------- Download de imagem  ------------------`);

    return new Promise((resolve, reject) => {

      const myBucket = storage.bucket(`teste-nerds-gcp`);
      const file = myBucket.file('sups.jpeg');

      //Download do arquivo do bucket para a pasta temporária
      file.download({destination: `./src/sups.jpeg`}, function(err) {
        if(err){
          console.log(err);
          reject(err);
        }
      });

    }).catch((erro)=>{
      console.log(erro);
    });
