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
            "status": "dnd"
         });

      },

      "free" ()
      {

         bot.setPresence({
            "status": "online"
         });

      },

      "online" ()
      {

         // Run this on stratup
         bot.setPresence({
            "game": {
               "name": activevar[0]
            },
            "status": "online"

         });
         setInterval(
            // Every 20 seconds generate a random number and update status to that
            function res ()
            {

               const actID = Math.floor(Math.random() * 6);
               bot.setPresence({

                  "game": {
                     "name": activevar[actID],
                     "type": statusvar[actID]
                  },
                  "status": "online"
               });

            },
            20000
         );

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
