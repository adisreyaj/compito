const dotenv = require('dotenv');
dotenv.config();

(() => {
  const VERCEL_ENV = process.env.VERCEL_ENV;
  if (VERCEL_ENV !== 'production') {
    process.exit(0);
  }
})();
