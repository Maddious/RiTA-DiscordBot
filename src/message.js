// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING]
const db = require("./core/db");
const fn = require("./core/helpers");
const cmdArgs = require("./commands/args");


// --------------------
// Listen for messages
// --------------------

// eslint-disable-next-line no-unused-vars
module.exports = function run (config, message, edited, deleted)
{

   module.exports.message = message;
   const client = message.client;
   const bot = client.user;
<<<<<<< Updated upstream
   // const bot2botstyle = db.server_obj[message.guild.id].bot2botstyle;
=======
   //const bot2botstyle = db.server_obj[message.guild.id].bot2botstyle;
>>>>>>> Stashed changes

   // ------------------------
   // Ignore messages by bots
   // ------------------------


<<<<<<< Updated upstream
   // if (bot2botstyle === "off")
   // {
=======
   //if (bot2botstyle === "off")
   //{
>>>>>>> Stashed changes
   if (message.author.bot)
   {

      return;

   }
   // }

<<<<<<< Updated upstream
   // if (bot2botstyle === "on")
   // {
=======
   //if (bot2botstyle === "on")
   //{
>>>>>>> Stashed changes
   //   if (message.author.discriminator === "0000")
   //   {
   //      return;
   //   }
   // }

   // -----------------------------------------
   // Embed member permissions in message data
   // -----------------------------------------

   if (message.channel.type === "text" && message.member)
   {

      message.isAdmin =
         message.member.permissions.has("ADMINISTRATOR");

      message.isManager =
         fn.checkPerm(
            message.member,
            message.channel,
            "MANAGE_CHANNELS"
         );

      // Add role color
      message.roleColor = fn.getRoleColor(message.member);

   }

   // ------------
   // Data object
   // ------------

   const data = {
<<<<<<< Updated upstream
      bot,
      canWrite: true,
      channel: message.channel,
      client,
      config,
      member: message.member,
      message
=======
      client: client,
      config: config,
      bot: bot,
      channel: message.channel,
      message: message,
      member: message.member,
      canWrite: true
>>>>>>> Stashed changes
   };
   if (data.message.channel.type !== "dm")
   {

      // Replace username with nickname if exists
      if (data.member.displayName)
      {

         data.message.author.username = data.member.displayName;

      }

   }

   // ------------------
   // Proccess Commands
   // ------------------

   if (message.content.startsWith(config.translateCmd) || message.content.startsWith(config.translateCmdShort) || message.isMentioned(bot))
   {

      // eslint-disable-next-line consistent-return
      return cmdArgs(data);

   }

   // --------------------------
   // Check for automatic tasks
   // --------------------------

   // eslint-disable-next-line consistent-return
   return db.channelTasks(data);

};
