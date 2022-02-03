// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const langCheck = require("../../core/lang.check");
const translate = require("../../core/translate");
const fn = require("../../core/helpers");
const db = require("../../core/db");
const logger = require("../../core/logger");
const countryLangs = require("../../core/country.langs");
const auth = require("../../core/auth");

// ----------------------------------------------------
// Translate a message through discord reaction (flag)
// ----------------------------------------------------

module.exports = function run (data, client)
{

   // ---------------------
   // Get country by emoji
   // ---------------------

   const emoji = data.emoji.name;

   if (Object.prototype.hasOwnProperty.call(
      emoji && countryLangs,
      emoji
   ))
   {

      // ------------------------------------------------
      // Stop proccessing if country has no langs / null
      // ------------------------------------------------

      const serverID = data.guild_id;

      db.getServerInfo(
         serverID,
         function getServerInfo (server)
         {

            if (server.length === 0)
            {

               return logger("custom", {
                  "color": "ok",
                  "msg": `:exclamation: Emoji Reaction Failed \n
                  ServerID: **${data.guild_id || "Unknown"}** \n
                  Chan ID: **${data.channel_id || "Unknown"}**\n
                  Message ID **${data.message_id || "Unknown"}**\n
                  User ID: **${data.member.user.id || "Unknown"}**\n
                  Emoji: **${data.emoji.name || "Unknown"}**\n`
               });

            }

            if (server[0].flag === true || server[0].flag === 1)
            {

               if (!countryLangs[emoji].langs)
               {

                  return;

               }

               // -----------------
               // Get message data
               // -----------------

               fn.getMessage(
                  client,
                  data.message_id,
                  data.channel_id,
                  data.user_id,
                  (message, err) =>
                  {

                     if (err)
                     {

                        return logger(
                           "error",
                           err,
                           "react",
                           data.guild_id
                        );

                     }

                     // Ignore bots

                     if (message.author.bot)
                     {

                        return;

                     }

                     message.content = message.content.
                        replace(/<@.*?>/g, "").
                        replace(/@everyone/gi, "").
                        replace(/@here/gi, "");


                     const flagExists = message.reactions.cache.get(emoji);

                     // Prevent flag spam

                     if (flagExists.count > 1)
                     {

                        return;

                     }

                     // Translate data

                     data.translate = {
                        "from": langCheck("auto"),
                        "multi": true,
                        "original": message.content,
                        "to": langCheck(countryLangs[emoji].langs)
                     };

                     // Message data

                     data.message = message;
                     message.server = server;
                     delete data.message.attachments;
                     data.member.displayColor = fn.getRoleColor(data.message.member);
                     data.canWrite = true;
                     data.reactuser = data.user_id;
                     data.reaction = true;

                     // ------------------
                     // Start translation
                     // ------------------

                     if (message.channel.type === "text")
                     {

                        db.increaseStatsCount("react", data.message.guild.id);

                     }

                     translate(data);
                     if (server[0].flagpersist === false || server[0].flagpersist === 0)
                     {

                        try
                        {

                           setTimeout(() => data.message.reactions.resolve(emoji).users.remove(data.reactuser), auth.time.short);

                        }
                        catch (err)
                        {

                           console.log(
                              "Command Message Deleted Error, translate.react.js = Line 152",
                              err
                           );

                        }

                     }

                  }
               );

            }

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


   }

};
