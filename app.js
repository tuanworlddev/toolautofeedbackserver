const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const schedule = require('node-schedule');
const feedbackService = require('./services/feedback.service');

const shopRoutes = require('./routes/shop.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const questionRoutes = require('./routes/question.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/shops', shopRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/questions', questionRoutes);

schedule.scheduleJob('0 * * * *', async () => {
    console.log('Running feedback automation job...');
    await feedbackService.processFeedbacks();
});
module.exports = app;