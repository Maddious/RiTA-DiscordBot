// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-irregular-whitespace*/
/* eslint-disable no-magic-numbers */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
const auth = require("../../core/auth");
const db = require("../../core/db");
const process = require("process");
const {stripIndent} = require("common-tags");
const {oneLine} = require("common-tags");
const secConverter = require("rita-seconds-converter");
const sendMessage = require("../../core/command.send");
const botSend = require("../../core/send");

// ------------
// Invite Link
// ------------

// -----------------------
// Get info on all shards
// -----------------------

module.exports.shards = function shards (data)
{

   // ---------------
   // Get shard info
   // ---------------

   data.color = "info";

   data.text = `__**Bot Shard Information**__\n\n`;
   data.text += `​${oneLine`
         :bar_chart:  ​
         **\`${data.message.client.options.shardCount}\`**  shards  ·  ​
         **\`${data.message.client.guilds.cache.size}\`**  guilds  ·  ​
         **\`${data.message.client.channels.cache.size}\`**  channels  ·  ​
         **\`${db.server_obj.size}\`**  users
      `}\n​​`;

   const shard = [];
   const activeGuilds = data.message.client.guilds.cache.array();
   let i = 0;


   activeGuilds.forEach((guild) =>
   {

      if (i === guild.shardID)
      {


         if (!shard[i])
         {

            i += 1;
            // console.log(`Shard: ${i} Uptime: ${guild.shard.connectedAt} Ping: ${guild.shard.ping}`);
            guild.shard.count = 1;
            return shard.push(guild.shard);

         }

      }
      shard[i - 1].count += 1;

   });

   i = 0;
   shard.forEach((info) =>
   {

      const shardUptime = secConverter(Date.now() - info.connectedAt);
      function uptimeFormat (uptime)
      {

         return oneLine`
            **\`${uptime.days}\`** days
            **\`${uptime.hours}:${uptime.minutes}:${uptime.seconds}\`**
         `;

      }

      i += 1;
      data.text += `​\n${oneLine`
         Shard: **\`${info.id}\`**  ·  ​
         Uptime: ${uptimeFormat(shardUptime)}  ·  ​
         Ping **\`${info.ping}\`**  ·  ​
         Servers: **\`${info.count}\`**
      `}​`;

   });

   // -------------
   // Send message
   // -------------

   return sendMessage(data);


};

// ----------------------
// Current proccess info
// ----------------------

module.exports.proc = function proc (data)
{

   // ------------------
   // Get proccess data
   // ------------------

   const title = `**\`${process.title}\`** `;
   const pid = `**\`#${process.pid}\`** `;
   const platform = `**\`${process.platform}\`** `;

   // -----------------------
   // Byte formatter (mb/gb)
   // -----------------------

   function byteFormat (bytes)
   {

      if (bytes > 750000000)
      {

         const gb = bytes / 1000 / 1000 / 1000;
         return `${gb.toFixed(3)} gb`;

      }

      const mb = bytes / 1000 / 1000;
      return `${mb.toFixed(2)} mb`;

   }

   // -----------------
   // Get memory usage
   // -----------------

   const memory = process.memoryUsage();
   const memoryFormat = oneLine`
      **\`${byteFormat(memory.rss)}\`** \`rss\` ·
      **\`${byteFormat(memory.heapUsed)}\`**\`/\`
      **\`${byteFormat(memory.heapTotal)}\`** \`heap\` ·
      **\`${byteFormat(memory.external)}\`** \`external\`
   `;

   // --------------------------
   // Get proccess/shard uptime
   // --------------------------

   const procUptime = secConverter(
      Math.round(process.uptime()),
      "sec"
   );

   const shardUptime = secConverter(data.message.client.uptime);

   function uptimeFormat (uptime)
   {

      return oneLine`
         **\`${uptime.days}\`** days
         **\`${uptime.hours}:${uptime.minutes}:${uptime.seconds}\`**
      `;

   }

   // ---------
   // Get ping
   // ---------

   // eslint-disable-next-line prefer-template
   const botPing = Date.now() - data.message.createdTimestamp;
   // const yourPing = new Date().getTime() - data.message.createdTimestamp;

   // ---------------
   // Render message
   // ---------------

   data.text = stripIndent`
   :robot:  Process:  ${title + pid + platform}

   :control_knobs:  RAM:  ${memoryFormat}

   :ping_pong:  Rita's Latency: **\`${botPing}\`** ms

   :stopwatch:  Proc Uptime:  ${uptimeFormat(procUptime)}

   :stopwatch:  Shard Uptime:  ${uptimeFormat(shardUptime)}

   :pager:  Current Shard:  **\`${data.message.guild.shardID + 1} / ${data.message.client.options.shardCount}\`**
   `;

   // -------------
   // Send message
   // -------------

   sendMessage(data);

};

