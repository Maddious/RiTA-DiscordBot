/* eslint-disable consistent-return */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");

const sendMessage = require("../../core/dev.send");
const oneLine = require("common-tags").oneLine;


// -------------
// Command Code
// -------------

function getCheck (data)
{

   const serverID = data.cmd.num;

   // ------------------
   // Full Server Check
   // ------------------

   function fullServer (data)
   {

      const target = data.message.client.guilds.cache.get(serverID);
      if (target === undefined)
      {

         data.text =
            `__**Permission Checker - Target Server Bot**__\n\n` +
            `Targeted server: \`Unknown\`\n` +
            `Targeted ID: \`${serverID}\`\n\n` +
            `Invalid Server ID or RITA is no longer in this server.\n\n`;
         data.color = "warn";
         return sendMessage(data);

      }


      db.getServerInfo(
         serverID,
         async function getServerInfo (server)
         {

            const bot = target.members.cache.get(data.message.client.user.id);
            const owner = await target.members.fetch(target.ownerID);
            const tag = `${owner.user.username}#${owner.user.discriminator}`;
            const perms = bot.permissions.serialize();
            const botResult1 =
         "```md\n" +
         `# Server Checker - Targeted Server\n` +
         `* Targeted Server: ${target.name}\n` +
         `* Targeted ID: ${target.id}\n` +
         `* Owner: ${tag || "Unknown"}\n` +
         `* Command prefix is: ${db.server_obj[serverID].db.prefix}\n\n` +
         "```" +

         "```md\n" +
         `* Error Count: ${server[0].errorcount}\n` +
         `* Warn Count: ${server[0].warncount}\n` +
         `* Eject Count: ${server[0].ejectcount}\n` +
         `* Warn Status: ${server[0].warn}\n` +
         `* Blacklist Status: ${server[0].blacklisted}\n\n` +
         "```" +

         "```md\n" +
         `* Allow Annocement Messages: ${server[0].announce}\n` +
         `* Embedded Message Style: ${server[0].embedstyle}\n` +
         `* Bot to Bot Translation Status: ${server[0].bot2botstyle}\n` +
         `* Translation by Flag Reactions: ${server[0].flag}\n` +
         `* Help Menu Persistance: ${server[0].menupersist}\n` +
         `* Flag Translation Persistance: ${server[0].reactpersist}\n` +
         `* Flag Emoji Persistance: ${data.cmd.server[0].flagpersist}\n` +
         `* Webhook Debug Active State: ${server[0].webhookactive}\n\n` +
         "```" +

         "```md\n" +
         `# RITA Permissions Check:\n`;


            if (perms.ADMINISTRATOR === true)
            {

               const botResult2 =
            `* Admin: ${perms.ADMINISTRATOR}  \n` +
            "```";
               data.text = botResult1 + botResult2;

            }
            else if (perms.ADMINISTRATOR === false)
            {

               const botResult2 =
            `* View Channel: ${perms.VIEW_CHANNEL} \n` +
            `* Manage Channels: ${perms.MANAGE_CHANNELS} \n` +
            `* Manage Webhooks: ${perms.MANAGE_WEBHOOKS} \n` +
            `* Manage Server: ${perms.MANAGE_GUILD} \n` +
            `* Send Messages: ${perms.SEND_MESSAGES} \n` +
            `* Embed Links: ${perms.EMBED_LINKS} \n` +
            `* Attach Files: ${perms.ATTACH_FILES} \n` +
            `* Add Reactions: ${perms.ADD_REACTIONS} \n` +
            `* Mention Everyone: ${perms.MENTION_EVERYONE} \n` +
            `* Manage Messages: ${perms.MANAGE_MESSAGES} \n` +
            `* Read Message History: ${perms.READ_MESSAGE_HISTORY} \n\n` +
            `# --- Optional Permissions ---\n` +
            `* Use External Emoji: ${perms.USE_EXTERNAL_EMOJIS} \n` +
            `* Create Invites: ${perms.CREATE_INSTANT_INVITE} \n\n` +
            "```";
               data.text = botResult1 + botResult2;

            }
            // -------------
            // Send message
            // -------------
            data.color = "info";
            return sendMessage(data);

         }
      ).catch((err) =>
      {

         console.log(
            "error",
            err,
            "warning",
            serverID
         );

         data.text = oneLine`\`\`\`${serverID} is not in our Database\n\n\`\`\``;
         return sendMessage(data);

      });

   }

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validCheck = {
      "server": fullServer
   };

   const checkParam = data.cmd.params.split(" ")[0].toLowerCase();
   if (Object.prototype.hasOwnProperty.call(
      validCheck,
      checkParam
   ))
   {

      return validCheck[checkParam](data);

   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      `:warning:  **\`${data.cmd.params
      }\`** is not a valid check option. run ` +
      `${data.config.translateCmdShort} check\` to learn more.`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

}
// ----------------------
// Proccess check params
// ----------------------

module.exports = function run (data)
{

   // -------------------------------
   // Error if check param is missing
   // --------------------------------

   if (!data.cmd.params)
   {

      // -------------
      // Command Code
      // -------------

      data.color = "info";
      data.text = `Check Command` +
      "```md\n" +
      `* check server [serverID] \n\n` +
      "```\n";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   return getCheck(data);


};
