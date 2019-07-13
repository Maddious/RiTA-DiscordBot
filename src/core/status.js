// ------------------
// Update Bot Status
// ------------------

module.exports = function(bot, status, channel, writable = true)
{
   const statusMap =
   {
      "online": function()
      {
         bot.setPresence({
            status: "online",
            game: {
               name: "Lurling from the shadowns (!t help)"
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

   if (status && statusMap.hasOwnProperty(status) && writable)
   {
      return statusMap[status]();
   }
};
