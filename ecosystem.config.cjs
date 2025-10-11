// ecosystem.config.cjs
// PM2 app definitions for your three jobs.
// Uses tsx to run TypeScript files and cron to schedule the backfills.

const CLEAN_PATH = "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin";

module.exports = {
  apps: [
    // 1) Long-running maintainer: prints heartbeat JSON lines continuously
    {
      name: "maintain-jobs",
      cwd: __dirname,
      script: "./node_modules/.bin/tsx",
      args: ["-r", "dotenv/config", "scripts/maintain-jobs.ts"],
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      restart_delay: 5000,
      time: true,
      watch: false,
      env: {
        FILL_AGE_HOURS: "12",
        FILL_DAYS: "1-5",
        FILL_ALLOW_LAST_SLOT: "true",
        FILL_CHANCE: "0.15",
        FILL_MAX_PER_RUN: "1",
        FILL_BHOURS: "09-17",
        TZ: "America/Los_Angeles",
        PATH: CLEAN_PATH,
      },
    },

    // 2) Backfill titles every 15 minutes (cron-only; exits after run)
    {
      name: "backfill-titles",
      cwd: __dirname,
      script: "./node_modules/.bin/tsx",
      // DO NOT pass "--silent" (Node will error: "bad option: --silent")
      args: ["-r", "dotenv/config", "scripts/backfill-titles.ts"],
      exec_mode: "fork",
      instances: 1,
      autorestart: false,
      cron_restart: "*/15 * * * *",
      time: true,
      watch: false,
      env: {
        TITLE_BATCH: "25",
        PATH: CLEAN_PATH,
      },
    },

    // 3) Backfill local copy every 30 minutes (cron-only; exits after run)
    {
      name: "backfill-local-copy",
      cwd: __dirname,
      script: "./node_modules/.bin/tsx",
      args: ["-r", "dotenv/config", "scripts/backfill-local-copy.ts"],
      exec_mode: "fork",
      instances: 1,
      autorestart: false,
      cron_restart: "*/30 * * * *",
      time: true,
      watch: false,
      env: {
        COPY_FIELDS: "summary,description",
        COPY_BATCH: "50",
        PATH: CLEAN_PATH,
      },
    },
  ],
};
