import 'dotenv/config';

export default {
  "scheme": "myapp",
  extra: {
    SUPERBASE_URL: process.env.SUPERBASE_URL,
    SUPERBASE_ACCESS_TOKEN: process.env.SUPERBASE_ACCESS_TOKEN,
  },
};