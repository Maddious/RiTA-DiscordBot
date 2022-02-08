// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable sort-keys */
/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
/* eslint-disable no-undef */
const autoTranslate = require("./auto");
const Sequelize = require("sequelize");
const logger = require("./logger");
const Op = Sequelize.Op;
let dbNewPrefix = "";
const server_obj = {};
exports.server_obj = server_obj;

// ----------------------
// Database Auth Process
// ----------------------

// console.log("DEBUG: Pre Stage Database Auth Process");
const db = process.env.DATABASE_URL.endsWith(".db") ?
   new Sequelize({
      logging: false,
      "dialect": "sqlite",
      "dialectOptions": {
         "ssl": {
            "require": true,
            "rejectUnauthorized": false
         },
         acquireTimeout: 60000
      },
      "storage": process.env.DATABASE_URL
   }) :
   new Sequelize(
      process.env.DATABASE_URL,
      {
         logging: false,
         "dialectOptions": {
            "ssl": {
               "require": true,
               "rejectUnauthorized": false
            },
            acquireTimeout: 60000,
            pool: {
               max: 30,
               min: 0
            }
         }
      }
   );

db.
   authenticate().
   then(() =>
   {

      logger(
         "dev",
         `----------------------------------------\nSuccessfully connected to database`
      );

   }).
   catch((err) =>
   {

      logger(
         "error",
         err
      );

   });

// ---------------------------------
// Database stats table definition
// ---------------------------------

// console.log("DEBUG: Pre Stage Database stats table definition");
const Stats = db.define(
   "stats",
   {
      "id": {
         "type": Sequelize.STRING(32),
         "primaryKey": true,
         "unique": true,
         "allowNull": false
      },
      "message": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "translation": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "embedon": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "embedoff": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "images": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "gif": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "react": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      }
   }
);

// ---------------------------------
// Database server table definition
// ---------------------------------

// console.log("DEBUG: Pre Stage Database server table definition");
const Servers = db.define(
   "servers",
   {
      "id": {
         "type": Sequelize.STRING(32),
         "primaryKey": true,
         "unique": true,
         "allowNull": false
      },
      "servername": Sequelize.STRING(255),
      "prefix": {
         "type": Sequelize.STRING(32),
         "defaultValue": "!tr"
      },
      "lang": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      },
      "count": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "active": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "embedstyle": {
         "type": Sequelize.STRING(8),
         "defaultValue": "on"
      },
      "bot2botstyle": {
         "type": Sequelize.STRING(8),
         "defaultValue": "off"
      },
      "webhookid": Sequelize.STRING(32),
      "webhooktoken": Sequelize.STRING(255),
      "webhookactive": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "blacklisted": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "whitelisted": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "warn": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "invite": {
         "type": Sequelize.STRING(255),
         "defaultValue": "Not yet Created"
      },
      "announce": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "menupersist": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "flag": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "flagpersist": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "reactpersist": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "langdetect": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": false
      },
      "servertags": {
         "type": Sequelize.STRING(8),
         "defaultValue": "none"
      },
      "owner": {
         "type": Sequelize.STRING(255),
         "defaultValue": "Unknown"
      },
      "errorcount": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "warncount": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      },
      "ejectcount": {
         "type": Sequelize.INTEGER,
         "defaultValue": 0
      }
   }
);

// --------------------------------
// Database tasks table definition
// --------------------------------

// console.log("DEBUG: Pre Stage Database tasks table definition");
const Tasks = db.define(
   "tasks",
   {
      "origin": Sequelize.STRING(32),
      "dest": Sequelize.STRING(32),
      "reply": Sequelize.STRING(32),
      "server": Sequelize.STRING(32),
      "active": {
         "type": Sequelize.BOOLEAN,
         "defaultValue": true
      },
      "LangTo": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      },
      "LangFrom": {
         "type": Sequelize.STRING(8),
         "defaultValue": "en"
      }
   },
   {
      "indexes": [
         {
            "unique": true,
            "name": "ux_index_1",
            "fields": [
               "origin",
               "dest",
               "LangTo",
               "LangFrom"
            ]
         }
      ]
   }
);

// -------------------
// Init/create tables
// -------------------

