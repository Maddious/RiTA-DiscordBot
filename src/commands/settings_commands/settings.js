// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
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

   // -----------------
   // DM server owners
   // -----------------

   /*
   // eslint-disable-next-line no-unused-vars
   const Announcement = async function Announcement (data)
   {

      const guildArray = Array.from(data.message.client.guilds.cache());
      let i;
      for (i = 0; i < guildArray.length; i += 1)
      {

         console.log("Hello");
         const guild = await guildArray[i];
         let owner = await guild.ownerID;
         owner = Number(owner);
         owner = owner.replace(/([0-9]+)/g, "$1");
         console.log("Done");
         await data.message.client.users.get(owner).send("Testing").
            catch((err) =>
            {

               console.log(err);

            });

      }

   };
   */

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

   AreDev:if (!process.env.DISCORD_BOT_OWNER_ID)
   {

      if (auth.devID.includes(data.message.author.id))
      {

         // console.log("DEBUG: Developer ID Confirmed");
         break AreDev;

      }

      data.color = "warn";
      data.text = `:warning: These commands can cause issues with your bot, as an extra layer of security they have been restricted further than discord admins.\n\n ` +
      ` If you are trying to run the \`settings dbfix\` or \`settings uppdatedb\` commands then you do not need to do this anymore when updating the bot. \n\n ` +
      ` If however you want access to these commands then please set \`DISCORD_BOT_OWNER_ID\` as an array of User IDs, include any user that is allowed to use these commands in configuration vars. \n\n **Example.** \`\`\`js\nDISCORD_BOT_OWNER_ID=[ALLOWED_USER_1_ID, ALLOWED_USER_2_ID, ALLOWED_USER_3_ID]\`\`\`\n ` +
      ` Copy the above into your .env file (local hosting) or Settings > Config Vars for Heroku.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

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

      data.color = "error";
      data.text =
         ":warning:  Missing `settings` parameter. Use `" +
         `${data.config.translateCmdShort} help settings\` to learn more.`;

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
