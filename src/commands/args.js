// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const langCheck = require("../core/lang.check");
const logger = require("../core/logger");
const db = require("../core/db");
const fn = require("../core/helpers");

// ---------
// Commands
// ---------

const cmdHelp = require("./utility_commands/help");
const cmdList = require("./info_commands/list");
const cmdStats = require("./info_commands/stats");
const cmdVersion = require("./info_commands/version");
const cmdEmbed = require("./settings_commands/embed");
const cmdBot2bot = require("./settings_commands/bot2bot");
const cmdDonate = require("./utility_commands/donate");
const cmdMisc = require("./info_commands/misc");
const cmdSettings = require("./settings_commands/settings");
const cmdTranslateLast = require("./translation_commands/translate.last");
const cmdTranslateThis = require("./translation_commands/translate.this");
const cmdTranslateAuto = require("./translation_commands/translate.auto");
const cmdTranslateStop = require("./translation_commands/translate.stop");
const cmdTranslateTasks = require("./translation_commands/translate.tasks");
const cmdDebug = require("./settings_commands/debug");
const cmdPrefix = require("./settings_commands/prefix");
const cmdCreate = require("./utility_commands/create.channel");
const cmdMod = require("./future_commands/mod");
const cmdHistory = require("./info_commands/history");
const cmdEject = require("./utility_commands/eject");
const cmdBlacklist = require("./utility_commands/blacklist");
const cmdPerms = require("./utility_commands/perm");
const cmdCheck = require("./utility_commands/check");
const cmdJoin = require("./info_commands/join");
const cmdInvite = require("./settings_commands/invite");
const cmdAnnounce = require("./utility_commands/announce");


// ---------------------------------------
// Extract a parameter's value with regex
// ---------------------------------------

function extractParam (key, str, def = null, allowArray = false)
{

   const rgx = new RegExp(`${key}\\s*((?:(?:\\S*\\s*,\\s*)+\\S*)|\\S*)`, "m");

   const match = rgx.exec(str);

   if (match)
   {

      if (match[1] === "" || match[1] === " ")
      {

         return def;

      }
      if (allowArray)
      {

         if (key === "to")
         {

            const input = /to\s([a-z \s]+)\sfor/gmi;
            const matching = input.exec(match.input);
            if (matching)
            {

               // console.log(matching[1].replace("to ", ""));
               return matching[1].replace("to ", "");

            }

         }


         return fn.removeDupes(match[1].replace(/\s/igm, "").split(","));

      }
      if (match.length > 0)
      {

         return match[1];

      }

   }


   return def;

}


// ---------------------
// Extract number param
// ---------------------

function extractNum (str)
{

   const rgx = new RegExp(
      "(?:^\\s*(-?\\d+))|(?:[^,]\\s*(-?\\d+))",
      "im"
   );

   const match = rgx.exec(str);

   if (match)
   {

      if (match[1])
      {

         return match[1];

      }
      return match[2];

   }
   return null;

}

// ------------------
// Check for content
// ------------------

function checkContent (msg, output)
{

   const hasContent = (/([^:]*):(.*)/).exec(msg);

   if (hasContent)
   {

      output.main = hasContent[1].trim();
      output.content = hasContent[2].trim();

   }

}

// -------------
// Get main arg
// -------------

function getMainArg (output)
{

   const sepIndex = output.main.indexOf(" ");

   if (sepIndex > -1)
   {

      output.params = output.main.slice(sepIndex + 1);
      output.main = output.main.slice(
         0,
         sepIndex
      );

   }

}

// -------------
// Strip prefix
// -------------

function stripPrefix (message, config, bot)
{

   let cmd = message.content;

   cmd = cmd.replace(
      config.translateCmd,
      ""
   );
   cmd = cmd.replace(
      config.translateCmdShort,
      ""
   );

   if (cmd.startsWith(`<@${bot.id}>`) || cmd.startsWith(`<@!${bot.id}>`))
   {

      cmd = cmd.replace(
         /<@.*?>/,
         ""
      );

   }

   return cmd;

}

