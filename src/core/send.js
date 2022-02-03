// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable function-call-argument-newline */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
const colors = require("./colors");
const fn = require("./helpers");
const db = require("./db");
const logger = require("./logger");
const discord = require("discord.js");
const webHookName = "RITA";
const error = require("./error");
const auth = require("../core/auth");
const {oneLine} = require("common-tags");

// -----------------
// Permission Check
// -----------------

function e50013 (data, eh, forwardChannel, sendData)
{

   let target = null;
   if (eh === "o")
   {

      target = data.channel.id;

   }
   else
   {

      target = forwardChannel.id;

   }
   const col = "errorcount";
   const id = data.message.guild.id || data.message.sourceID;
   const tag = `${data.message.guild.owner.user.username}#${data.message.guild.owner.user.discriminator}`;
   db.increaseServersCount(col, id);

   db.checkTask(
      data.message.guild.id || data.message.sourceID,
      target,
      eh,
      async function error (err, res)
      {

         if (err)
         {

            return dbError(
               err,
               data
            );

         }

         // -----------------------------
         // Error if task does not exist
         // -----------------------------

         if (res.length < 1 || !res)
         {

            return;
            // console.log(`Somthing has gone really really wrong`);

         }

         // ------------------------------------------------
         // Otherwise, proceed to remove task from database
         // ------------------------------------------------

         if (eh === "o")
         {

            // console.log("DEBUG: Error 50013 - Origin");
            await logger("custom", {
               "color": "ok",
               "msg": `:exclamation: Write Permission Error - ${eh} \n
               Task ID: **${res[0].id || "Unknown"}** \n
               Server: **${data.guild.name || "Unknown"}** \n
               Channel: **${data.channel.name || "Unknown"}**\n
               Chan ID: **${data.channel.id || "Unknown"}**\n
               Server ID: **${data.message.guild.id || data.message.sourceID || "Zycore Broke It Again"}**\n
               Owner: **${data.message.guild.owner || "Unknown"}**\n
               Dscord Tag: **${tag || "Unknown"}**\n
               The server owner has been notified. \n`
            });

            const writeErr =
            `:no_entry:  **${data.message.client.user.username}** does not have permission to write in ` +
            `the ${data.channel.name} channel on your server **` +
            `${data.channel.guild.name}**. Please fix.`;
            // console.log("DEBUG: Line 100 - Send.js");
            return data.channel.guild.owner.
               send(writeErr).
               catch((err) => console.log("error", err, "warning", data.channel.guild.name));

         }

         if (eh === "d")
         {

            // console.log("DEBUG: Error 50013 - Destination");
            await logger("custom", {
               "color": "ok",
               "msg": `:exclamation: Write Permission Error - Destination\n
               Task ID: **${res[0].id || "Unknown"}** \n
               Server: **${data.channel.guild.name || "Unknown"}** \n
               Channel: **${forwardChannel.name || "Unknown"}**\n
               Chan ID: **${forwardChannel.id || "Unknown"}**\n
               Server ID: **${data.message.guild.id || data.message.sourceID || "Zycore Broke It Again"}**\n
               Owner: **${data.message.guild.owner || "Unknown"}**\n
               Dscord Tag: **${tag || "Unknown"}**\n
               The server owner has been notified. \n`
            });

            const writeErr =
            `:no_entry:  **${data.message.client.user.username}** does not have permission to write in ` +
            `the ${forwardChannel.name} channel on your server **` +
            `${sendData.channel.guild.name}**. Please fix.`;
            // console.log("DEBUG: Line 128 - Send.js");
            return sendData.channel.guild.owner.
               send(writeErr).
               catch((err) => console.log("error", err, "warning", sendData.channel.guild.name));

         }

      }
   );

}
// -----------------
// Permission Check
// -----------------

