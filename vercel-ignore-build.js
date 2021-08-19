const dotenv = require('dotenv');
dotenv.config();

(() => {
  const VERCEL_ENV = process.env.VERCEL_ENV;
  const COMMIT_MSG = process.env.VERCEL_GIT_COMMIT_MESSAGE;
  if (VERCEL_ENV === 'production' && COMMIT_MSG.includes('ui')) {
    process.exit(0);
  }
})();
