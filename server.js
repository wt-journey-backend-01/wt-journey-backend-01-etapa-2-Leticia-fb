const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para aceitar JSON
app.use(express.json());

// Rotas
const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');

app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

const setupSwagger = require('./docs/swagger');
setupSwagger(app);


const errorHandler = require('./utils/errorHandler');
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});
