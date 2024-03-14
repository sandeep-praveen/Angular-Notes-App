import app from './src/app.js';
import config from './config.js'
import mongoose from 'mongoose';

mongoose.connect(config.DB_URL)
    .then(() => {
        console.log('Connected to DataBase');
        app.listen(config.PORT, () => {
            console.log(`Server is running on http://localhost:${config.PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to DataBase:', err);
        process.exit(1);
    });