// eslint-disable-next-line require-await
exports.initializeDatabase = async function initializeDatabase (client)
{

   // console.log("DEBUG: Stage Init/create tables - Pre Sync");
   db.sync({logging: false}).then(async () =>
   {

      // eslint-disable-next-line init-declarations
      let guild;

      await Stats.upsert({logging: false,
         "id": "bot"});
      await this.updateColumns();
      // console.log("DEBUG: New columns should be added Before this point.");
      await Servers.upsert({logging: false,
         "id": "bot",
         "lang": "en"});
      db.getQueryInterface().removeIndex(
         "tasks",
         "tasks_origin_dest",
         {logging: false}
      );
      const guilds = client.guilds.cache.array().length;
      const guildsArray = client.guilds.cache.array();
      let i = 0;
      // console.log("DEBUG: Active Check all Active Guilds");
      for (i = 0; i < guilds; i += 1)
      {

         guild = guildsArray[i];
         const guildID = guild.id;
         // eslint-disable-next-line no-await-in-loop
         await Stats.upsert({"id": guildID,
            logging: false});
         Servers.findAll({logging: false,
            "where": {"id": guildID}}).then((projects) =>
         {

            if (projects.length === 0)
            {

               // console.log("DEBUG: Add Server");
               Servers.upsert({logging: false,
                  "id": guildID,
                  "lang": "en",
                  "active": true});
               Stats.upsert({logging: false,
                  "id": guildID});

            }
            // console.log("DEBUG: Active Check all Active Guilds");
            Servers.upsert({logging: false,
               "id": guildID,
               "active": true});

         });

      }
      // console.log("DEBUG: Stage Init/create tables - Pre servers FindAll");
      const serversFindAll = await Servers.findAll({logging: false});
      // {
      for (let i = 0; i < serversFindAll.length; i += 1)
      {

         // eslint-disable-next-line prefer-const
         const guild_id = serversFindAll[i].id;
         // eslint-disable-next-line eqeqeq
         if (guild_id != "bot")
         {

            server_obj[guild_id] = {"db": serversFindAll[i]};

         }

      }
      // console.log("DEBUG: Stage Init/create tables - Pre guildClient");
      const guildClient = Array.from(client.guilds.cache.values());
      for (let i = 0; i < guildClient.length; i += 1)
      {

         guild = guildClient[i];
         server_obj[guild.id].guild = guild;
         server_obj[guild.id].size = guild.memberCount;
         if (!server_obj.size)
         {

            server_obj.size = 0;

         }
         server_obj.size += guild.memberCount;

      }
      console.log("----------------------------------------\nDatabase fully initialized.\n----------------------------------------");
      // });

   });

};

// -----------------------
// Add Server to Database
// -----------------------

exports.addServer = async function addServer (id, lang)
{

   // console.log("DEBUG: Stage Add Server to Database");
   server_obj[id] = {
      "db": {
         "embedstyle": "on",
         "bot2botstyle": "off",
         id,
         "webhookid": null,
         "webhooktoken": null,
         "prefix": "!tr"
      }
   };
   await Servers.findAll({logging: false,
      "where": {id}}).then((server) =>
   {

      if (server.length === 0)
      {

         Servers.create({
            id,
            lang,
            "prefix": "!tr"
         }).catch((err) => console.log("VALIDATION: Server Already Exists in Servers Table"));
         Stats.create({logging: false,
            id}).catch((err) => console.log("VALIDATION: Server Already Exists in Stats Table"));

      }

   });

};

// ------------------------
// Add server member count
// ------------------

exports.servercount = function servercount (guild)
{

   server_obj.size += guild.memberCount;

};

// -------------------------------
// Update Embedded Variable in DB
// -------------------------------

