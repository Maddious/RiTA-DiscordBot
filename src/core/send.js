// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable function-call-argument-newline */
/* eslint-disable consistent-return */
const colors = require("./colors");
const fn = require("./helpers");
const db = require("./db");
const logger = require("./logger");
const discord = require("discord.js");
const webHookName = "RITA Messaging System";
const error = require("./error");

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
         "embeds": data.message.embeds,
         "fields": data.fields,
         "footer": data.footer,
         "forward": data.forward,
         "guild": data.message.guild,
         "message": data.message,
         "origin": null,
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
      console.log("DEBUG: Line 65 - Send.js");
      return sendData.channel.guild.owner.
         send(writeErr).
         catch((err) => console.log("error", err, "warning", data.message.guild.name));

   }
   // console.log(`DEBUG: Perm Check 2 ${data.canWrite}`);

   if (data.forward)
   {

      const forwardChannel = data.message.client.channels.cache.get(data.forward);

      if (forwardChannel)
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

            // console.log("DEBUG: Error 50013 - Destination");
            logger("custom", {
               "color": "ok",
               "msg": `:exclamation: Write Permission Error - Destination\n
                  Server: **${data.channel.guild.name}** \n
                  Channel: **${forwardChannel.name}**\n
                  Chan ID: **${forwardChannel.id}**\n
                  Server ID: **${data.message.sourceID}**\n
                  Owner: **${data.message.guild.owner} - ${data.message.guild.owner.user.tag}**\n
                  The server owner has been notified . \n`
            });

            // console.log("DEBUG: Perms Error, Write Restricted 2");
            const writeErr =
            `:no_entry:  **${data.message.client.user.username}** does not have permission to write in ` +
            `the ${forwardChannel.name} channel on your server **` +
            `${sendData.channel.guild.name}**. Please fix.`;
            console.log("DEBUG: Line 147 - Send.js");
            return sendData.channel.guild.owner.
               send(writeErr).
               catch((err) => console.log("error", err, "warning", sendData.channel.guild.name));

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
         }).then(() =>
         {

            sendEmbeds(data);
            sendAttachments(data);

         }).
            catch((err) =>
            {

               let errMsg = err;

               // -------
               // Errors
               // -------

               if (err.code && err.code === error.content)
               {

                  data.channel.send(":warning:  Message is too long.");

               }

               if (err.code && err.code === error.perm || error.access)
               {

                  // console.log("DEBUG: Error 50013 - Origin");
                  return logger("custom", {
                     "color": "ok",
                     "msg": `:exclamation: Write Permission Error - Origin \n
                  Server: **${data.guild.name}** \n
                  Channel: **${data.channel.name}**\n
                  Chan ID: **${data.channel.id}**\n
                  Server ID: **${data.message.sourceID}**\n
                  Owner: **${data.message.guild.owner}**\n
                  The server owner has been notified. \n`
                  });

               }

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

               if (err.code && err.code === error.unknownUser || errorunknownMember || error.invalidRecipient)
               {

                  // console.log(`DEBUG: Error ${err.code}`);
                  return logger("custom", {
                     "color": "ok",
                     "msg": `:exclamation: Unknonw User / Member / Recipient \n
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

               // -----------------------------------------------------------
               // Handle error for users who cannot recieve private messages
               // -----------------------------------------------------------

               if (err.code && err.code === error.sendDm && data.origin)
               {

                  const badUser = data.channel.recipient;
                  errMsg = `@${badUser.username}#${badUser.discriminator}\n${err}`;

                  db.removeTask(data.origin.id, `@${badUser.id}`, function error (err)
                  {

                     if (err)
                     {

                        return logger("error", err, "dm", data.message.channel.guild.name);

                     }

                     return data.origin.send(`:no_entry: User ${badUser} cannot recieve direct messages ` +
                           `by bot because of **privacy settings**.\n\n__Auto ` +
                           `translation has been stopped. To fix this:__` +
                           "```prolog\nServer > Privacy Settings > " +
                           "'Allow direct messages from server members'\n```");

                  }).catch((err) => console.log(
                     "error",
                     err,
                     "warning"
                  ));

               }

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

      let files = null;

      if (data.attachments)
      {

         if (data.attachments.size !== 0)
         {

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
            files,
            "username": data.message.author.username
         }).catch((err) => console.log("error", err, "send", data.message.guild.name));

      }

      {

         if (!data.message.author)
         {

            // console.log("DEBUG: Is bot.author embed off");
            webhook.send(data.text, {
               // If you get a error at the below line then the bot does not have write permissions.

               "avatarURL": data.message.client.user.displayAvatarURL(),
               files,
               "username": data.message.client.user.username || data.message
            });

         }
         else
         {

            // console.log("DEBUG: Is data.message.author embed off");
            webhook.send(data.text, {
               // If you get a error at the below line then the bot does not have write permissions.

               "avatarURL": data.message.author.displayAvatarURL(),
               files,
               "username": data.message.author.username || data.message
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

         console.log("DEBUG: Line 690 - Send.js");
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
               const webHookURL = "https://ritabot.gg/index/images/favicon.png";

               if (!existingWebhook)
               {

                  channel.createWebhook(webHookName, webHookURL).
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

// ---------------------
// Send Data to Channel
// ---------------------

// eslint-disable-next-line complexity
module.exports = function run (data)
{

   // Const before = Date.now();


   // Const guildValue = data.message.guild.id;
   data.channel = data.message.channel;

   // --------------------
   // Primary If Statment
   // --------------------
   const embedstyle = db.server_obj[data.message.guild.id].db.embedstyle;
   if (embedstyle === "on")
   {

      // console.log("DEBUG: Embed on");

      const col = "embedon";
      let id = "bot";
      db.increaseStatsCount(col, id);

      if (data.message.channel.type === "text")
      {

         id = data.message.channel.guild.id;

      }

      db.increaseStatsCount(col, id);

      return embedOn(data);

   }
   else if (data.message.guild.me.permissions.has("MANAGE_WEBHOOKS"))
   {

      // console.log("DEBUG: Embed off");

      const col = "embedoff";
      let id = "bot";
      db.increaseStatsCount(col, id);

      if (data.message.channel.type === "text")
      {

         id = data.message.channel.guild.id;

      }

      db.increaseStatsCount(col, id);

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

};