function checkPerms (data, sendBox)
{

   // ------------------------------------------------------------------------
   // Analyze Data and determine sending style (system message or author box)
   // ------------------------------------------------------------------------

   // eslint-disable-next-line complexity
   {


      var sendData = {
         "attachments": data.message.attachments,
         "bot": data.message.client.user,
         "channel": data.message.channel,
         "color": data.color,
         "config": data.config,
         "detectedLang": data.detectedLang,
         "embeds": data.message.embeds,
         "fields": data.fields,
         "footer": data.footer,
         "forward": data.forward,
         "guild": data.message.guild,
         "message": data.message,
         "origin": null,
         "reaction": data.reaction,
         "temp": null,
         "text": data.text,
         "title": data.title
      };

   }

   // ---------------------------------------------------
   // Notify server owner if bot cannot write to channel
   // ---------------------------------------------------

   if (!data.canWrite)
   {

      // console.log("DEBUG: Perms Error, Write Restricted 1");
      // console.log(`DEBUG: Perm Check 1 ${data.canWrite}`);
      const writeErr =
         `:no_entry:  **${data.message.client.user.username}** does not have permission to write in ` +
         `the ${sendData.channel.id} channel on your server **` +
         `${sendData.channel.guild.name}**. Please fix.`;
      // console.log("DEBUG: Line 189 - Send.js");
      return sendData.channel.guild.owner.
         send(writeErr).
         catch((err) => console.log("error", err, "warning", data.message.guild.name));

   }
   // console.log(`DEBUG: Perm Check 2 ${data.canWrite}`);

   if (data.forward)
   {

      const forwardChannel = data.message.client.channels.cache.get(data.forward);

      if (forwardChannel)
      // if (forwardChannel || data.forward.includes("@"))
      {

         // ----------------------------------------------
         // Check if bot can write to destination channel
         // ----------------------------------------------

         let canWriteDest = true;

         if (forwardChannel.type === "text")
         {

            canWriteDest = fn.checkPerm(
               forwardChannel.guild.me,
               forwardChannel,
               "SEND_MESSAGES"
            );

         }

         if (canWriteDest)
         {

            sendData.origin = sendData.channel;
            sendData.channel = forwardChannel;

         }

         // ----------------------------------
         // Error if bot cannot write to dest
         // ----------------------------------

         else
         {

            sendData.footer = null;
            sendData.embeds = null;
            sendData.color = "error";
            sendData.text =
                  ":no_entry:  Bot does not have permission to write in  " +
                  `<#${forwardChannel.id}> channel. Please fix.`;

            // -------------
            // Send message
            // -------------

            sendBox(sendData);

            // --------------------------------------------------------------
            // Notify server owner if bot cannot write to forwarding channel
            // --------------------------------------------------------------

            return e50013(data, "d", forwardChannel, sendData);

         }

      }

      // ---------------------------------
      // Error on invalid forward channel
      // ---------------------------------

      else
      {

         sendData.footer = null;
         sendData.embeds = null;
         sendData.color = "error";
         sendData.text = ":warning:  Invalid channel.";

         // -------------
         // Send message
         // -------------

         return sendBox(sendData);

      }

   }

   if (data.showAuthor)
   {

      sendData.message.author = data.message.author;

      if (data.message.author)
      {

         sendData.message.author = data.message.author;

      }

   }

   // -------------
   // Send message
   // -------------

   return sendBox(sendData);

}

// ----------------------
// Flag Persist Function
// ----------------------

function reactpersist (data, msg)
{


   if (data.reaction === true && data.message.server[0].reactpersist === false || data.message.server[0].reactpersist === 0)
   {

      // console.log("DEBUG: Delete reacted Message");
      try
      {

         setTimeout(() => msg.delete(), auth.time.long);

      }
      catch (err)
      {

         console.log(
            "Command Message Deleted Error, send.js = Line 327",
            err
         );

      }

   }

}

// ----------------------------
// Embedded Variable "On" Code
// ----------------------------

