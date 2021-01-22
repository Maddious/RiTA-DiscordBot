---
name: Bug report - embedstyle Bug
about: This bug report is for tracking the TypeError Cannot read property 'embedstyle'
  of undefined weeoe ONLY, Please do not use it for anything else.
title: 'TypeError: Cannot read property ''embedstyle'' of undefined'
labels: TypeError
assignees: ZyC0R3

---

**Please ensure you follow the Below Steps fully.**
1. Make sure you have set up a web hook channel on your server. 
    * You can set up debugging Webhooks using the following steps
        * Create a new channel on your server to receive the Webhooks, let's say #Webhooks.
        * Go to Server Settings -> Webhooks -> Create Webhook. Select the #Webhooks channel, then copy the Webhook's URL. It will look something like https://discordapp.com/api/webhooks/012345678901234567/VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL
        * In the Settings tab of your Heroku app add the following Config Variables (values extracted from your URL):
            DISCORD_DEBUG_WEBHOOK_ID : 012345678901234567
            DISCORD_DEBUG_WEBHOOK_TOKEN : VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL
2. Restart All Dyno's in Heroku
    *  Go to https://dashboard.heroku.com/apps and select your bot.
    *  In the top right of the page select "More" and then "Restart all dynos"
3. Once this is done, And your bot is back online, run the following commands on your discord server
    * !t settings dbfix
    * !t settings updatedb
Note: They need to be ran in the correct order. 

**IF THIS HAS NOT WORKED THEN PLEASE PROVIDE  A FULL LOG**

**Example *(Delete Below this line and paste your own log)***

```2021-01-22T01:56:46.546377+00:00 app[worker.1]: Executing (default): SELECT 1+1 AS result
2021-01-22T01:56:46.905456+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.905499+00:00 app[worker.1]: @RITA Bot is now online
2021-01-22T01:56:46.905499+00:00 app[worker.1]: V.1.2.1-7 | ID: 693296012378374225
2021-01-22T01:56:46.905500+00:00 app[worker.1]: Made by: Collaboration
2021-01-22T01:56:46.905500+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.911505+00:00 app[worker.1]: Shard#0:  1 / 1 online - 3 guilds, 153 channels, 2 users
2021-01-22T01:56:46.912930+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.912930+00:00 app[worker.1]: All shards are online, running intervals
2021-01-22T01:56:46.912930+00:00 app[worker.1]: ----------------------------------------
2021-01-22T01:56:46.923688+00:00 app[worker.1]: Executing (default): CREATE TABLE IF NOT EXISTS "servers" ("id" VARCHAR(32) NOT NULL UNIQUE , "lang" VARCHAR(8) DEFAULT 'en', "count" INTEGER DEFAULT 0, "active" BOOLEAN DEFAULT true, "embedstyle" VARCHAR(8) DEFAULT 'on', "bot2botstyle" VARCHAR(8) DEFAULT 'off', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
2021-01-22T01:56:46.934117+00:00 app[worker.1]: Executing (default): CREATE TABLE IF NOT EXISTS "tasks" ("id"   SERIAL , "origin" VARCHAR(32), "dest" VARCHAR(32), "reply" VARCHAR(32), "server" VARCHAR(32), "active" BOOLEAN DEFAULT true, "LangTo" VARCHAR(8) DEFAULT 'en', "LangFrom" VARCHAR(8) DEFAULT 'en', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
2021-01-22T01:56:46.938663+00:00 app[worker.1]: Executing (default): INSERT INTO "servers" ("id","lang","count","active","embedstyle","bot2botstyle","createdAt","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT ("id") DO UPDATE SET "id"=EXCLUDED."id","lang"=EXCLUDED."lang","updatedAt"=EXCLUDED."updatedAt" RETURNING "id","lang","count","active","embedstyle","bot2botstyle","createdAt","updatedAt";
2021-01-22T01:56:46.947442+00:00 app[worker.1]: Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'servers' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
2021-01-22T01:56:46.957765+00:00 app[worker.1]: Executing (default): SELECT i.relname AS name, ix.indisprimary AS primary, ix.indisunique AS unique, ix.indkey AS indkey, array_agg(a.attnum) as column_indexes, array_agg(a.attname) AS column_names, pg_get_indexdef(ix.indexrelid) AS definition FROM pg_class t, pg_class i, pg_index ix, pg_attribute a WHERE t.oid = ix.indrelid AND i.oid = ix.indexrelid AND a.attrelid = t.oid AND t.relkind = 'r' and t.relname = 'tasks' GROUP BY i.relname, ix.indexrelid, ix.indisprimary, ix.indisunique, ix.indkey ORDER BY i.relname;
2021-01-22T01:56:47.096353+00:00 app[worker.1]: Rita Managment Server - 545787876105912341
2021-01-22T01:57:15.380039+00:00 app[worker.1]: Rita Managment Server - 545787876105912341
2021-01-22T01:57:15.459951+00:00 app[worker.1]: Executing (default): SELECT "id", "origin", "dest", "reply", "server", "active", "LangTo", "LangFrom", "createdAt", "updatedAt" FROM "tasks" AS "tasks" WHERE "tasks"."origin" = '755900727028744232' AND "tasks"."active" = true;
2021-01-22T01:57:16.146064+00:00 app[worker.1]: Guild ID from message
2021-01-22T01:57:16.146181+00:00 app[worker.1]: Raw = 545787876105912341
2021-01-22T01:57:16.146276+00:00 app[worker.1]: Const = 545787876105912341
2021-01-22T01:57:16.146324+00:00 app[worker.1]: ---------------------
2021-01-22T01:57:16.146461+00:00 app[worker.1]: db.set Stage 1 = 
2021-01-22T01:57:16.147222+00:00 app[worker.1]: db.set Stage 2 = 
2021-01-22T01:57:16.155957+00:00 app[worker.1]: Executing (default): UPDATE "servers" SET "count"="count"+ 1,"updatedAt"='2021-01-22 01:57:16.139 +00:00' WHERE "id" = '545787876105912341' RETURNING *
2021-01-22T01:57:16.159915+00:00 app[worker.1]: Executing (default): select * from (select embedstyle as "embedstyle" from servers where id = '545787876105912341') as table1```
