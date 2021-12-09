// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const sendMessage = require("../../core/command.send");
const auth = require("../../core/auth");
const db = require("../../core/db");
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
   try
   {

      setTimeout(() => data.message.delete(), auth.time.short);

   }
   catch (err)
   {

      console.log(
         "Command Message Deleted Error, announce.js = Line 40",
         err
      );

   }
   if (!data.message.isDev)
   {

      data.text = ":cop:  This Command is for bot developers only.\n";
      return sendMessage(data);

   }
   await data.message.channel.send(`Please enter Anouncment Title.`).then(() =>
   {

      data.message.channel.awaitMessages(filter, {
         "errors": ["time"],
         "max": 1,
         "time": time.long
      }).
         then((message) =>
         {

            data.announcement.title = message.first();
            body(data);

         }).
         catch((collected) =>
         {

            data.message.channel.send(`No Responce Provided Or Error: - Title`);
            clean(data, 1);

         });

   });

   async function body (data)
   {

      clean(data, 2);
      await data.message.channel.send(`Please Enter message you wish to send.`).then(() =>
      {

         data.message.channel.awaitMessages(filter, {
            "errors": ["time"],
            "max": 1,
            "time": time.long
         }).
            then((message) =>
            {

               data.announcement.message = message.first();
               review(data);

            }).
            catch((collected) =>
            {

               data.message.channel.send(`No Responce Provided Or Error: Message`);
               clean(data, 1);

            });

      });

   }


   async function review (data)
   {

      clean(data, 2);
      await data.message.channel.send(`Please Review the message, Do you want to send.? \`YES\` / \`NO\``).then(() =>
      {

         data.message.channel.send({"embed": {
            "color": 9514728,
            "description": `${data.announcement.message}`,
            "footer": {
               "text": `This is a Message from the RITA Dev Team\nRITA is developed by the RITA Bot Project\n\nTo opt out of annoucments please use the command {cmd} announce off`
            },
            "title": `${data.announcement.title}`
         }});

         data.message.channel.awaitMessages(filter, {
            "errors": ["time"],
            "max": 1,
            "time": time.long
         }).then((message) =>
         {

            let responce = null;
            let responceLower = null;
            responce = message.first();
            responceLower = responce.content.toLowerCase();
            if (responceLower === "yes" || responceLower === "y")
            {

               data.message.channel.send(`Announcment has been sent!`).then((msg) =>
               {

                  try
                  {

                     setTimeout(() => msg.delete(), auth.time.short);

                  }
                  catch (err)
                  {

                     console.log(
                        "Command Message Deleted Error, announce.js = Line 152",
                        err
                     );

                  }

               });

               let i = 0;
               const guilds = [];
               for (const guild of data.message.client.guilds.cache)
               {

                  guilds.push(guild);

               }

               const wait = setInterval(function delay ()
               {

                  const guild = guilds.shift();

                  i += 1;
                  if (guild === undefined)
                  {

                     console.log(`Done all servers`);
                     clearInterval(wait);

                  }
                  else if (guild[1].id && guild[1].systemChannel && guild[1].systemChannel.permissionsFor(guild[1].me).has("SEND_MESSAGES"))
                  {

                     const target = guild[1].id;

                     db.getServerInfo(
                        target,
                        function getServerInfo (server)
                        {

                           if (!target)
                           {

                              return;

                           }
                           else if (server[0].announce === true)
                           {

                              console.log(`Message ${i} Sent to guild ${guild[1].id} - ${guild[1].name}`);
                              return guild[1].systemChannel.send({"embed": {
                                 "color": 9514728,
                                 "description": `${data.announcement.message}`,
                                 "footer": {
                                    "text": `
                                    This is a Message from the RITA Dev Team\nRITA is developed by the RITA Bot Project\n\nTo opt out of annoucments please use the command ${server[0].prefix} announce off`
                                 },
                                 "title": `${data.announcement.title}`
                              }});

                           }
                           console.log(`Message ${i} Unable to Sent to guild ${guild[1].id} - ${guild[1].name} as they have opted out of announcement messages.`);

                        }
                     );

                  }

               }, 1000);

               clean(data, 3);

            }

            else if (responceLower === "no" || responceLower === "n")
            {

               data.message.channel.send(`Command Terminated`);
               clean(data, 3);

            }
            else
            {

               data.message.channel.send(`Command Terminated: Invalid Response`);
               clean(data, 3);

            }

         }).
            catch((collected) =>
            {

               console.log(`No Responce Provided Or Error: - Review`);
               clean(data, 1);

            });

      });

   }

}
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

module.exports = function run (data)
{

   // -----------------------------------
   // Error if settings param is missing
   // -----------------------------------

   if (data.message.isAdmin === true)
   {

      if (data.cmd.params && data.cmd.params.toLowerCase().includes("off"))
      {

         db.updateServerTable(data.message.guild.id, "announce", false, function error (err)
         {

            if (err)
            {

               return console.log("error", err, "command", data.message.channel.guild.name);

            }

         });

         data.text = "You have successfully opted out of receiving announcements messages.\n";
         return sendMessage(data);

      }
      else if (data.cmd.params && data.cmd.params.toLowerCase().includes("on"))
      {

         db.updateServerTable(data.message.guild.id, "announce", true, function error (err)
         {

            if (err)
            {

               return console.log("error", err, "command", data.message.channel.guild.name);

            }

         });

         data.text = "You have successfully opted in to receiving announcements messages.\n";
         return sendMessage(data);

      }

   }
   else
   {

      data.text = ":cop:  This command is reserved for server admins and owners only.\n";
      return sendMessage(data);

   }

   // ----------------
   // Execute setting
   // ----------------

   return announcement(data);

};