function embedOn (data)
{

   // -----------------------------------------------
   // Resend embeds from original message
   // Only if content is forwared to another channel
   // -----------------------------------------------

   function sendEmbeds (data)
   {

      if (data.forward && data.embeds && data.embeds.length > 0)
      {

         const maxEmbeds = data.config.maxEmbeds;

         if (data.embeds.length > maxEmbeds)
         {

            // eslint-disable-next-line no-use-before-define
            sendBox({
               "channel": data.channel,
               "color": "warn",
               "text": `:warning:  Cannot embed more than ${maxEmbeds} links.`
            });

            data.embeds = data.embeds.slice(0, maxEmbeds);

         }

         for (let i = 0; i < data.embeds.length; i += 1)
         {

            data.channel.send(data.embeds[i].url);

         }

      }

   }

   // -------------------
   // Resend attachments
   // -------------------

   function sendAttachments (data)
   {


      if (!data.attachments)
      {

         return;

      }
      let attachments = data.attachments.array();

      if (attachments && attachments.length > 0)
      {

         if (data.origin.id === data.forward)
         {

            if (data.message.content.startsWith("https://tenor.com/"))
            {

               // console.log("DEBUG: Embed ON: Same channel GIF translation, GIF ignored");
               return;

            }
            // console.log("DEBUG: Embed On: Same channel image translation, Image ignored");
            return;

         }
         const maxAtt = data.config.maxEmbeds;

         if (attachments.length > maxAtt)
         {

            // eslint-disable-next-line no-use-before-define
            sendBox({
               "channel": data.channel,
               "color": "warn",
               "text": `:warning:  Cannot attach more than ${maxAtt} files.`

            });
            attachments = attachments.slice(0, maxAtt);

         }

         for (let i = 0; i < attachments.length; i += 1)
         {

            const attachmentObj = new discord.MessageAttachment(
               attachments[i].url,
               attachments[i].name
            );
            data.channel.send(`**${data.message.author.username}** sent a file:`, attachmentObj);

         }

      }

   }

   // ----------
   // Send data
   // ----------

   function sendBox (data)
   {


      /*
      If (data.message.author)
      {
         data.message.author = {
            name: data.message.author.username,
            //eslint-disable-next-line camelcase
            icon_url: data.message.author.displayAvatarURL()
         };
      }*/


      if (data.origin)

      {

         if (data.origin.id === data.forward && data.message.content.startsWith("https://tenor.com/"))
         {

            // console.log("DEBUG: Embed ON: Same channel GIF translation, GIF ignored");
            return;

         }
         if (data.origin.id === data.forward && data.message.content.startsWith("<:") && data.message.content.endsWith(">"))
         {

            // console.log("DEBUG: Embed ON: Same channel Single Emoji translation, Emoji ignored");
            return;

         }

      }
      if (data.text && data.text.length > 1)
      {

         {

            if (!data.message.author)
            {

               // console.log("DEBUG: Is bot.author - embed on");
               // eslint-disable-next-line no-redeclare
               var embed = {
                  "author": {
                     "icon_url": data.message.client.user.displayAvatarURL(),
                     "name": data.message.client.user.username
                  },
                  "color": colors.get(data.color),
                  "description": data.text,
                  "fields": data.fields,
                  "footer": data.footer,
                  "title": data.title
               };

            }
            else
            {

               // console.log("DEBUG: Is data.message.author - embed on");
               // eslint-disable-next-line no-redeclare
               var embed = {
                  "author": {
                     "icon_url": data.message.author.displayAvatarURL(),
                     "name": data.message.author.username
                  },
                  "color": colors.get(data.color),
                  "description": data.text,
                  "fields": data.fields,
                  "footer": data.footer,
                  "title": data.title
               };

            }

         }

         data.channel.send({

            embed
         }).then((msg) =>
         {

            sendEmbeds(data);
            sendAttachments(data);
            reactpersist(data, msg);

         }).
            catch((err) =>
            {

               let errMsg = null;

               // -------
               // Errors
               // -------

               // console.log(`DEBUG: Error Code ${err.code}`);
               if (err.code && err.code === error.content)
               {

                  data.channel.send(":warning:  Message is too long.");

               }
               // console.log("DEBUG: Not 50035");

               if (err.code && err.code === error.perm || err.code === error.access)
               {

                  return e50013(data, "o");

               }
               // console.log("DEBUG: Not 50013 or 50001");

               if (err.code && err.code === error.fileTooLarge)
               {

                  // console.log("DEBUG: Error 40005");
                  return logger("custom", {
                     "color": "ok",
                     "msg": `:exclamation: File To Large \n
                  Server: **${data.guild.name}** \n
                  Channel: **${data.channel.name}**\n
                  Chan ID: **${data.channel.id}**\n
                  Owner: **${data.channel.guild.owner}**\n`
                  }).catch((err) => console.log(
                     "error",
                     err,
                     "warning"
                  ));

               }
               // console.log("DEBUG: Not 40035");

               if (err.code && err.code === error.unknownUser || err.code === error.unknownMember || err.code === error.invalidRecipient)
               {

                  // console.log(`DEBUG: Error ${err.code}`);
                  return logger("custom", {
                     "color": "ok",
                     "msg": `:exclamation: Unknown User / Member / Recipient \n
                  Server: **${data.guild.name}** \n
                  Channel: **${data.channel.name}**\n
                  Chan ID: **${data.channel.id}**\n
                  Owner: **${data.channel.guild.owner}**\n`
                  }).catch((err) => console.log(
                     "error",
                     err,
                     "warning"
                  ));

               }
               // console.log("DEBUG: Not 10013 or 10007 or 50033");

               // -----------------------------------------------------------
               // Handle error for users who cannot recieve private messages
               // -----------------------------------------------------------

               if (err.code && err.code === error.sendDm && data.origin)
               {

                  const badUser = data.channel.recipient;
                  errMsg = `@${badUser.username}#${badUser.discriminator}\n${err}`;
                  const user = data.message.guild.members.cache.get(badUser.id);

                  db.removeTask(data.origin.id, `@${badUser.id}`, function error (err)
                  {

                     if (err)
                     {

                        return logger("error", err, "dm", data.message.channel.guild.name);

                     }

                     if (!user)
                     {

                        return data.origin.send(`:no_entry: User ${badUser} cannot recieve direct messages as they have left the server`);

                     }
                     else if (user)
                     {

                        return data.origin.send(`:no_entry: User ${badUser} cannot recieve direct messages ` +
                           `from RITA because of **privacy settings**.\n\n__Auto ` +
                           `translation has been stopped. To fix this:__` +
                           "```prolog\nServer > Privacy Settings > " +
                           "'Allow direct messages from server members'\n```");

                     }

                  }).catch((err) => console.log(
                     "error",
                     err,
                     "warning"
                  ));

               }
               // console.log("DEBUG: Not 50007");
               console.log(`DEBUG: No catch for this erorr - Code:${err.code}`);

               logger("error", errMsg, "warning", data.message.channel.guild.name);

            }).
            catch((err) => console.log(
               "error",
               err,
               "warning"
            ));

      }
      else if (data.attachments.array().length > 0)
      {

         sendAttachments(data);

      }

   }

   return checkPerms(data, sendBox);

}