exports.updateEmbedVar = function updateEmbedVar (id, embedstyle, _cb)
{

   // console.log("DEBUG: Stage Update Embedded Variable in DB");
   server_obj[id].db.embedstyle = embedstyle;
   return Servers.update(
      {embedstyle},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// ------------------------------
// Update Bot2Bot Variable In DB
// ------------------------------

exports.updateBot2BotVar = function updateBot2BotVar (id, bot2botstyle, _cb)
{

   // console.log("DEBUG: Stage Update Bot2Bot Variable In DB");
   server_obj[id].db.bot2botstyle = bot2botstyle;
   return Servers.update(
      {bot2botstyle},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------------------------------
// Update webhookID & webhookToken Variable In DB
// -----------------------------------------------

exports.updateWebhookVar = function updateWebhookVar (id, webhookid, webhooktoken, webhookactive, _cb)
{

   // console.log("DEBUG: Stage Update webhookID & webhookToken Variable In DB");
   return Servers.update(
      {webhookid,
         webhooktoken,
         webhookactive},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// --------------
// Update prefix
// --------------

exports.updatePrefix = function updatePrefix (id, prefix, _cb)
{

   // console.log("DEBUG: Stage Update prefix");
   dbNewPrefix = prefix;
   server_obj[id].db.prefix = dbNewPrefix;
   return Servers.update(
      {prefix},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------
// Update Server Variable
// -----------------------

exports.updateServerTable = function updateServerTable (id, columnName, value, _cb)
{

   // console.log(`DEBUG: ID: ${id} - Name: ${columnName} - Value: ${value}`);
   return Servers.update(
      {[`${columnName}`]: value},
      {"where": {id}}
   ).then(function update ()
   {

      _cb();

   });

};

// -----------------------------
// Add Missing Variable Columns
// -----------------------------

exports.updateColumns = async function updateColumns ()
{

   // console.log("DEBUG: Checking Missing Variable Columns for old RITA release");
   // For older version of RITA, they need to upgrade DB with adding new columns if needed
   const serversDefinition = await db.getQueryInterface().describeTable("servers");
   await this.addTableColumn("servers", serversDefinition, "prefix", Sequelize.STRING(32), "!tr");
   await this.addTableColumn("servers", serversDefinition, "embedstyle", Sequelize.STRING(8), "on");
   await this.addTableColumn("servers", serversDefinition, "bot2botstyle", Sequelize.STRING(8), "off");
   await this.addTableColumn("servers", serversDefinition, "webhookid", Sequelize.STRING(32));
   await this.addTableColumn("servers", serversDefinition, "webhooktoken", Sequelize.STRING(255));
   await this.addTableColumn("servers", serversDefinition, "webhookactive", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "blacklisted", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "whitelisted", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "warn", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "invite", Sequelize.STRING(255), "Not yet Created");
   await this.addTableColumn("servers", serversDefinition, "announce", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "menupersist", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "owner", Sequelize.STRING(255), "Unknown");
   await this.addTableColumn("servers", serversDefinition, "errorcount", Sequelize.INTEGER, 0);
   await this.addTableColumn("servers", serversDefinition, "warncount", Sequelize.INTEGER, 0);
   await this.addTableColumn("servers", serversDefinition, "ejectcount", Sequelize.INTEGER, 0);
   await this.addTableColumn("servers", serversDefinition, "flag", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "reactpersist", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "langdetect", Sequelize.BOOLEAN, false);
   await this.addTableColumn("servers", serversDefinition, "flagpersist", Sequelize.BOOLEAN, true);
   await this.addTableColumn("servers", serversDefinition, "servername", Sequelize.STRING(255));
   await this.addTableColumn("servers", serversDefinition, "servertags", Sequelize.STRING(8), "none");
   // console.log("DEBUG: All Columns Checked or Added");

   // For older version of RITA, must remove old unique index
   // console.log("DEBUG: Stage Remove old RITA Unique index");
   await db.getQueryInterface().removeIndex("tasks", "tasks_origin_dest");
   // console.log("DEBUG: All old index removed");

};

// ------------------------------------
// Adding a column in DB if not exists
// ------------------------------------
exports.addTableColumn = async function addTableColumn (tableName, tableDefinition, columnName, columnType, columnDefault)
{

   // Adding column only when it's not in table definition
   if (!tableDefinition[`${columnName}`])
   {

      console.log(`--> Adding ${columnName} column`);
      if (columnDefault === null)
      {

         // Adding column whithout a default value
         await db.getQueryInterface().addColumn(tableName, columnName, {"type": columnType});

      }
      else
      {

         // Adding column with a default value
         await db.getQueryInterface().addColumn(tableName, columnName, {"type": columnType,
            "defaultValue": columnDefault});

      }

   }

};

// ------------------
// Get Channel Tasks
// ------------------

// eslint-disable-next-line consistent-return
exports.channelTasks = function channelTasks (data)
{

   // console.log("DEBUG: Stage Get Channel Tasks");
   let id = data.message.channel.id;
   if (data.message.channel.type === "dm")
   {

      // console.log("DEBUG: Line 609 - DB.js");
      id = `@${data.message.author.id}`;

   }
   try
   {

      // eslint-disable-next-line no-unused-vars
      const taskList = Tasks.findAll({logging: false,
         "where": {"origin": id,
            "active": true}}).then(function res (result)
      {

         data.rows = result;
         return autoTranslate(data);

      });

   }
   catch (e)
   {

      logger(
         "error",
         e
      );
      data.err = e;
      return autoTranslate(data);

   }

};

// ------------------------------
// Get tasks for channel or user
// ------------------------------

exports.getTasks = function getTasks (origin, dest, cb)
{

   // console.log("DEBUG: Stage Get tasks for channel or user");
   if (dest.includes("@"))
   {

      return Tasks.findAll(
         {"where": {dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   return Tasks.findAll(
      {"where": {origin}},
      {"raw": true}
   ).then(function res (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// --------------------------------
// Check if dest is found in tasks
// --------------------------------

exports.checkTask = function checkTask (origin, dest, eh, cb)
{

   // console.log("DEBUG: Stage Check if dest is found in tasks");
   if (dest === "all")
   {

      return Tasks.findAll(
         {"where": {origin}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (dest === "id")
   {

      return Tasks.findAll(
         {"where": {"id": origin}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (eh === "o")
   {

      return Tasks.findAll(
         {"where": {"server": origin,
            "origin": dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   if (eh === "d")
   {

      return Tasks.findAll(
         {"where": {"server": origin,
            dest}},
         {"raw": true}
      ).then(function res (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   return Tasks.findAll(
      {"where": {origin,
         dest}},
      {"raw": true}
   ).then(function res (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// --------------------
// Remove Channel Task
// --------------------

exports.removeTask = function removeTask (origin, dest, cb)
{

   // console.log("DEBUG: Stage Remove Channel Task");
   if (dest === "all")
   {

      // console.log("DEBUG: removeTask() - all");
      return Tasks.destroy({"where": {[Op.or]: [
         {origin},
         // !!!DO NOT REMOVE!!! The next line is what deletes tasks for channels that get deleted! !!!DO NOT REMOVE!!!
         {"dest": origin}
      ]}}).then(function error (result, err)
      {

         cb(
            err,
            result
         );

      });

   }
   return Tasks.destroy({"where": {[Op.or]: [
      {origin,
         dest}
   ]}}).then(function error (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// ------------------
// Remove Task by ID
// ------------------

exports.removeTaskID = function removeTaskID (id, cb)
{

   // console.log("DEBUG: Stage Remove Task by ID");
   Tasks.destroy({"where": {id,
      "active": true}}).then(function error (result, err)
   {

      cb(
         err,
         result
      );

   });

};

// ---------------
// Get Task Count
// ---------------

exports.getTasksCount = function getTasksCount (origin, cb)
{

   // console.log("DEBUG: Get Task Count");
   return Tasks.count({"where": {origin}}).then((c) =>
   {

      cb(
         "",
         c
      );

   });

};

// ------------------
// Get Servers Count
// ------------------

exports.getServersCount = function getServersCount ()
{

   // console.log("DEBUG: Stage Get Servers Count");
   return server_obj.length();

};

// ---------
// Add Task
// ---------

exports.addTask = function addTask (task)
{

   // console.log("DEBUG: Stage Add Task");
   task.dest.forEach((dest) =>
   {

      Tasks.upsert({
         "origin": task.origin,
         dest,
         "reply": task.reply,
         "server": task.server,
         "active": true,
         "LangTo": task.to,
         "LangFrom": task.from
      }).
         catch((err) =>
         {

            logger(
               "error",
               err,
               "db",
               task.server
            );

         });

   });

};

// -------------
// Update stats
// -------------

// Increase the count in Servers table
exports.increaseServersCount = function increaseServersCount (col, id)
{

   // console.log("DEBUG: Stage Update count in Servers table");
   return Servers.increment(
      col,
      {logging: false,
         "where": {id}}
   );

};

exports.increaseStatsCount = function increaseStatsCount (col, id)
{

   // console.log("DEBUG: Stage Update counts in stats table");
   return Stats.increment(
      col,
      {logging: false,
         "where": {id}},
   );

};

// --------------
// Get bot stats
// --------------

exports.getStats = function getStats (callback)
{

   // console.log("DEBUG: Stage Get bot stats");
   return db.query(
      `select * from (select sum(count) as "totalCount", ` +
  `count(id)-1 as "totalServers" from servers) as table1, ` +
  `(select count(id)-1 as "activeSrv" from servers where active = TRUE) as table2, ` +
  `(select lang as "botLang" from servers where id = 'bot') as table3, ` +
  `(select count(distinct origin) as "activeTasks" ` +
  `from tasks where active = TRUE) as table4, ` +
  `(select count(distinct dest) as "activeUserTasks" ` +
  `from tasks where active = TRUE and dest like '@%') as table5,` +
  `(select * from stats where id = 'bot') as table6;`,
      {"type": Sequelize.QueryTypes.SELECT},
   ).
      then(
         (result) => callback(result),
         (err) => logger(
            "error",
            `${err}\nQuery: ${err.sql}`,
            "db"
         )
      );

};

// ----------------
// Get server info
// ----------------

exports.getServerInfo = function getServerInfo (id, callback)
{

   // console.log("DEBUG: Stage Get server info");
   return db.query(`select * from (select count as "count",` +
   `lang as "lang" from servers where id = ?) as table1,` +
   `(select count(distinct origin) as "activeTasks"` +
   `from tasks where server = ?) as table2,` +
   `(select count(distinct dest) as "activeUserTasks"` +
   `from tasks where dest like '@%' and server = ?) as table3, ` +
   `(select * from stats where id = ?) as table4, ` +
   `(select * from servers where id = ?) as table5; `, {"replacements": [ id, id, id, id, id],
      "type": db.QueryTypes.SELECT}).
      then(
         (result) => callback(result),
         (err) => this.updateColumns()
      );

};

// ---------
// Close DB
// ---------

exports.close = function close ()
{

   // console.log("DEBUG: Stage Close DB");
   return db.close();

};
