// ------------------
// Update Bot Status
// ------------------

// eslint-disable-next-line consistent-return
module.exports = function run (bot, status, config, writable = true)
{

   const activevar = [
      `ritabot.gg | !tr help`,
      `for messages to translate | ritabot.gg`,
      "messages to translate | ritabot.gg",
      `!tr help commands | ritabot.gg`,
      "translations | ritabot.gg",
      `v.${config.version} | ritabot.gg`,
      `!tr help modules | ritabot.gg`
   ];
   const statusvar = [
      "PLAYING",
      "WATCHING",
      "LISTENING",
      "WATCHING",
      "WATCHING",
      "PLAYING",
      "WATCHING"
   ];
   const statusMap =
   {
      "busy" ()
      {

         bot.setPresence({
<<<<<<< Updated upstream
            status: "dnd"
         });
=======
            status: "online",
            game: {
               name: activevar[0]
            } //run this on stratup
>>>>>>> Stashed changes

      },

      "free" ()
      {

         bot.setPresence({
<<<<<<< Updated upstream
            status: "online"
=======
            status: "dnd"
>>>>>>> Stashed changes
         });

      },

      "online" ()
      {
<<<<<<< Updated upstream

         // run this on stratup
         bot.setPresence({
            game: {
               name: activevar[0]
            },
            status: "online"

         });
         setInterval(
            // every 20 seconds generate a random number and update status to that
            function res ()
            {

               const actID = Math.floor(Math.random() * 6);
               bot.setPresence({

                  game: {
                     name: activevar[actID],
                     type: statusvar[actID]
                  },
                  status: "online"
               });

            },
            20000
         );

=======
         bot.setPresence({
            status: "online"
         });
>>>>>>> Stashed changes
      }
   };

   if (Object.prototype.hasOwnProperty.call(
      status && statusMap,
      status
   ) && writable)
   {

      return statusMap[status]();

   }

};