// --------------
// Ident Message
// --------------

module.exports.ident = function ident (data)
{

   // ------------------
   // Gather ID Details
   // ------------------

   // console.log("DEBUG: ID Message");

   data.color = "info";
   data.text = `**User Name:** \`${data.message.guild.members.cache.get(data.message.author.id).user.username}\`\n` +
   `**Nick Name:** \`${data.message.guild.members.cache.get(data.message.author.id).nickname || "None"}\`\n` +
   `**User ID:** \`${data.message.author.id}\`\n\n` +
   `**Server Name:** \`${data.message.channel.guild.name}\`\n` +
   `**Server ID:** \`${data.message.channel.guild.id}\`\n\n` +
   `**Bot Name:** \`${data.message.client.user.username}\`\n` +
   `**Bot ID:** \`${data.message.client.user.id}\`\n\n` +
   `**Chan Name:** \`${data.message.channel.name}\`\n` +
   `**Chan ID:** \`${data.message.channel.id}\``;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// --------------
// Github Update
// --------------

module.exports.update = function update (data)
{

   const cmd = data.config.translateCmdShort;

   // --------------------
   // Update Instructions
   // --------------------

   // console.log("DEBUG: ID Message");

   data.color = "info";
   data.text = `*How to Update your bot:* \n\n` +
   `*Heroku Users* \n\n` +
   `**Step 1:** Retrieve your github.com account username \n\n` +
   `**Step 2:** Copy it and replace YOUR_GITHUB_USERNAME_HERE in the URL below: \n` +
   `**NOTE:** You can now run the command \`${cmd} updatelink\` to get a pre generate link.\n\n` +
   "```" +
   `https://github.com/YOUR_GITHUB_USERNAME_HERE/RitaBot/compare/master...RitaBot-Project:master \n\n` +
   "```\n" +
   `**Step 3:** Go to the URL & create the Pull Request. Give the PR a name & accept all changes. \n\n` +
   `**Step 4:** Finally, merge it and re-deploy your bot in Heroku. \n\n` +
   `If you need any help please join our discord server: https://discord.gg/mgNR64R \n\n`;

   // -------------
   // Send message
   // -------------

   try
   {

      setTimeout(() => data.message.delete(), auth.time.short);

   }
   catch (err)
   {

      console.log(
         "Command Message Deleted Error, misc.js = Line 299",
         err
      );

   }
   return botSend(data);

};

// -------------------
// Github Update Link
// -------------------

module.exports.updatelink = async function updatelink (data)
{

   // -----------------
   // Define Namespace
   // -----------------

   data.gitusername = null;

   // Announcment started - Collect Title.
   const filter = (m) => m.author.id === data.message.author.id;
   try
   {

      setTimeout(() => data.message.delete(), auth.time.short);

   }
   catch (err)
   {

      console.log(
         "Command Message Deleted Error, github.js = Line 333",
         err
      );

   }

   // ---------------------------
   // Request USername from User
   // ---------------------------

   await data.message.channel.send(`Please enter your github username.`).then(() =>
   {

      data.message.channel.awaitMessages(filter, {
         "errors": ["time"],
         "max": 1,
         "time": auth.time.long
      }).
         then((message) =>
         {

            data.gitusername = message.first();
            clean(data, 2);
            data.text = `Your github Update link is: https://github.com/${data.gitusername}/RitaBot/compare/master...RitaBot-Project:master`;
            return sendMessage(data);

         }).
         catch((collected) =>
         {

            data.message.channel.send(`No Responce Provided Or Error: - Username`);
            clean(data, 1);

         });

   });

   // --------------------
   // Clean up after send
   // --------------------

   function clean (data, value)
   {

      const messageManager = data.channel.messages;
      messageManager.fetch({"limit": value}).then((messages) =>
      {

         // `messages` is a Collection of Message objects
         messages.forEach((message) =>
         {

            message.delete();

         });

      });

   }

};
