import * as Joi from 'joi';

export const ENV_VALIDATION_SCHEMA = Joi.object({
  DATABASE_URL: Joi.string(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  ADMIN_PASS: Joi.string(),
  // Auth0 configs
  AUTH0_AUDIENCE: Joi.string(),
  AUTH0_ISSUER_URL: Joi.string()
    .uri({
      scheme: 'https',
    })
    .regex(/auth0.com/),
  AUTH0_DB: Joi.string(),
  AUTH0_DOMAIN: Joi.string()
    .domain()
    .regex(/auth0.com/),
  AUTH0_CLIENT_ID: Joi.string(),
  AUTH0_CLIENT_SECRET: Joi.string(),
  AUTH0_MANAGEMENT_TOKEN: Joi.string(),
  // Session token from Auth0 Action
  SESSION_TOKEN_SECRET: Joi.string(),
  // File Storage S3 object storage
  FILE_STORAGE_ACCESS_SECRET: Joi.string(),
  FILE_STORAGE_ACCESS_KEY: Joi.string(),
  FILE_STORAGE_URI: Joi.string(),
  BUCKET: Joi.string(),
  // Sentry error tracking
  SENTRY_API_DSN: Joi.string()
    .uri({ scheme: 'https' })
    .regex(/sentry.io/),
  SENTRY_RELEASE: Joi.string(),
});
