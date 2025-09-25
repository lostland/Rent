import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const landingDatabaseUrl = process.env.LANDING_DATABASE_URL;

if (!landingDatabaseUrl) {
  throw new Error(
    "LANDING_DATABASE_URL must be set. Did you forget to provision the landing page database?",
  );
}

export const pool = new Pool({ connectionString: landingDatabaseUrl });
export const db = drizzle({ client: pool, schema });