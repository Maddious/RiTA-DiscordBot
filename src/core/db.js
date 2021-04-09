// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const autoTranslate = require("./auto");
const Sequelize = require("sequelize");
const logger = require("./logger");
const Op = Sequelize.Op;
var dbEmbedValue ="";
var dbBot2BotValue ="";
var dbWebhookIDValue ="";
var dbWebhookTokenValue ="";

// ----------------------
// Database Auth Process
// ----------------------

const db = process.env.DATABASE_URL.endsWith(".db") ?
   new Sequelize({
      dialect: "sqlite",
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false
         }
      },
      storage: process.env.DATABASE_URL
   }) :
   new Sequelize(process.env.DATABASE_URL, {
      logging: console.log,
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false
         }
      }
      //logging: null,
   });

db
   .authenticate()
   .then(() =>
   {
      logger("dev","Successfully connected to database");
   })
   .catch(err =>
   {
      logger("error", err);
   });

// ---------------------------------
// Database server table definition
// ---------------------------------

const Servers = db.define("servers", {
   id: {
      type: Sequelize.STRING(32),
      primaryKey: true,
      unique: true,
      allowNull: false
   },
   lang: {
      type: Sequelize.STRING(8),
      defaultValue: "en"
   },
   count: {
      type: Sequelize.INTEGER,
      defaultValue: 0
   },
   active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
   },
   embedstyle: {
      type: Sequelize.STRING(8),
      defaultValue: "on"
   },
   bot2botstyle: {
      type: Sequelize.STRING(8),
      defaultValue: "off"
   },
   webhookID: Sequelize.STRING(32),
   webhookToken: Sequelize.STRING(255),
   webhookActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
   }
});

// --------------------------------
// Database tasks table definition
// --------------------------------

const Tasks = db.define("tasks", {
   origin: Sequelize.STRING(32),
   dest: Sequelize.STRING(32),
   reply: Sequelize.STRING(32),
   server: Sequelize.STRING(32),
   active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
   },
   LangTo: {
      type: Sequelize.STRING(8),
      defaultValue: "en"
   },
   LangFrom: {
      type: Sequelize.STRING(8),
      defaultValue: "en"
   }
},
{
   indexes: [
      {
         unique: true,
         fields: ["origin", "dest"]
      }
   ]
});

// ---------------------------------
// Database debug table definition
// ---------------------------------

const Debuggers = db.define("debugger", {
   id: {
      type: Sequelize.STRING(32),
      primaryKey: true,
      unique: true,
      allowNull: false
   },
   dest: Sequelize.STRING(32),
   webhookID: Sequelize.STRING(32),
   webhookToken: Sequelize.STRING(32),
   active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
   }
});

// -------------------
// Init/create tables
// -------------------

exports.initializeDatabase = function(client)
{
   db.sync({ logging: console.log }).then(() =>
   {
      Servers.upsert({ id: "bot",
         lang: "en" });
      exports.updateColumns();
      const guilds = client.guilds.array().length;
      const guildsArray = client.guilds.array();
      var i;
      for (i = 0; i < guilds; i++)
      {
         const guild = guildsArray[i];
         const guildID = guild.id;
         Servers.findAll({ where: { id: guildID } }).then(projects =>
         {
            if (projects.length === 0)
            {
               Servers.upsert({ id: guildID,
                  lang: "en" });
            }
         });
         Debuggers.findAll({ where: { id: guildID } }).then(projects =>
         {
            if (projects.length === 0)
            {
               Debuggers.upsert({ id: guildID});
            }
         });
      }
      console.log("----------------------------------------\nDatabase fully initialized.\n----------------------------------------");
   });
};
// -----------------------
// Add Server to Database
// -----------------------

exports.addServer = function(id, lang)
{
   return Servers.create({
      id: id,
      lang: lang
   });
};

// -----------------------
// Add debugger to Database
// -----------------------

exports.addDebugger = function(id)
{
   return Debuggers.create({
      id: id
   });
};

// ------------------
// Deactivate Server
// ------------------

exports.removeServer = function(id)
{
   return Servers.update({ active: false }, { where: { id: id } }).then(
      function (err, _result)
      {
         logger("error", err);
      });
};

// -------------------
// Update Server Lang
// -------------------

exports.updateServerLang = function(id, lang, _cb)
{
   return Servers.update({ lang: lang }, { where: { id: id } }).then(
      function ()
      {
         _cb();
      });
};

// -------------------------------
// Update Embedded Variable in DB
// -------------------------------

exports.updateEmbedVar = function(id, embedstyle, _cb)
{
   dbEmbedValue = embedstyle;
   return Servers.update({ embedstyle: embedstyle }, { where: { id: id } }).then(
      function ()
      {
         _cb();
      });
};

// ------------------------------
// Get Embedded Variable From DB
// ------------------------------

