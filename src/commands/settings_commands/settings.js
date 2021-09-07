// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const db = require("../../core/db");
const logger = require("../../core/logger");
const sendMessage = require("../../core/command.send");
const fs = require("fs");
const path = require("path");
const time = {
   "long": 10000,
   "short": 5000
};
const auth = require("../../core/auth");

// -------------------
// Available Settings
// -------------------

function getSettings (data)
{

   // ----------------------------
   // Set default server language
   // ----------------------------

   function setLang (data)
   {

      // ---------------------------
      // Error for invalid language
      // ---------------------------

      if (data.cmd.to.valid.length !== 1)
      {

         data.color = "error";
         data.text = ":warning:  Please specify 1 valid language.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // ------------------------
      // Error for same language
      // ------------------------

      if (data.cmd.server && data.cmd.to.valid[0].iso === data.cmd.server.lang)
      {

         data.color = "info";
         data.text =
            `:information_source:  **\`${
               data.cmd.to.valid[0].name}\`** is the current default ` +
            `languange of this server. To change:\n\`\`\`md\n# Example\n${
               data.config.translateCmd} settings setLang to french\n\`\`\``;

         // -------------
         // Send message
         // -------------

         return sendMessage(data);

      }

      // ----------------
      // Update database
      // ----------------

      return db.updateServerTable(
         data.message.channel.guild.id,
         "lang",
         data.cmd.to.valid[0].iso,
         function error (err)
         {

            if (err)
            {

               return logger(
                  "error",
                  err,
                  "db",
                  data.message.channel.guild.name
               );

            }
            data.color = "ok";
            data.text =
               `Default language for server has been changed to **\`${
                  data.cmd.to.valid[0].name}\`**.`;

            // -------------
            // Send message
            // -------------

            return sendMessage(data);

         }
      );

   }

   // -------------
   // List Servers
   // -------------

   function listServers (data)
   {

      if (auth.devID.includes(data.message.author.id))
      {

         data.text = "Active Servers - ";

         const activeGuilds = data.message.client.guilds.cache.array();

         data.text += `${activeGuilds.length}\n\n`;

         activeGuilds.forEach((guild) =>
         {

            data.text += `${guild.name}\n${guild.id}\n${guild.memberCount} members\n`;
            if (guild.owner)
            {

               data.text += `${guild.owner.user.username}#`;
               data.text += `${guild.owner.user.discriminator}\n\n`;

            }
            else
            {

               data.text += "\n";

            }

         });

         // ------------------
         // Send message/file
         // ------------------

         data.message.delete({"timeout": time.short}).catch((err) => console.log(
            "Command Message Deleted Error, command.send.js = ",
            err
         ));
         fs.writeFileSync(
            path.resolve(
               __dirname,
               "../../files/serverlist.txt"
            ),
            data.text
         );
         data.message.channel.send(
            "Server List.",
            {"files": ["./src/files/serverlist.txt"]}
         );

      }
      else
      {

         data.text = ":cop:  This Command is for bot developers only.";
         return sendMessage(data);

      }

   }

   // --------------------
   // Command Persistence
   // --------------------

   let commandVariable1 = data.cmd.params.toLowerCase();
   // eslint-disable-next-line no-unused-vars
   commandVariable1 = commandVariable1.slice(8);
   const setPersistence = async function setPersistence (data)
   {

      if (commandVariable1 === "on" || commandVariable1 === "off")
      {

         if (commandVariable1 === "on")
         {

            commandVariable1 = true;

         }
         else
         {

            commandVariable1 = false;

         }
         // console.log(`DEBUG: embed variable ${commandVariable1}`);
         await db.updateServerTable(
            data.message.channel.guild.id,
            "persist",
            commandVariable1,
            function error (err)
            {

               if (err)
               {

                  return logger(
                     "error",
                     err,
                     "command",
                     data.message.channel.guild.name
                  );

               }
               const output =
            "**```Updated Persist Settings```**\n" +
            `Persist Command Messages = ${commandVariable1}\n\n`;
               data.color = "info";
               data.text = output;

               // -------------
               // Send message
               // -------------

               return sendMessage(data);

            }
         );

      }

   };

   // -------
   // Owners
   // -------
   function ownerUpdate (data)
   {

      if (auth.devID.includes(data.message.author.id))
      {

         let i = 0;
         const guilds = [];
         for (const guild of data.message.client.guilds.cache)
         {

            guilds.push(guild);

         }

         const wait = setInterval(function delay ()
         {

            const guild = guilds.shift();

            i += 1;
            if (guild === undefined)
            {

               console.log(`Done all servers`);
               clearInterval(wait);

            }
            else if (guild[1].owner)
            {

               const target = guild[1].id;

               if (!target)
               {

                  // eslint-disable-next-line no-useless-return
                  return;

               }

               db.updateServerTable(
                  target,
                  "owner",
                  `${guild[1].owner.user.username}#${guild[1].owner.user.discriminator}`,
                  function error (err)
                  {

                     if (err)
                     {

                        return console.log(`DEBUG: Unable to save owner details to DB on Server Join`);

                     }

                  },
                  console.log(`Server Owner Added for guild: ${target}`)
               );


            }

         }, 100);

      }
      else
      {

         data.text = ":cop:  This Command is for bot developers only.";
         return sendMessage(data);

      }

   }


   // ----------
   // Update db
   // ----------

   async function updateDB (data)
   {

      data.color = "info";
      data.text =
         ":white_check_mark: **Database has been updated.**";

      // -------------
      // Send message
      // -------------

      await db.updateColumns();

      return sendMessage(data);

   }

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validSettings = {
      // "announce": announcement,
      // add,
      "listservers": listServers,
      "owner": ownerUpdate,
      "persist": setPersistence,
      "setlang": setLang,
      "updatedb": updateDB

   };

   const settingParam = data.cmd.params.split(" ")[0].toLowerCase();
   if (Object.prototype.hasOwnProperty.call(
      validSettings,
      settingParam
   ))
   {

      return validSettings[settingParam](data);

   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      `:warning:  **\`${data.cmd.params
      }\`** is not a valid settings option.`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}

// --------------------------
// Proccess settings params
// --------------------------

module.exports = function run (data)
{

   // -------------------------------
   // Command allowed by admins only
   // -------------------------------

   AreDev:if (!process.env.DISCORD_BOT_OWNER_ID.includes(data.message.author.id))
   {

      if (auth.devID.includes(data.message.author.id))
      {

         // console.log("DEBUG: Developer ID Confirmed");
         break AreDev;

      }

      data.color = "warn";
      data.text = ":warning: These Commands are for bot owners and developers only.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }
   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {

      data.color = "info";
      data.text =
      `**\`\`\`${data.message.channel.guild.name} - Server Settings` +
      `\`\`\`**\n:information_source: Your current prefix is: **\`${db.server_obj[data.message.guild.id].db.prefix}\`**\n\n` +
      `:tada: Annocement Messages: **\`${data.cmd.server[0].announce}\`**\n\n` +
      `:inbox_tray: Embedded Message Style: **\`${data.cmd.server[0].embedstyle}\`**\n\n` +
      `:robot: Bot to Bot Translation Status: **\`${data.cmd.server[0].bot2botstyle}\`**\n\n` +
      `:pause_button: Help Menu Persistance: **\`${data.cmd.server[0].persist}\`**\n\n` +
      `:wrench: Webhook Debug Active State: **\`${data.cmd.server[0].webhookactive}\`**`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return getSettings(data);

};
