import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const configuration = {
  JWT_SECRET_KEY: `${process.env.JWT_SECRET_KEY}`,
  PORT: process.env.PORT,
  BASE_URL: `${process.env.BASE_URL}`,
  DB_HOST: `${process.env.DB_HOST}`,
  DB_PORT: parseInt(`${process.env.DB_PORT}`),
  DB_USER: `${process.env.DB_USER}`,
  DB_PASSWORD: `${process.env.DB_PASSWORD}`,
  DB_NAME: `${process.env.DB_NAME}`,
  DB_TYPE: `${process.env.DB_TYPE}`,
  EMAIL_HOST: `${process.env.EMAIL_HOST}`,
  EMAIL_USERNAME: `${process.env.EMAIL_USERNAME}`,
  EMAIL_PASSWORD: `${process.env.EMAIL_PASSWORD}`,
};

export { configuration };
