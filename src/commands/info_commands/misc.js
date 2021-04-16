// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-irregular-whitespace*/
const auth = require("../../core/auth");
const fn = require("../../core/helpers");
const logger = require("../../core/logger");
const process = require("process");
const {stripIndent} = require("common-tags");
const {oneLine} = require("common-tags");
const secConverter = require("seconds-converter");
const sendMessage = require("../../core/command.send");

// ------------
// Invite Link
// ------------

exports.invite = function invite (data)
{

   data.color = "info";
   data.text = `Invite ${data.bot} `;
   data.text += `\`v${data.config.version}\` to your server\n\n`;
   data.text += `${auth.invite}`;
   data.footer = {
      text:
         "Requires VIEW, SEND, REACT, EMBED, ATTACH and MENTION permissions.\n"
   };

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// -----------------------
// Get info on all shards
// -----------------------

exports.shards = function shards (data)
{

   // ---------------
   // Get shard info
   // ---------------

   const {shard} = data.message.client;

   if (!shard)
   {

      // ---------------
      // Render message
      // ---------------

      data.title = "Shards Info";

      data.footer = {
         text: "Single Process - No Sharding Manager"
      };

      data.color = "info";

      data.text = `​\n${oneLine`
         :bar_chart:  ​
         **${data.message.client.guilds.size}**  guilds  ·  ​
         **${data.message.client.channels.size}**  channels  ·  ​
         **${data.message.client.users.size}**  users
      `}\n​`;

      // -------------
      // Send message
      // -------------

      return sendMessage(data);

   }

   // --------------------------
   // Get proccess/shard uptime
   // --------------------------

   const shardErr = function shardErr (err)
   {

      return logger(
         "error",
         err,
         "shardFetch",
         data.message.guild.name
      );

   };

   shard.fetchClientValues("guilds.size").then((guildsSize) =>
   {

      shard.fetchClientValues("channels.size").then((channelsSize) =>
      {

         shard.fetchClientValues("users.size").then((usersSize) =>
         {

            const output = [];

            for (let i = 0; i < shard.count; ++i)
            {

               output.push({
                  inline: true,
                  name: `:pager: - Shard #${i}`,
                  value: stripIndent`
                     ​
                     **\`${guildsSize[i]}\`** guilds

                     **\`${channelsSize[i]}\`** channels

                     **\`${usersSize[i]}\`** users
                     ​
                  `
               });

            }

            // ---------------
            // Render message
            // ---------------

            data.title = "Shards Info";

            data.text = `​\n${oneLine`
               :bar_chart:   Total:  ​
               **${shard.count}**  shards  ·  ​
               **${fn.arraySum(guildsSize)}**  guilds  ·  ​
               **${fn.arraySum(channelsSize)}**  channels  ·  ​
               **${fn.arraySum(usersSize)}**  users
            `}\n​`;

            data.color = "info";

            data.fields = output;

            // -------------
            // catch errors
            // -------------

         }).
            catch(shardErr);

      }).
         catch(shardErr);

   }).
      catch(shardErr);

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// ----------------------
// Current proccess info
// ----------------------

exports.proc = function proc (data)
{

   // ------------------
   // Get proccess data
   // ------------------

   const title = `**\`${process.title}\`** `;
   const pid = `**\`#${process.pid}\`** `;
   const platform = `**\`${process.platform}\`** `;

   // ---------------
   // Get shard info
   // ---------------

   let {shard} = data.message.client;

   if (!shard)
   {

      shard = {
         count: 1,
         id: 0

      };

   }

   // -----------------------
   // Byte formatter (mb/gb)
   // -----------------------

   const byteFormat = function byteFormat (bytes)
   {

      if (bytes > 750000000)
      {

         const gb = bytes / 1000 / 1000 / 1000;
         return `${gb.toFixed(3)} gb`;

      }

      const mb = bytes / 1000 / 1000;
      return `${mb.toFixed(2)} mb`;

   };

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

   const uptimeFormat = function uptimeFormat (uptime)
   {

      return oneLine`
         **\`${uptime.days}\`** days
         **\`${uptime.hours}:${uptime.minutes}:${uptime.seconds}\`**
      `;

   };

   // ---------------
   // Render message
   // ---------------

   data.text = stripIndent`
      :robot:  Process:  ${title + pid + platform}

      :control_knobs:  RAM:  ${memoryFormat}

      :stopwatch:  Proc Uptime:  ${uptimeFormat(procUptime)}

      :stopwatch:  Shard Uptime:  ${uptimeFormat(shardUptime)}

      :pager:  Current Shard:  **\`${shard.id + 1} / ${shard.count}\`**
   `;

   // -------------
   // Send message
   // -------------

   sendMessage(data);

};
