const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tool Auto Feedback customer Wildberries',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;