
import Joi from 'joi';

interface EnvVars {
  NODE_ENV?: 'production' | 'development' | 'test';
  PORT?: number;
  SYSTEM_DOMAIN?: string;

  JWT_SECRET: string,
  JWT_ACCESS_EXPIRATION_MINUTES: number,
  JWT_REFRESH_EXPIRATION_DAYS: number,
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number,
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number
  JWT_SHOP_REFRESH_EXPIRATION_DAYS: number,

  DB_HOST?: string;
  DB_USER?: string;
  DB_PASSWORD?: string;
  DB_NAME?: string;
  DB_PORT: number,

  DB_PRODUCTION_HOST?: string;
  DB_PRODUCTION_USER?: string;
  DB_PRODUCTION_PASSWORD?: string;
  DB_PRODUCTION_NAME?: string;
  DB_PRODUCTION_PORT: number,
}

const envVarsSchema = Joi.object<EnvVars>({
  NODE_ENV: Joi.string().valid('production', 'development', 'test'),
  PORT: Joi.number().default(8000),
  SYSTEM_DOMAIN: Joi.string().description('Domain name'),

  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which reset password token expires'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which verify email token expires'),
  JWT_SHOP_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which shop refresh tokens expire'),

  DB_HOST: Joi.string().description('database host'),
  DB_USER: Joi.string().description('database user'),
  //DB_PASSWORD: Joi.string().description('database password'),
  DB_NAME: Joi.string().description('database name'),
  DB_PORT: Joi.number().default(3306),

  DB_PRODUCTION_HOST: Joi.string().description('database host'),
  DB_PRODUCTION_USER: Joi.string().description('database user'),
  //DB_PRODUCTION_PASSWORD: Joi.string().optional().description('database password'),
  DB_PRODUCTION_NAME: Joi.string().description('database name'),
  DB_PRODUCTION_PORT: Joi.number().default(3306),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const isProduction = envVars.NODE_ENV === "production";

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  domain: envVars.SYSTEM_DOMAIN,
  db: {
    host: isProduction ? envVars.DB_PRODUCTION_HOST : envVars.DB_HOST,
    port: isProduction ? envVars.DB_PRODUCTION_PORT : envVars.DB_PORT,
    user: isProduction ? envVars.DB_PRODUCTION_USER : envVars.DB_USER,
    password: isProduction ? envVars.DB_PRODUCTION_PASSWORD : envVars.DB_PASSWORD,
    database: isProduction ? envVars.DB_PRODUCTION_NAME : envVars.DB_NAME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    shopRefreshExpirationDays: envVars.JWT_SHOP_REFRESH_EXPIRATION_DAYS,
  }
};

export default config