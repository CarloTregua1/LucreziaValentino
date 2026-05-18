#!/usr/bin/env node
/**
 * Reads .env.local and pushes every variable to Vercel
 * (production + preview + development).
 *
 * Usage:
 *   npm i -g vercel
 *   vercel login
 *   vercel link        (select your project)
 *   node scripts/push-env-to-vercel.mjs
 */

import { execFileSync } from "child_process";
import { readFileSync, existsSync } from "fs";

const ENV_FILE = ".env.local";
const ENVIRONMENTS = ["production", "preview", "development"];

if (!existsSync(ENV_FILE)) {
  console.error(`❌  ${ENV_FILE} not found. Copy .env.example → .env.local and fill in your values.`);
  process.exit(1);
}

const lines = readFileSync(ENV_FILE, "utf-8").split("\n");

let added = 0;
let skipped = 0;

for (const raw of lines) {
  const line = raw.trim();

  // skip comments and empty lines
  if (!line || line.startsWith("#")) continue;

  const eqIdx = line.indexOf("=");
  if (eqIdx === -1) continue;

  const key = line.slice(0, eqIdx).trim();
  const value = line.slice(eqIdx + 1).trim();

  if (!key || !value) {
    console.log(`⏭   Skipping ${key} (no value)`);
    skipped++;
    continue;
  }

  for (const env of ENVIRONMENTS) {
    try {
      execFileSync(
        "vercel",
        ["env", "add", key, env],
        {
          input: value,
          stdio: ["pipe", "pipe", "pipe"],
          encoding: "utf-8",
        }
      );
      console.log(`✓  ${key} → ${env}`);
    } catch (err) {
      const stderr = err.stderr ?? "";
      if (stderr.includes("already exists") || stderr.includes("already set")) {
        console.log(`↩  ${key} → ${env} (already exists, skipped)`);
      } else {
        console.error(`✗  ${key} → ${env} failed:`, stderr.trim() || err.message);
      }
    }
  }

  added++;
}

console.log(`\nDone. ${added} variable(s) processed, ${skipped} skipped.`);
