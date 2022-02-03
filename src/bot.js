/* eslint-disable sort-keys */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
const time = {
   "long": 60000,
   "mid": 30000,
   "short": 5000
};
const env = `${__dirname.slice(
   0,
   -3
)}.env`;
require("dotenv").config({
   "path": env
});
const discord = require("discord.js");

const client = new discord.Client({
   "restRequestTimeout": time.mid,
   "shards": "auto",
   "messageEditHistoryMaxSize": 0,
   "messageCacheLifetime": 30,
   "messageSweepInterval": 90,
   "messageCacheMaxSize": 0
});
const auth = require("./core/auth");

/*
const {AutoPoster} = require("topgg-autoposter");

// your discord.js or eris client
const topggLogin = auth.topggToken;
if (!topggLogin)
{

   console.log("no top.gg token present");

}
else
{

   // eslint-disable-next-line new-cap
   const poster = AutoPoster(topggLogin, client);
   // optional
   poster.on("posted", (stats) =>
   // ran when succesfully posted
   {

      console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);

   });

}

*/

// ---------------
// Event Listener
// ---------------

const events = require("./events");

events.listen(client);
exports.client = client;
// ---------------
// Initialize Bot
// ---------------

// eslint-disable-next-line func-style
function login (token)
{

   client.login(token).catch((err) =>
   {

      console.log(err);
      console.log(`retrying login...`);
      setTimeout(
         login,
         5000
      );

   });

}

login(auth.token);
