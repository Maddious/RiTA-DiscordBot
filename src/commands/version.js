const langCheck = require("../core/lang.check");
const botSend = require("../core/send");
const db = require("../core/db");
const auth = require("../core/auth");
const logger = require("../core/logger");
const settings = require("./settings");

module.exports = function(data)
{
   var version = `**\`${data.config.version}\`**`;

   if (auth.changelog)
   {
      version += ` ([changelog](${auth.changelog}))`;
   }

   data.color = "info";
   data.text = `:robot:  Current bot version is ${version}`;
   return botSend(data);
};