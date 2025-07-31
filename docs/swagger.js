const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Departamento de Polícia',
      version: '1.0.0',
      description: 'Documentação da API RESTful para agentes e casos policiais.',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'dev@policia.gov',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Agente: {
          type: 'object',
          required: ['nome', 'dataDeIncorporacao', 'cargo'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            nome: {
              type: 'string',
              example: 'João da Silva'
            },
            dataDeIncorporacao: {
              type: 'string',
              format: 'date',
              example: '2023-01-01'
            },
            cargo: {
              type: 'string',
              example: 'Investigador'
            }
          }
        },
        Caso: {
          type: 'object',
          required: ['titulo', 'descricao', 'status', 'agente_id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '987e6543-e21b-43d2-a456-426614174000'
            },
            titulo: {
              type: 'string',
              example: 'Assalto a banco'
            },
            descricao: {
              type: 'string',
              example: 'Roubo à mão armada em agência no centro'
            },
            status: {
              type: 'string',
              enum: ['aberto', 'solucionado'],
              example: 'aberto'
            },
            agente_id: {
              type: 'string',
              format: 'uuid',
              example: '123e4567-e89b-12d3-a456-426614174000'
            }
          }
        },
        ErroPadrao: {
          type: 'object',
          properties: {
            status: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Parâmetros inválidos' },
            errors: {
              type: 'object',
              additionalProperties: { type: 'string' }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