// --------------------------------------
// Analyze arguments from command string
// --------------------------------------

module.exports = function run (data)
{

   const output = {
      "main": stripPrefix(
         data.message,
         data.config,
         data.message.client.user
      ).trim(),
      "params": null
   };

   checkContent(
      output.main,
      output
   );

   getMainArg(output);

   if (output.main === "channel")
   {

      output.auto = output.main;
      output.main = "auto";

   }

   if (output.main === `${data.message.client.user}`)
   {

      output.main = "help";

   }

   output.to = langCheck(extractParam(
      "to",
      output.params,
      ["default"],
      true
   ));

   output.from = langCheck(extractParam(
      "from",
      output.params,
      ["auto"],
      true
   ));

   output.for = extractParam(
      "for",
      output.params,
      ["me"],
      true
   );

   output.num = extractNum(output.params);

   // -----------------------------
   // Get server/bot info/settings
   // -----------------------------

   let id = "bot";

   if (data.message.channel.type === "text")
   {

      id = data.message.channel.guild.id;

   }

   db.getServerInfo(
      id,
      function getServerInfo (server)
      {

         output.server = server;

         // -----------------------------------
         // Get default language of server/bot
         // -----------------------------------

         if (output.server[0].blacklisted === true)
         {

            // console.log(`${output.server[0].blacklisted}`);
            data.message.client.guilds.cache.get(id).leave();
            console.log(`Self Kicked on command use due to blacklisted`);

         }

         if (output.to === "default")
         {

            if (server && server.lang)
            {

               output.to = langCheck(server.lang);

            }
            else
            {

               output.to = langCheck(data.config.defaultLanguage);

            }

         }

         // ----------------------------------
         // Add command info to main data var
         // ----------------------------------

         data.cmd = output;

         // -----------------------------
         // Check if channel is writable
         // -----------------------------

         data.canWrite = true;

         if (data.message.channel.type === "text")
         {

            data.canWrite = fn.checkPerm(
               data.message.channel.guild.me,
               data.message.channel,
               "SEND_MESSAGES"
            );

         }

         // -----------------------
         // Log command data (dev)
         // -----------------------

         logger(
            "cmd",
            data
         );

         // ---------------
         // Legal Commands
         // ---------------

         const cmdMap = {
            "announce": cmdAnnounce,
            "auto": cmdTranslateAuto,
            "ban": cmdMod.ban,
            "blacklist": cmdBlacklist.blacklist,
            "bot2bot": cmdBot2bot,
            "check": cmdCheck,
            "checkperms": cmdPerms,
            "create": cmdCreate,
            "debug": cmdDebug,
            "donate": cmdDonate,
            "eject": cmdEject.eject,
            "embed": cmdEmbed,
            "help": cmdHelp,
            "history": cmdHistory,
            "id": cmdMisc.ident,
            "info": cmdHelp,
            "invite": cmdInvite,
            "last": cmdTranslateLast.run,
            "list": cmdList,
            "mute": cmdMod.mute,
            "newbot": cmdJoin.newBot,
            "prefix": cmdPrefix,
            "proc": cmdMisc.proc,
            "settings": cmdSettings,
            "shards": cmdMisc.shards,
            "stats": cmdStats,
            "stop": cmdTranslateStop,
            "tasks": cmdTranslateTasks,
            "this": cmdTranslateThis,
            "unban": cmdMod.unban,
            "unblacklist": cmdBlacklist.unblacklist,
            "unmute": cmdMod.unmute,
            "unwarn": cmdEject.unwarn,
            "update": cmdMisc.update,
            "version": cmdVersion,
            "warn": cmdEject.warn
         };

         // --------------------------
         // Execute command if exists
         // --------------------------

         output.main = output.main.toLowerCase();

         if (Object.prototype.hasOwnProperty.call(
            cmdMap,
            output.main
         ))
         {

            cmdMap[output.main](data);

         }

      }
   ).catch((err) =>
   {

      console.log(
         "error",
         err,
         "warning",
         id
      );

   });

};
