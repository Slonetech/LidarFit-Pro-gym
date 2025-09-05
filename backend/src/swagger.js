import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'LidarFit Pro Gym API',
      version: '1.0.0',
      description: 'API documentation for LidarFit Pro Gym Management System',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'staff', 'customer'] },
            gym: { type: 'string' }
          }
        },
        MemberProgress: {
          type: 'object',
          properties: {
            customer: { type: 'string' },
            initialWeightKg: { type: 'number' },
            currentWeightKg: { type: 'number' },
            bodyType: { type: 'string' },
            measuredAt: { type: 'string', format: 'date-time' }
          }
        },
        ServicePackage: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: ['monthly', 'yearly', 'custom'] },
            price: { type: 'number' }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            customer: { type: 'string' },
            amount: { type: 'number' },
            method: { type: 'string' },
            status: { type: 'string' },
            transactionRef: { type: 'string' }
          }
        },
        Equipment: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            vendor: { type: 'string' },
            purchaseDate: { type: 'string', format: 'date' },
            quantity: { type: 'integer' }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            customer: { type: 'string' },
            checkInAt: { type: 'string', format: 'date-time' },
            checkOutAt: { type: 'string', format: 'date-time' }
          }
        },
        Announcement: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            message: { type: 'string' },
            audience: { type: 'string' }
          }
        },
        Todo: {
          type: 'object',
          properties: {
            customer: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            dueDate: { type: 'string', format: 'date' }
          }
        }
      }
    }
  },
  apis: ['src/routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);
export const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


