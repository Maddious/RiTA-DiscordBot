const botSend = require("../core/send");
var embedvar = true;
var b2bvar = true;
//const cmd = config.translateCmdShort;

// =============
// Command Test 1
// =============

exports.embed = function(data)
{
   var output =
   "**```Embeded Message Command Here```**\n" +
   `Embeded Messages Activate : ${embedvar}`;
   
   data.color = "info";
   data.text = output;
   return botSend(data);
};

exports.b2b = function(data)
{
   var output = "**```Bot 2 Bot Command Here```**\n";

   data.color = "info";
   data.text = output;
   return botSend(data);
};
