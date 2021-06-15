// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const sendMessage = require("../../core/command.send");
const auth = require("../../core/auth");
const time = {
   "long": 30000,
   "short": 5000
};
// --------------------
// Announce to servers
// --------------------

async function announcement (data)
{

   data.announcement = {
      "heading": null,
      "message": null,
      "title": null
   };
   // Announcment started - Collect Title.
   const filter = (m) => m.author.id === data.message.author.id;
   data.message.delete({"timeout": time.short}).catch((err) => console.log(
      "Command Message Deleted Error, command.send.js = ",
      err
   ));
   await data.message.channel.send(`Please enter Anouncment Title.`).then(() =>
   {

      data.message.channel.awaitMessages(filter, {
         "errors": ["time"],
         "max": 1,
         "time": 30000
      }).
         then((message) =>
         {

            data.announcement.title = message.first();
            body(data);

         }).
         catch((collected) =>
         {

            data.message.channel.send(`No Title Provided - Command Timed out - Title`);

         });

   });

   async function body (data)
   {

      await data.message.channel.send(`Please Enter message you wish to send.`).then(() =>
      {

         data.message.channel.awaitMessages(filter, {
            "errors": ["time"],
            "max": 1,
            "time": 30000
         }).
            then((message) =>
            {

               data.announcement.message = message.first();
               embedOption(data);

            }).
            catch((collected) =>
            {

               data.message.channel.send(`No Message Provided - Command Timed out - Message`);

            });

      });

   }

   async function embedOption (data)
   {

      await data.message.channel.send(`Would you like to send as a Embed or Normal Message`).then(() =>
      {

         data.message.channel.awaitMessages(filter, {
            "errors": ["time"],
            "max": 1,
            "time": 30000
         }).
            then((message) =>
            {

               let responce = null;
               let responceLower = null;
               responce = message.first();
               responceLower = responce.content.toLowerCase();
               console.log(`${responce} & ${responceLower}`);
               if (responceLower === "embed" || responceLower === "e")
               {

                  reviewEmbed(data);

               }
               else if (responceLower === "normal" || responceLower === "n")
               {

                  reviewNormal(data);

               }
               else
               {

                  data.message.channel.send(`Command Terminated: Invalid Response`);

               }

            }).
            catch((collected) =>
            {

               data.message.channel.send(`No Responce Provided - Command Timed out - Embed Option
                     ${collected}`);

            });

      });

   }

   async function reviewNormal (data)
   {

      await data.message.channel.send(`Please Review the message, Do you want to send.? \`YES\` / \`NO\``).then(() =>
      {

         data.message.channel.send(`This is a Message from the RITA Dev Team\n\n${data.announcement.message}\n${data.announcement.title}`);

         data.message.channel.awaitMessages(filter, {
            "errors": ["time"],
            "max": 1,
            "time": 30000
         }).then((message) =>
         {

            let responce = null;
            let responceLower = null;
            responce = message.first();
            responceLower = responce.content.toLowerCase();
            console.log(`${responce} & ${responceLower}`);
            if (responceLower === "yes" || responceLower === "y")
            {

               data.message.channel.send(`Announcment has been sent!`).then((msg) =>
               {

                  msg.delete({"timeout": time.long}).catch((err) => console.log(
                     "Bot Message Deleted Error, command.send.js = ",
                     err
                  ));

               });

               let i = 0;
               data.message.client.guilds.cache.forEach((guild) =>
               {

                  i += 1;
                  if (guild.id && guild.systemChannel && guild.systemChannel.permissionsFor(guild.me).has("SEND_MESSAGES"))
                  {

                     console.log(`Message ${i} Sent: ${guild.id}`);
                     return guild.systemChannel.send(`This is a Message from the RITA Dev Team\n\n${data.announcement.message}\n${data.announcement.title}`);

                  }

               });
               clean(data);

            }
            else if (responceLower === "no" || responceLower === "n")
            {

               data.message.channel.send(`Command Terminated`);
               clean(data);

            }
            else
            {

               data.message.channel.send(`Command Terminated: Invalid Response`);
               clean(data);

            }

         }).
            catch((collected) =>
            {

               data.message.channel.send(`No Responce Provided - Command Timed out - Review Normal
                  ${collected}`);
               clean(data);

            });

      });

   }

   async function reviewEmbed (data)
   {

      await data.message.channel.send(`Please Review the message, Do you want to send.? \`YES\` / \`NO\``).then(() =>
      {

         data.message.channel.send({"embed": {
            "color": 9514728,
            "description": `${data.announcement.message}`,
            "footer": {
               "text": "This is a Message from the RITA Dev Team\nRITA is developed by the RITA Bot Project"
            },
            "title": `${data.announcement.title}`
         }});

         data.message.channel.awaitMessages(filter, {
            "errors": ["time"],
            "max": 1,
            "time": 30000
         }).then((message) =>
         {

            let responce = null;
            let responceLower = null;
            responce = message.first();
            responceLower = responce.content.toLowerCase();
            console.log(`${responce} & ${responceLower}`);
            if (responceLower === "yes" || responceLower === "y")
            {

               data.message.channel.send(`Announcment has been sent!`).then((msg) =>
               {

                  msg.delete({"timeout": time.long}).catch((err) => console.log(
                     "Bot Message Deleted Error, command.send.js = ",
                     err
                  ));

               });

               let i = 0;
               data.message.client.guilds.cache.forEach((guild) =>
               {

                  i += 1;
                  if (guild.id && guild.systemChannel && guild.systemChannel.permissionsFor(guild.me).has("SEND_MESSAGES"))
                  {

                     console.log(`Message ${i} Sent: ${guild.id}`);
                     return guild.systemChannel.send({"embed": {
                        "color": 9514728,
                        "description": `${data.announcement.message}`,
                        "footer": {
                           "text": "This is a Message from the RITA Dev Team\nRITA is developed by the RITA Bot Project"
                        },
                        "title": `${data.announcement.title}`
                     }});

                  }

               });
               clean(data);

            }
            else if (responceLower === "no" || responceLower === "n")
            {

               data.message.channel.send(`Command Terminated`);
               clean(data);

            }
            else
            {

               data.message.channel.send(`Command Terminated: Invalid Response`);
               clean(data);

            }

         }).
            catch((collected) =>
            {

               data.message.channel.send(`No Responce Provided - Command Timed out - Review Embed
                  ${collected}`);
               clean(data);

            });

      });

   }

}
function clean (data)
{

   const messageManager = data.channel.messages;
   messageManager.fetch({"limit": 9}).then((messages) =>
   {

      // `messages` is a Collection of Message objects
      messages.forEach((message) =>
      {

         message.delete();

      });

      console.log("9 messages have been deleted!");

   });

}

module.exports = function run (data)
{

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (!auth.devID.includes(data.message.author.id))
   {

      data.text = ":cop:  This Command is for bot developers only.\n";
      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------
   // console.log(`DEBUG: Get Perms`);
   return announcement(data);

};