// -----------------------------
// Embedded Variable "Off" Code
// -----------------------------

function embedOff (data)
{

   // -------------
   // Create Files
   // -------------
   function createFiles (dataAttachments)
   {

      if (!dataAttachments && !dataAttachments.array().length > 0)
      {

         return;

      }
      const attachments = dataAttachments.array();
      const files = [];
      if (attachments && attachments.length > 0)
      {

         for (let i = 0; i < attachments.length; i += 1)
         {

            const attachmentObj = new discord.MessageAttachment(
               attachments[i].url,
               attachments[i].name
            );
            files.push(attachmentObj);

         }

      }
      return files;

   }

   // ------------------
   // Send Webhook Data
   // ------------------

   function sendWebhookMessage (webhook, data)
   {


      if (data.message.server[0].servertags === "none")
      {

         serverTags = "none";

      }

      if (data.message.server[0].servertags === "everyone")
      {

         serverTags = "everyone";

      }

      if (data.message.server[0].servertags === "all")
      {

         serverTags = "all";

      }

      let files = null;

      if (data.attachments)
      {

         if (data.origin.id === data.forward && data.message.content.startsWith("https://tenor.com/"))
         {

            // console.log("DEBUG: Embed Off: Same channel GIF translation, GIF ignored");
            return;

         }
         if (data.attachments.size !== 0)
         {

            if (data.origin.id === data.forward)
            {

               // console.log("DEBUG: Embed Off: Same channel image translation, Image ignored");
               return;

            }

            files = createFiles(data.attachments);

         }

      }
      else
      {

         files = null;

      }
      if (files !== null && data.text === undefined)
      {

         return webhook.send(null, {
            "avatarURL": data.message.author.displayAvatarURL(),
            "disableMentions": serverTags,
            files,
            "username": data.message.author.username
         }).catch((err) => console.log("error", err, "send", data.message.guild.name));

      }

      if (data.message.server[0].langdetect === true || data.message.server[0].langdetect === 1)
      {

         if (!data.reaction)

         {

            data.temp = data.text;
            data.text = `\n${oneLine`
               \`Source Lang: ${data.detectedLang}\`
               `}`;
            data.text += `\n${oneLine`
               \`Message\`: ${data.temp}
               `}`;
            // data.text += data.temp;

         }

      }

      {

         if (!data.message.author)
         {

            // console.log("DEBUG: Is bot.author embed off");
            webhook.send(data.text, {
               // If you get a error at the below line then the bot does not have write permissions.

               "avatarURL": data.message.client.user.displayAvatarURL(),
               "disableMentions": serverTags,
               files,
               "username": data.message.client.user.username || data.message
            }).then((msg) =>
            {

               reactpersist(data, msg);

            });

         }
         else
         {

            // console.log("DEBUG: Is data.message.author embed off");
            webhook.send(data.text, {
               // If you get a error at the below line then the bot does not have write permissions.

               "avatarURL": data.message.author.displayAvatarURL(),
               "disableMentions": serverTags,
               files,
               "username": data.message.author.username || data.message
            }).then((msg) =>
            {

               reactpersist(data, msg);

            });

         }

      }


   }

   // -------------------
   // Resend attachments
   // -------------------

   function sendAttachments (data)
   {

      if (!data.attachments && !data.attachments.array().length > 0)
      {

         return;

      }
      let attachments = data.attachments.array();

      if (data.forward && attachments && attachments.length > 0)
      {

         const maxAtt = data.config.maxEmbeds;

         if (attachments.length > maxAtt)
         {

            // eslint-disable-next-line no-use-before-define
            sendBox({
               "channel": data.channel,
               "color": "warn",
               "text": `:warning:  Cannot attach more than ${maxAtt} files.`

            });
            attachments = attachments.slice(0, maxAtt);

         }

         for (let i = 0; i < attachments.length; i += 1)
         {

            const attachmentObj = new discord.MessageAttachment(
               attachments[i].url,
               attachments[i].name
            );
            data.channel.send(attachmentObj);

         }

      }

   }

   // ---------------------
   // Send Data to Channel
   // ---------------------

   function sendBox (data)
   {

      const channel = data.channel;


      let color = colors.get(data.color);
      let avatarURL = null;
      if (!channel)
      {

         return console.log("Channel not specified.");

      }
      // Sets the color of embed message but no embed message used so thus unused.
      if (!color)
      {

         color = colors.get(data.color);

      }
      if (!avatarURL)
      {

         avatarURL = data.message.author;

      }

      // -----------------------------
      // Webhook Creation and Sending
      // -----------------------------

      if (data.channel.type === "dm")
      {

         // console.log("DEBUG: Line 946 - Send.js");
         const embed = new discord.MessageEmbed().
            setAuthor(data.message.author.username, data.message.author.displayAvatarURL()).
            setColor(colors.get(data.color)).
            setDescription(data.text).
            setFooter(data.footer.text);
         sendAttachments(data);
         data.channel.send({embed});

      }

      else
      {

         channel.fetchWebhooks().
            then((webhooks) =>
            {

               // You can rename 'Webhook' to the name of your bot if you like, people will see if under the webhooks tab of the channel.
               const existingWebhook = webhooks.find((x) => x.name === webHookName);
               const oldWebhook2 = webhooks.find((x) => x.name === "RITA Messaging-System");
               const oldWebhook1 = webhooks.find((x) => x.name === "RITA Messaging System");
               const avatar = "https://ritabot.gg/index/images/favicon.png";

               if (oldWebhook1)
               {

                  oldWebhook1.delete(`Requested by RITA`);
                  // console.log("DEBUG: Successfully deleted Old RITA Webhook from channel.");

               }
               else if (oldWebhook2)
               {

                  oldWebhook2.delete(`Requested by RITA`);
                  // console.log("DEBUG: Successfully deleted Old RITA Webhook from channel.");

               }
               if (!existingWebhook)
               {

                  channel.createWebhook(webHookName, {avatar}).
                     then((newWebhook) =>
                     {

                        // Finally send the webhook
                        sendWebhookMessage(newWebhook, data);

                     });

               }
               else
               {

                  sendWebhookMessage(existingWebhook, data);

               }

            });

      }

   }


   checkPerms(data, sendBox);

}

// -----------------
// Primary Fucntion
// -----------------

// eslint-disable-next-line complexity
module.exports = function run (data)
{

   // Const before = Date.now();


   // Const guildValue = data.message.guild.id;
   data.channel = data.message.channel;

   // --------------------
   // Primary If Statment
   // --------------------
   try
   {

      const embedstyle = data.message.server[0].embedstyle;
      if (embedstyle === "on")
      {

         // console.log("DEBUG: Embed on");

         if (data.message.channel.type === "text")
         {

            db.increaseStatsCount("embedon", data.message.channel.guild.id);

         }

         return embedOn(data);

      }
      else if (data.message.guild.me.permissions.has("MANAGE_WEBHOOKS"))
      {

         // console.log("DEBUG: Embed off");

         if (data.message.channel.type === "text")
         {

            db.increaseStatsCount("embedon", data.message.channel.guild.id);

         }

         return embedOff(data);

      }

      // Const after = Date.now();
      // Console.log(after - before);

      // console.log("DEBUG: Perms Error");
      data.text = `:warning: ${data.message.client.user.username} does not have sufficient permissions to send Webhook Messages. Please give ${data.message.client.user.username} the \`MANAGE_WEBHOOKS\` permission.`;
      data.color = "warn";

      return data.channel.send({"embed": {
         "color": colors.get(data.color),
         "description": data.text

      }});

   }
   catch (err)
   {

      // console.log(
      //   `CRITICAL: Send Error, send.js = Run/Line 1032 - SERVER: ${data.message.guild.id}`,
      //   err
      // );

      // console.log(`CRITICAL: Send Error, send.js = Run/Line 1032 - SERVER: ${data.message.guild.id}`);

   }

};