exports.getEmbedVar = async function run(id)
{
   var value = await db.query(`select * from (select embedstyle as "embedstyle" from servers where id = ?) as table1`, { replacements: [id],
      type: db.QueryTypes.SELECT});
   dbEmbedValue = value[0].embedstyle;
   return this.setEmbedVar();
};

// -------------------------------------------
// Call Saved Embedded Variable Value From DB
// -------------------------------------------

module.exports.setEmbedVar = function(data)
{
   return dbEmbedValue;
};


// ------------------------------
// Update Bot2Bot Variable In DB
// ------------------------------

exports.updateBot2BotVar = function(id, bot2botstyle, _cb)
{
   dbBot2BotValue = bot2botstyle;
   return Servers.update({ bot2botstyle: bot2botstyle }, { where: { id: id } }).then(
      function ()
      {
         _cb();
      });
};

// -----------------------------
// Get Bot2Bot Variable From DB
// -----------------------------

exports.getBot2BotVar = async function run(id)
{
   var value = await db.query(`select * from (select bot2botstyle as "bot2botstyle" from servers where id = ?) as table2`, { replacements: [id],
      type: db.QueryTypes.SELECT});
   dbBot2BotValue = value[0].bot2botstyle;
   return this.setBot2BotVar();
};

// ------------------------------------------
// Call Saved Bot2Bot Variable Value From DB
// ------------------------------------------

module.exports.setBot2BotVar = function(data)
{
   return dbBot2BotValue;
};

// -----------------------------------------------
// Update webhookID & webhookToken Variable In DB
// -----------------------------------------------

exports.updateWebhookVar = function(id, webhookID, webhookToken, webhookActive, _cb)
{
   dbWebhookIDValue = webhookID;
   dbWebhookTokenValue = webhookToken;
   return Servers.update({ webhookID: webhookID,
      webhookToken: webhookToken,
      webhookActive: webhookActive }, { where: { id: id } }).then(
      function ()
      {
         _cb();
      });
};

// ----------------------------------------------
// Get webhookID & webhookToken Variable From DB
// ----------------------------------------------

exports.getWebhookVar = async function run(id)
{
   var idValue = await db.query(`select * from (select webhookID as "webhookID" from servers where id = ?) as table2`, { replacements: [id],
      type: db.QueryTypes.SELECT});
   dbWebhookIDValue = idValue[0].webhookID;
   var tokenValue = await db.query(`select * from (select webhookToken as "webhookToken" from servers where id = ?) as table2`, { replacements: [id],
      type: db.QueryTypes.SELECT});
   dbWebhookTokenValue = tokenValue[0].webhookToken;

   return this.setWebhookVar(dbWebhookIDValue, dbWebhookTokenValue);
};

// -----------------------------------------------------------
// Call Saved webhookID & webhookToken Variable Value From DB
// -----------------------------------------------------------

module.exports.setWebhookVar = function(data)
{
   return; //I'M MISSING THE RETURN BIT, NOT SURE HOW OT SET THIS.
};

// -------------------
// Deactivate Webhook
// -------------------

exports.removeWebhook = function(id, _cb)
{
   return Servers.update({ webhookActive: false }, { where: { id: id } }).then(
      function ()
      {
         _cb();
      });
};

// -----------------------------
// Add Missing Variable Columns
// -----------------------------

exports.updateColumns = function(data)
{
   // Very sloppy code, neew to find a better fix.
   db.getQueryInterface().describeTable("servers").then(tableDefinition =>
   {
      if (!tableDefinition.embedstyle)
      {
         console.log("-------------> Adding embedstyle column");
         db.getQueryInterface().addColumn("servers", "embedstyle", {
            type: Sequelize.STRING(8),
            defaultValue: "on"});
      }
      if (!tableDefinition.bot2botstyle)
      {
         console.log("-------------> Adding bot2botstyle column");
         db.getQueryInterface().addColumn("servers", "bot2botstyle", {
            type: Sequelize.STRING(8),
            defaultValue: "off"});
      }
      if (!tableDefinition.webhookID)
      {
         console.log("-------------> Adding webhookID column");
         db.getQueryInterface().addColumn("servers", "webhookID", {
            type: Sequelize.STRING(32)});
      }
      if (!tableDefinition.webhookToken)
      {
         console.log("-------------> Adding webhookToken column");
         db.getQueryInterface().addColumn("servers", "webhookToken", {
            type: Sequelize.STRING(255)});
      }
      if (!tableDefinition.webhookActive)
      {
         console.log("-------------> Adding webhookActive column");
         db.getQueryInterface().addColumn("servers", "webhookActive", {
            type: Sequelize.BOOLEAN,
            defaultValue: false});
      }
   });
};

// ------------------
// Get Channel Tasks
// ------------------

