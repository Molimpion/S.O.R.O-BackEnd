// src/index.ts

// Importa a biblioteca do Express
import express from 'express';

// Cria uma instância (uma cópia) do Express, que chamaremos de 'app'.
// É com o 'app' que vamos configurar nosso servidor.
const app = express();

// Define a porta em que nosso servidor irá rodar.
// A porta 3000 é comumente usada para desenvolvimento.
const PORT = 3000;

// Adiciona um 'middleware' que faz o Express entender o formato JSON.
// Isso será essencial quando nosso frontend enviar dados para a API.
app.use(express.json());

// Define nossa primeira rota.
// Quando alguém acessar a URL principal ('/') do nosso servidor com o método GET...
app.get('/', (req, res) => {
  // ...nós enviaremos a resposta 'API está funcionando!'.
  res.send('API está funcionando!');
});

// Inicia o servidor e o faz "escutar" por requisições na porta que definimos.
app.listen(PORT, () => {
  // Esta mensagem aparecerá no seu terminal quando o servidor iniciar com sucesso.
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});