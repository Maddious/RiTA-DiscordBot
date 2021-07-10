/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
// const {ShardingManager} = require("discord.js");
const discord = require("discord.js");
const auth = require("./core/auth");
const env = `${__dirname.slice(
   0,
   -3
)}.env`;
require("dotenv").config({
   "path": env
});

// ------------------------
// Discord Main Bot Script
// ------------------------

const path = require("path");
const bot = path.join(
   __dirname,
   "bot.js"
);

// --------------
// Shard Manager
// --------------

let shards = 2;

if (auth.shards)
{

   shards = auth.shards;

}


const manager = new discord.ShardingManager(bot);

// -------------
// Spawn Shards
// -------------

manager.spawn(shards).catch(console.error);