exports.channelTasks = function(data)
{
   var id = data.message.channel.id;
   if (data.message.channel.type === "dm")
   {
      id = "@" + data.message.author.id;
   }
   try
   {
      const taskList = Tasks.findAll({ where: { origin: id,
         active: true }}).then(
         function (result)
         {
            data.rows = result;
            return autoTranslate(data);
         });
   }
   catch (e)
   {
      logger("error", e);
      data.err = e;
      return autoTranslate(data);
   }
};
// ------------------------------
// Get tasks for channel or user
// ------------------------------

exports.getTasks = function(origin, dest, cb)
{
   if (dest === "me")
   {
      return Tasks.findAll({ where: { origin: origin,
         dest: dest } }, {raw: true}).then(
         function (result, err)
         {
            cb(err, result);
         });
   }
   return Tasks.findAll({ where: { origin: origin } }, {raw: true}).then(
      function (result, err)
      {
         cb(err, result);
      });
};

// --------------------------------
// Check if dest is found in tasks
// --------------------------------

exports.checkTask = function(origin, dest, cb)
{
   if (dest === "all")
   {
      return Tasks.findAll({ where: { origin: origin } }, {raw: true}).then(
         function (result, err)
         {
            cb(err, result);
         });
   }
   return Tasks.findAll({ where: { origin: origin,
      dest: dest } }, {raw: true}).then(
      function (result, err)
      {
         cb(err, result);
      });
};

// --------------------
// Remove Channel Task
// --------------------

exports.removeTask = function(origin, dest, cb)
{
   console.log("removeTask()");
   if (dest === "all")
   {
      console.log("removeTask() - all");
      return Tasks.destroy({ where: { [Op.or]: [{ origin: origin },{ dest: origin }] } }).then(
         function (err, result)
         {
            cb(null, result);
         });
   }
   return Tasks.destroy({ where: { [Op.or]: [{ origin: origin,
      dest: dest },{ origin: dest,
      dest: origin }] } }).then(
      function (err, result)
      {
         cb(null, result);
      });
};

// ---------------
// Get Task Count
// ---------------

exports.getTasksCount = function(origin, cb)
{
   return Tasks.count({ where: {"origin": origin }}).then(c =>
   {
      cb("", c);
   });
};

// ------------------
// Get Servers Count
// ------------------

exports.getServersCount = function(cb)
{
   return Servers.count().then(c =>
   {
      cb("", c);
   });
};

// ---------
// Add Task
// ---------

exports.addTask = function(task)
{
   task.dest.forEach(dest =>
   {
      Tasks.upsert({
         origin: task.origin,
         dest: dest,
         reply: task.reply,
         server: task.server,
         active: true,
         LangTo: task.to,
         LangFrom: task.from
      }).then(() =>
      {
         logger("dev", "Task added successfully.");
      })
         .catch(err =>
         {
            logger("error", err);
         });
   });
};

// ------------
// Update stat
// ------------

exports.increaseServers = function(id)
{
   return Servers.increment("count", { where: { id: id }});
};

// --------------
// Get bot stats
// --------------

exports.getStats = function(callback)
{
   return db.query(`select * from (select sum(count) as "totalCount", ` +
  `count(id)-1 as "totalServers" from servers) as table1, ` +
  `(select count(id)-1 as "activeSrv" from servers where active = TRUE) as table2, ` +
  `(select lang as "botLang" from servers where id = 'bot') as table3, ` +
  `(select count(distinct origin) as "activeTasks" ` +
  `from tasks where active = TRUE) as table4, ` +
  `(select count(distinct origin) as "activeUserTasks" ` +
  `from tasks where active = TRUE and origin like '@%') as table5;`, { type: Sequelize.QueryTypes.SELECT})
      .then(
         result => callback(result),
         err => logger("error", err + "\nQuery: " + err.sql, "db")
      );
};

// ----------------
// Get server info
// ----------------

exports.getServerInfo = function(id, callback)
{
   return db.query(`select * from (select count as "count",` +
   `lang as "lang" from servers where id = ?) as table1,` +
   `(select count(distinct origin) as "activeTasks"` +
   `from tasks where server = ?) as table2,` +
   `(select count(distinct origin) as "activeUserTasks"` +
   `from tasks where origin like '@%' and server = ?) as table3, ` +
   `(select embedstyle as "embedstyle" from servers where id = ?) as table4, ` +
   `(select bot2botstyle as "bot2botstyle" from servers where id = ?) as table5;`, { replacements: [ id, id, id, id, id],
      type: db.QueryTypes.SELECT})
      .then(
         result => callback(result),
         err => this.updateColumns() //+ logger("error", err + "\nQuery: " + err.sql, "db")
      );
};

// ---------
// Close DB
// ---------

exports.close = function()
{
   return db.close();
};