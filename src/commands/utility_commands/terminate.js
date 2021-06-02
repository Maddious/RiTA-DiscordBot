// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const sendMessage = require("../../core/command.send");

// ------
// Eject
// ------

module.exports.eject = async function eject (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Ban");


   const serverID = data.cmd.params.split(" ")[0].toLowerCase();

   data.color = "info";
   data.text = `Server has been terminated ${serverID}`;

   console.log(`${serverID}`);
   await data.client.guilds.cache.get(serverID).leave();

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};

// ----------
// Blacklist
// ----------

module.exports.blacklist = function blacklist (data)
{

   // -------------
   // Command Code
   // -------------

   // console.log("DEBUG: Ban");

   data.color = "info";
   data.text = `Server has been Blacklisted`;

   // -------------
   // Send message
   // -------------

   return sendMessage(data);

};
