import app from './app.js';
import config from './config/index.js';
import connectDB from './config/database.js';

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`🚀 Server is running at http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.log('MONGO db connection failed !!! ', err);
  });