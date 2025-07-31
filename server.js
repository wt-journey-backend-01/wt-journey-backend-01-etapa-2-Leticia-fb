const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const setupSwagger = require('./docs/swagger');
setupSwagger(app);

const agentesRoutes = require('./routes/agentesRoutes');
app.use('/agentes', agentesRoutes);

const casosRoutes = require('./routes/casosRoutes');
app.use('/casos', casosRoutes);

const errorHandler = require('./utils/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
});
