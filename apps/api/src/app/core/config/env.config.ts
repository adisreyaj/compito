import { object, string } from 'joi';
export const ENV_VALIDATION_SCHEMA = object({
  DATABASE_URL: string(),
  NODE_ENV: string().valid('development', 'production', 'test', 'provision').default('development'),
  ADMIN_PASS: string(),
  // Auth0 configs
  AUTH0_AUDIENCE: string(),
  AUTH0_ISSUER_URL: string()
    .uri({
      scheme: 'https',
    })
    .regex(/auth0.com/),
  AUTH0_DB: string(),
  AUTH0_DOMAIN: string()
    .domain()
    .regex(/auth0.com/),
  AUTH0_CLIENT_ID: string(),
  AUTH0_CLIENT_SECRET: string(),
  AUTH0_MANAGEMENT_TOKEN: string(),
  // Session token from Auth0 Action
  SESSION_TOKEN_SECRET: string(),
  // File Storage S3 object storage
  FILE_STORAGE_ACCESS_SECRET: string(),
  FILE_STORAGE_ACCESS_KEY: string(),
  FILE_STORAGE_URI: string(),
  BUCKET: string(),
  // Sentry error tracking
  SENTRY_API_DSN: string()
    .uri({ scheme: 'https' })
    .regex(/sentry.io/),
  SENTRY_RELEASE: string(),
});
