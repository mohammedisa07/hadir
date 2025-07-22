const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafe Order & Receipts API',
      version: '1.0.0',
      description: 'API documentation for Cafe Order & Receipts backend',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger; 