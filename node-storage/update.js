const {Storage} = require('@google-cloud/storage');
const storage = new Storage({keyFilename: "./secret/keyFile.json"});


  async function uploadFile() {
    await storage.bucket('teste-nerds-gcp').upload(`./src/bat.jpeg`, {
      destination: `bat.jpeg`,
      public : true
    });
    console.log(`-------------------- Upload de imagem no storage ------------------`);
  }

  //Função de upload e remoção dos arquivos temporários
  uploadFile().then(()=>{
         
  }).then(()=>{
      console.log('Upload Finalizado!')
  }).catch(console.error);

