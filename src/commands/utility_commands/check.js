/* eslint-disable consistent-return */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const db = require("../../core/db");

const devSendMessage = require("../../core/dev.send");
const sendMessage = require("../../core/command.send");
const {oneLine} = require("common-tags");


// -------------
// Command Code
// -------------

function getCheck (data)
{

   const serverID = data.cmd.num;
   const target = data.message.client.guilds.cache.get(serverID);

   // ------------------
   // Full Server Check
   // ------------------

   function fullServer (data)
   {

      db.getServerInfo(
         serverID,
         async function getServerInfo (server)
         {

            if (!target)
            {

               if (server.length === 0)
               {

                  data.text = `\`\`\`${serverID} is not registered in the database.\n\n\`\`\``;
                  return devSendMessage(data);

               }

               data.text =
               `__**Permission Checker - Target Server**__\n\n` +
               "```md\n" +
               `Targeted server: Unknown\n` +
               `Targeted ID: ${serverID}\n\n` +
               "```" +

               "```md\n" +
               `* Error Count: ${server[0].errorcount}\n` +
               `* Warn Count: ${server[0].warncount}\n` +
               `* Eject Count: ${server[0].ejectcount}\n` +
               `* Warn Status: ${server[0].warn}\n` +
               `* Blacklist Status: ${server[0].blacklisted}\n\n` +
               "```" +

               "```md\n" +
               `RITA is no longer in this server.\n\n` +
               "```";
               data.color = "warn";
               return devSendMessage(data);

            }

            const bot = target.members.cache.get(data.message.client.user.id);
            const owner = await target.members.fetch(target.ownerID);
            const tag = `${owner.user.username}#${owner.user.discriminator}`;
            const perms = bot.permissions.serialize();
            const currentShard = `${target.shardID + 1} / ${data.message.client.options.shardCount}`;
            const botResult1 =
               `__**Permission Checker - Target Server**__\n\n` +
               "```md\n" +
               `# Server Checker - Targeted Server\n` +
               `* Targeted Server: ${target.name}\n` +
               `* Targeted ID: ${target.id}\n` +
               `* Current Shard: ${currentShard}\n` +
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
               `* Language Detection: ${server[0].langdetect}\n` +
               `* Bot to Bot Translation Status: ${server[0].bot2botstyle}\n` +
               `* Server Tags status: ${server[0].servertags}\n` +
               `* Translation by Flag Reactions: ${server[0].flag}\n` +
               `* Help Menu Persistance: ${server[0].menupersist}\n` +
               `* React Translation Persistance: ${server[0].reactpersist}\n` +
               `* React Emoji Persistance: ${data.cmd.server[0].flagpersist}\n` +
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
            return devSendMessage(data);

         }
      ).catch((err) =>
      {

         console.log(
            "error",
            err,
            "warning",
            serverID
         );

         data.text = oneLine`\`\`\`Critical Stats Error, Zycore Broke it.\n\n\`\`\``;
         return devSendMessage(data);

      });

   }

   function userCheck (data)
   {

      // console.log(`DEBUG: In User Check`);
      const memberPermissions = data.message.member.permissions.serialize();
      const userResult1 =
        `__**Permission Checker - User**__\n\n` +
        `As a user you need the following permssions.\n` +
        "```md\n" +

        `# Permissions to set up:\n`;
      if (data.message.guild.ownerID === data.message.member.id)
      {

         const userResult2 =
             `* OWNER: ${memberPermissions.ADMINISTRATOR}  \n` +
             "```";
         data.text = userResult1 + userResult2;

      }
      else if (memberPermissions.ADMINISTRATOR === true && data.message.guild.ownerID !== data.message.member.id)
      {

         const userResult2 =
           `* Admin: ${memberPermissions.ADMINISTRATOR}  \n` +
           "```";
         data.text = userResult1 + userResult2;

      }
      else if (memberPermissions.ADMINISTRATOR === false)
      {

         const userResult2 =
           `* View Channel: ${memberPermissions.VIEW_CHANNEL} \n` +
           `* Manage Channels: ${memberPermissions.MANAGE_CHANNELS} \n` +
           `* Send Messages: ${memberPermissions.SEND_MESSAGES} \n` +
           `* Add Reactions: ${memberPermissions.ADD_REACTIONS} \n` +
           `* Read Message History: ${memberPermissions.READ_MESSAGE_HISTORY} \n\n` +
           "```";

         data.text = userResult1 + userResult2;

      }
      data.color = "info";
      return sendMessage(data);

   }

   function chanCheck (data)
   {

      // console.log(`DEBUG: In Bot Check`);
      // const botPermissions = data.message.guild.channels.cache.get(data.message.channel.id);
      // console.log(`${botPermissions}`);
      const chanResult1 =
      `__**Permission Checker - This channel**__\n\n` +
      `RITA requires the following permssions in this channel.\n` +
      "```md\n" +

      `# This Command has not been set up yet. Check back later\n` +
      "```";

      data.color = "info";
      data.text = chanResult1;
      return sendMessage(data);

   }

   // --------------------------
   // Execute command if exists
   // --------------------------

   const validCheck = {
      "channel": chanCheck,
      "me": userCheck,
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

   Override: if (data.message.guild.ownerID !== data.message.author.id)
   {

      if (data.cmd.params === "me" || data.cmd.params === "channel" || data.message.isDev)
      {

         // console.log("DEBUG: Developer ID Confirmed");
         break Override;

      }

      data.color = "warn";
      data.text = ":warning: These Commands are for server owners and developers only.";

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // -------------------------------
   // Error if check param is missing
   // --------------------------------

   if (!data.cmd.params)
   {

      const target = data.message.client.guilds.cache.get(data.message.guild.id);
      db.getServerInfo(
         data.message.guild.id,
         async function getServerInfo (server)
         {

            // const user = data.message.guild.members.cache.get(data.message.author.id);
            const bot = target.members.cache.get(data.message.client.user.id);
            const owner = await target.members.fetch(target.ownerID);
            const tag = `${owner.user.username}#${owner.user.discriminator}`;
            const perms = bot.permissions.serialize();
            const currentShard = `${target.shardID + 1} / ${data.message.client.options.shardCount}`;
            const botResult1 =
               `__**Permission Checker - This Server**__\n\n` +
               "```md\n" +
               `# Server Checker - This Server\n` +
               `* Server Name: ${target.name}\n` +
               `* Server ID: ${target.id}\n` +
               `* Current Shard: ${currentShard}\n` +
               `* Owner: ${tag || "Unknown"}\n` +
               `* Command prefix is: ${db.server_obj[data.message.guild.id].db.prefix}\n\n` +
               "```" +

               "```md\n" +
               `* Error Count: ${server[0].errorcount}\n` +
               `* Warn Count: ${server[0].warncount}\n` +
               `* Eject Count: ${server[0].ejectcount}\n` +
               `* Warn Status: ${server[0].warn}\n` +
               `* Blacklist Status: ${server[0].blacklisted}\n\n` +
               "```" +

               "```md\n" +
               `# RITA Server Settings:\n` +
               `* Allow Annocement Messages: ${server[0].announce}\n` +
               `* Embedded Message Style: ${server[0].embedstyle}\n` +
               `* Language Detection: ${server[0].langdetect}\n` +
               `* Bot to Bot Translation Status: ${server[0].bot2botstyle}\n` +
               `* Server Tags status: ${server[0].servertags}\n` +
               `* Translation by Flag Reactions: ${server[0].flag}\n` +
               `* Help Menu Persistance: ${server[0].menupersist}\n` +
               `* React Translation Persistance: ${server[0].reactpersist}\n` +
               `* React Emoji Persistance: ${data.cmd.server[0].flagpersist}\n` +
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
      );

      return;

   }

   return getCheck(data);

};
