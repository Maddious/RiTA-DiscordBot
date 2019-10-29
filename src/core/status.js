// ------------------
// Update Bot Status
// ------------------

module.exports = function(bot, status, config, channel, writable = true)
{
   const statusMap =
   {
      "online": function()
      {
         bot.setPresence({
            status: "online",
            game: {
<<<<<<< HEAD
               name: "Real-Time Intergalactic Translating"
=======
               name: config.translateCmdShort + " help / " + config.translateCmd +" help - V." + config.version
>>>>>>> upstream/master
            }
         });
      },

      "busy": function()
      {
         bot.setPresence({
            status: "dnd"
         });
      },

      "free": function()
      {
         bot.setPresence({
            status: "online"
         });
      }
   };

   //if (status && statusMap.hasOwnProperty(status) && writable)
   if (Object.prototype.hasOwnProperty.call(status && statusMap,status) && writable)
   {
      return statusMap[status]();
   }
};
