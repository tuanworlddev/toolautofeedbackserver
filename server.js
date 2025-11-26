require('dotenv').config();

const connectDB = require('./database/connection');
connectDB();

const app = require('./app');

const PORT = process.env.PORT || 3400;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})