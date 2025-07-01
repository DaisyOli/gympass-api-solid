import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)
// validate the env

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables') // stop the app if the env is invalid
}

export const env = _env.data
