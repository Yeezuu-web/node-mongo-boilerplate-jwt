import app from './src/app';
import dotenv from 'dotenv';
import connectDB from './src/utils/database';

dotenv.config();

// Create server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  connectDB();
});

app._router.stack.forEach(function (r: any) {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});
