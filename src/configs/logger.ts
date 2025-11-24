import pino from 'pino';

// Define o "transporte" (para onde o log vai)
const transport = pino.transport({
  // pino-pretty formata o log em JSON para algo legível no terminal
  target: 'pino-pretty', 
  options: {
    colorize: true,     // Adiciona cores
    ignore: 'pid,hostname', // Ignora campos desnecessários
    translateTime: 'SYS:dd-mm-yyyy HH:MM:ss', // Formata a data
  },
});

// Cria o logger
// Em produção (como no Render), não usamos o 'transport' (pino-pretty)
// e deixamos o log sair como JSON puro, que é o formato ideal.
export const logger = pino(
  {
    // Define o nível de log. 'debug' mostra tudo.
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
  // Só usa o transporte formatado (bonito) se NÃO estiver em produção
  process.env.NODE_ENV !== 'production' ? transport : undefined
);