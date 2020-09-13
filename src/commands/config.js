const botSend = require("../core/send");

// =============
// Command Test 1
// =============

exports.embed = function(data)
{
   var output = "**```Embeded Messages```**\n";
   data.color = "info";
   data.text = output;
   return botSend(data);
};
