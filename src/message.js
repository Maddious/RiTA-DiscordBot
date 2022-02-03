/* eslint-disable complexity */
/* eslint-disable sort-keys */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
const db = require("./core/db");
const fn = require("./core/helpers");
const cmdArgs = require("./commands/args");
const auth = require("./core/auth");

// --------------------
// Listen for messages
// --------------------

// eslint-disable-next-line no-unused-vars
module.exports = async function run (config, message)
{

   module.exports.message = message;
   if (message.channel.type === "dm" || message.type !== "DEFAULT")
   {

      return;

   }
   if (!db.server_obj[message.guild.id])
   {

      return;

   }

   // ------------------------
   // Ignore messages by bots
   // ------------------------
   const bot2botstyle = db.server_obj[message.guild.id].db.bot2botstyle;

   if (bot2botstyle === "off")
   {

      if (message.author.bot)
      {

         return;

      }

   }
   else if (bot2botstyle === "on")
   {

      // eslint-disable-next-line no-bitwise
      if (message.webhookID)
      {

         return;

      }
      if (message.author.id === message.client.user.id)
      {

         return;

      }

   }

   FileOverride: if (message.content === "" || message.content === " ")
   {

      if (message.attachments.size !== 0)
      {

         if (message.channel.type === "text")
         {

            db.increaseStatsCount("images", message.channel.guild.id);

         }

         break FileOverride;

      }

      // console.log(`--m.js--- Empty Message Error: ----1----\nServer: ${message.channel.guild.name},\nChannel: ${message.channel.id} - ${message.channel.name},\nMessage ID: ${message.id},\nContent: ${message.content},\nWas Image: ${message.attachments},\nWas Embed: ${message.embeds},\nSender: ${message.member.displayName} - ${message.member.id},\nTimestamp: ${message.createdAt}\n----------------------------------------`);

   }

   GifOverride: if (message.embeds.length !== 0)
   {

      if (message.content.startsWith("https://tenor.com/"))
      {

         if (message.channel.type === "text")
         {

            db.increaseStatsCount("images", message.channel.guild.id);

         }

         break GifOverride;

      }
      if (message.embeds[0].description)
      {

         message.content = `${message.content}\n${message.embeds[0].description}`;

      }
      else if (message.content === "" || message.content === " ")
      {

         // console.log(`--m.js--- Empty Message Error: ----2----\nServer: ${message.channel.guild.name},\nChannel: ${message.channel.id} - ${message.channel.name},\nMessage ID: ${message.id},\nContent: ${message.content},\nWas Image: ${message.attachments},\nwas Embed: ${message.embeds},\nSender: ${message.member.displayName} - ${message.member.id},\nTimestamp: ${message.createdAt}\n----------------------------------------`);
         return;

      }

   }


   // -----------------------------------------
   // Embed member permissions in message data
   // -----------------------------------------

   if (message.channel.type === "text" && message.member)
   {

      message.isAdmin =
         message.member.permissions.has("ADMINISTRATOR");

      message.isGlobalChanManager =
         message.member.permissions.has("MANAGE_CHANNELS");

      message.isChanManager =
         fn.checkPerm(
            message.member,
            message.channel,
            "MANAGE_CHANNELS"
         );
      message.isDev = auth.devID.includes(message.author.id);
      message.isBotOwner = auth.botOwner.includes(message.author.id);
      message.sourceID = message.guild.id;
      // eslint-disable-next-line no-self-assign
      message.guild.owner = await message.guild.members.fetch(message.guild.ownerID);

      // Add role color
      message.roleColor = fn.getRoleColor(message.member);

   }

   // ------------
   // Data object
   // ------------

   const data = {
      "canWrite": true,
      "channel": message.channel,
      config,
      "member": message.member,
      message
   };
   if (data.message.channel.type !== "dm")
   {

      if (data.member)
      {

         // Replace username with nickname if exists
         if (data.member.displayName)
         {

            data.message.author.username = data.member.displayName;

         }

      }

   }

   // ---------------------
   // Blacklist Redundancy
   // ---------------------
   const serverID = data.message.guild.id;

   db.getServerInfo(
      serverID,
      function getServerInfo (server)
      {

         if (server.length === 0)
         {

            return;

         }

         if (server[0].blacklisted === true)
         {

            console.log(`Blacklist Redundancy, Server ${serverID} ejected`);
            data.message.guild.leave();

         }
         message.server = server;

      }
   ).catch((err) =>
   {

      console.log(
         "error",
         err,
         "warning",
         serverID
      );

   });

   // ------------------
   // Proccess Commands
   // ------------------

   if (message.content !== undefined)

   {

      if (message.content.startsWith(config.translateCmd) || message.content.startsWith(config.translateCmdShort) || message.content.startsWith(`<@${message.client.user.id}>`) || message.content.startsWith(`<@!${message.client.user.id}>`))
      {

         if (auth.messagedebug === "5")
         {

            console.log(`MD5: ${message.guild.name} - ${message.guild.id} - ${message.createdAt}\nMesssage User - ${message.author.tag} \nMesssage Content - ${message.content}\n----------------------------------------`);

         }
         // eslint-disable-next-line consistent-return
         return cmdArgs(data);

      }

   }

   // --------------------------
   // Check for automatic tasks
   // --------------------------

   // eslint-disable-next-line consistent-return
   return db.channelTasks(data);

};
