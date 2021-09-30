// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-unused-vars */
const sendMessage = require("../../core/command.send");

// -------------------
// Available Settings
// -------------------

function getPerms (data)
{

   // -----------
   // User Check
   // -----------

   // console.log(`DEBUG: Pre User Check`);
   function userCheck (data)
   {

      // console.log(`DEBUG: In User Check`);
      const memberPermissions = data.message.member.permissions.serialize();
      const userResult1 =
        `__**Permission Checker - User**__\n\n` +
        `As a user you need the following permssions.\n` +
        "```md\n" +

        `# Permissions to set up:\n`;

      if (memberPermissions.ADMINISTRATOR === true)
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

   // ----------
   // Bot Check
   // ----------

   // console.log(`DEBUG: Pre Bot Check`);
   function botCheck (data)
   {

      // console.log(`DEBUG: In Bot Check`);
      const botPermissions = data.message.guild.members.cache.get(data.message.client.user.id).permissions.serialize();
      const botResult1 =
      `__**Permission Checker - Bot**__\n\n` +
      `RITA requires the following permssions.\n` +
      "```md\n" +

      `# Permissions to Function Correctly:\n`;


      if (botPermissions.ADMINISTRATOR === true)
      {

         const botResult2 =
         `* Admin: ${botPermissions.ADMINISTRATOR}  \n` +
         "```";
         data.text = botResult1 + botResult2;

      }
      else if (botPermissions.ADMINISTRATOR === false)
      {

         const botResult2 =
         `* View Channel: ${botPermissions.VIEW_CHANNEL} \n` +
         `* Manage Channels: ${botPermissions.MANAGE_CHANNELS} \n` +
         `* Manage Webhooks: ${botPermissions.MANAGE_WEBHOOKS} \n` +
         `* Manage Server: ${botPermissions.MANAGE_GUILD} \n` +
         `* Send Messages: ${botPermissions.SEND_MESSAGES} \n` +
         `* Embed Links: ${botPermissions.EMBED_LINKS} \n` +
         `* Attach Files: ${botPermissions.ATTACH_FILES} \n` +
         `* Add Reactions: ${botPermissions.ADD_REACTIONS} \n` +
         `* Mention Everyone: ${botPermissions.MENTION_EVERYONE} \n` +
         `* Manage Messages: ${botPermissions.MANAGE_MESSAGES} \n` +
         `* Read Message History: ${botPermissions.READ_MESSAGE_HISTORY} \n\n` +
         `# --- Optional Permissions ---\n` +
         `* Use External Emoji: ${botPermissions.USE_EXTERNAL_EMOJIS} \n` +
         `* Create Invites: ${botPermissions.CREATE_INSTANT_INVITE} \n\n` +
         "```";
         data.text = botResult1 + botResult2;

      }
      data.color = "info";
      return sendMessage(data);

   }

   // ----------
   // Bot Check
   // ----------

   // console.log(`DEBUG: Pre Bot Check`);
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

   // --------------
   // Target Server
   // --------------

   function targetServerCheck (data)
   {

      // console.log(`DEBUG: In Bot Check`);
      const target = data.message.client.guilds.cache.get(data.cmd.num);

      if (target === undefined)
      {

         data.text =
         `__**Permission Checker - Target Server Bot**__\n\n` +
         `Targeted server: \`Unknown\`\n` +
         `Targeted ID: \`${data.cmd.num}\`\n\n` +
         `Invalid Server ID or RITA is no longer in this server.\n\n`;
         data.color = "warn";
         return sendMessage(data);

      }

      const bot = target.members.cache.get(data.message.client.user.id);
      const perms = bot.permissions.serialize();
      const botResult1 =
      `__**Permission Checker - Target Server Bot**__\n\n` +
      `Targeted server: \`${target.name}\`\n` +
      `Targeted ID: \`${target.id}\`\n\n` +
      `RITA requires the following permssions.\n` +
      "```md\n" +

      `# Permissions to Function Correctly:\n`;


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
      data.color = "info";
      return sendMessage(data);

   }

   // console.log(`DEBUG: Valid Perms`);
   const validPerms = {
      "bot": botCheck,
      "channel": chanCheck,
      "server": targetServerCheck,
      "user": userCheck
   };


   // console.log(`DEBUG: Has Perms`);
   const permParam = data.cmd.params.split(" ")[0].toLowerCase();
   if (Object.prototype.hasOwnProperty.call(
      validPerms,
      permParam
   ))
   {

      return validPerms[permParam](data);

   }

   // ------------------------
   // Error for invalid param
   // ------------------------

   data.color = "error";
   data.text =
      `:warning:  **\`${data.cmd.params
      }\`** is not a valid \`checkperm\` option. Use ` +
      `${data.config.translateCmdShort} help misc\` to learn more.`;

   // -------------
   // Send message
   // -------------

   // console.log(`DEBUG: Send Data`);
   return sendMessage(data);

}

// --------------------------
// Proccess settings params
// --------------------------

module.exports = function run (data)
{

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!data.cmd.params)
   {

      data.color = "error";
      data.text =
         ":warning:  Missing `checkperm` parameter. Use `" +
         `${data.config.translateCmdShort} help misc\` to learn more.`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------
   // console.log(`DEBUG: Get Perms`);
   return getPerms(data);

};
