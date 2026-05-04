import { neon } from '@neondatabase/serverless';

// We use a dummy connection string during build time to prevent Next.js 
// from crashing if the DATABASE_URL is not yet injected by Railway.
// It will use the real DATABASE_URL at runtime.
const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@ep-dummy.aws.neon.tech/neondb?sslmode=require";

export const sql = neon(connectionString);
