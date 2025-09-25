import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

const landingDatabaseUrl = process.env.LANDING_DATABASE_URL;

if (!landingDatabaseUrl) {
  console.warn(
    "LANDING_DATABASE_URL is not set. Falling back to in-memory storage for development.",
  );
}

export const pool = landingDatabaseUrl
  ? new Pool({ connectionString: landingDatabaseUrl })
  : undefined;

export const db = landingDatabaseUrl
  ? drizzle({ client: pool!, schema })
  : undefined;