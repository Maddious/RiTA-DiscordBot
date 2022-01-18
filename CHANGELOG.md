## TEMP
* `!tr updatelink` has been added
* Local hosted users persist and react command fixed
* CS same language now works
* Fixed invalid channel message
* `!tr reactpersist` has been added. - Reaction will auto delete after 60 seconds
* `!tr flagpersist` has been added. - Flag emoji will be removed after 15 seconds
* Help menu updated.
* Owner variable is now more reliable on messages
* `checkperms` has ben replaced with `check`
* Various Permission Errors
* Join and leave logs can now be seperated from error logs with env variables `DISCORD_ACTIVITY_WEBHOOK_ID` & `DISCORD_ACTIVITY_WEBHOOK_TOKEN`
* Task ID added to tasks Printout
* Remove by ID is now possiable `!tr stop task [id]` Added
* Error messages show Task ID
* Ignore same chan translation of GIF and images
* `Admin`, `Owner`, `Dev` and `Channel Manager` variables are now stored in message object
* Fixed translate for `me` command
* servertags and langdetect status added to the settings and check commands
* `!tr settings tags [all/everyone/none]` has been added, this falls in line with discord.js (This setting only applies to `embed off` mode)
  > - `none` - No tags are disabled, meaning `@user`, `@everyone` and `@here` will work
  > - `everyone` - Attention tags are, meaning only `@user` will work
  > - `all` - All tags are disabled, meaning `@user`, `@everyone` and `@here` will NOT work
* data.message.server[0] is built on every message event, Reducing the calls needed in send.js to db
* db changes, the following columns have been added
  > - `reactpersist` - manages the react persist variable
  > - `flagpersist` - manages the flag persist variable
  > - `servername` - stores a local copy of the server name
  > - `servertags` - manages the server tags variable
  > - `menupersist` - manages the menu persist variable
  > - `whitelisted` - NOT IN USE, Yet!
* Shard command has been updated to show each shard and its stats
* Language marker has been added to embed off and and on messages, this is controlled with `!tr settings langdetect [on/off]`
* Task command updated, `!tr tasks [#chan/me]` 
  > - `me` will show any tasks for the user in any channel
  > - `#chan` will target a single channel
* Blacklist command fixed


## 1.2.6 Change Log
* RITA is now at 6400 servers, This is just Amazing.

### 1.2.6 Major Changes
* Sharding is now automatic, this should auto scale to the needed amount. 
* A Major memory leak causing rita to restart every few hours has now been fixed.

### 1.2.6 Bug Fixes
* `!tr announce on/off` has been fixed.
* `!tr settings` has been unrestricted.
* `!tr blacklist {ServerID}` has been fixed.
* `!tr channel from {lang} to {lang}` no longer defaults to a DM task.

### 1.2.6 Command Changes
* `!tr react on/off` now turns on and off flag reactions.

### 1.2.6 Database Changes
* Added in 3 new columns ready for auto-warn and eject management 
  > Servers will be allowed 10 Permission Errors Before a Warning

  > Server will be given a Maximum of 3 Warning before they are Ejected

  > If your server should be Ejected a second time it will be blacklisted
 
### 1.2.6 Misc. Changes
* Sooooooo Many spelling mistakes corrected that it would be too many to list here. 
* Help Menu updated with new commands.

## 1.2.5 Change Log
* Since the launch of 1.2.4 Rita has grown by 800 servers, This is Amazing. From all the RITA Dev Team, We cant thank you enough. 

### 1.2.5 Major Changes
* db.js has had a overhaul
* Database has been migrated to a larger DB, We wont be needing to do that again for a good 5 years. 

### 1.2.5 Bug Fixes
* Color now working in `Embed on` and takes user role color.
* Stop command for @user has now been fixed
 
### 1.2.5 Command Changes
* Welcome message added for all new servers. System Channel is default, if not available it will pick first channel that has Write permissions. 
* Announcement command added, This is Restreicted to DEV ONLY.
* Opt in and out commands added for announcements. 
* `!tr settings persist [on/off]` command has been added, this will prevent bot responses from being deleted.
 
### 1.2.5 Database Changes
* Validation Checks added at startup to avoid Blacklist and Stats SQL Errors
 
### 1.2.5 Misc. Changes
* New Debug Settings for console.
* MESSAGE_DEBUG
  > - 0 - Error's Only
  > - 1 - Console for all Messages
  > - 2 - Console for Translate Messages only
  > - 3 - Content of all Messages
  > - 4 - Content of Translate Messages only
  > - 5 - Commands Only

## 1.2.4 Change Log
* BIG ANNOUNCEMENT - RITA IS NOW VERIFIED

* With the introduction of Version 1.2.4, we have added in a bunch of new commands. 
* We have now been Verified, so you can invite RITA by going to https://ritabot.gg/invite

### 1.2.4 Major Changes
* Dev only Command handler has been added in to enable fast changes to command restrictions. 

### 1.2.4 Bug Fixes
* Lots of little things, nothing of consequence. 
 
### 1.2.4 Command Changes
* `!tr history` shows Development History of the bot.
* `!tr stats server [ServerID]` shows stats for the targets server.
* `!tr blacklist [ServerID]` Blacklists a server (Developers Only).
* `!tr unblacklist [ServerID]` un-Blacklists a server (Developers Only).
* `!tr warn [ServerID]` Warns a server (Developers Only).
* `!tr unwarn [ServerID]` un-Warns a server (Developers Only).
* `!tr eject [ServerID]` Removes RITA from the target server (Developers Only).
* `!tr check [ServerID]` Checks Warn & Blacklist status of the given server.
* `!tr checkperms [bot/user]` checks permissions of the bot and the user for RITA compatibility.
 
### 1.2.4 Database Changes
* A new column has been added to manage blacklisting and Warning, backwards compatible to all previous versions.
 
### 1.2.4 Misc. Changes
* Once again Zycore broke something (a lot of times) Zycore fixed it again.
* Help muenus update with new commands.
* Help menus has been reworked, Still a work in progress but they look much better now. 

## 1.2.3 Change Log
* With the introduction of Version 1.2.3, we have updated the translate API. This is still the same as before but its now providing a much better accuracy rate than before.
* We are still waiting for Discord to Verify RITA, so for now we are limited to 100 servers, We are at that limit at the moment so keep and eye out for the little blue tick, Once you see it you can invite RITA to your server. Please join our discord for more info. https://discord.gg/AtJcjvnkg6

### 1.2.3 Major Changes
* Environment changes - `MESSAGE_DEBUG` - For servers that want to show debug message content to find out what pesky message is causing that error, set this to 1. By Default it is 0. Rita global bot is also 0 and will remain that way.

### 1.2.3 Bug Fixes
* With the changes to the `google-translate-api` it dug up a load of new bugs, Lazarus & EDW have been hard at work fixing them, (DM Lazarus to say thank you, he will love it.)
* @everyone & @here will now also be conveyed across channels correctly.
* Emojis, roles and user pings will now function as intended. With a new system used to manage and correct them
 
### 1.2.3 Command Changes 
* `!tr stats global` / `!tr stats server` now show message based stats, take a look. 
 
### 1.2.3 Database Changes
* It working so were not going to touch it. (Well Zycore wont)
 
### 1.2.3 Misc Changes
* Zycore broke something (alot of times) Zycore fixed it again. 
* All debug messages have been commented out in all files, This make the console log look so much cleaner. 

## 1.2.2 Change Log
* With the introduction of Version 1.2.2, we are proud to introduce the Centralized Version of Rita with a One-Click Invite. This means you can still create your own personal RITA bot. Though now you have the option to forgo that personal setup and can instead use the Centralized version of RITA. Which has the added benefit of not requiring any of the setup steps required that you would have to do for your own personal RITA bot. Just invite the bot to your server and setup the bot to your liking.  
* One-Click Invite Trial, We have decided to set up an extended trial of the Centralized Version of Rita. If you would like to take part and have access to the Centralized Version of RITA. Please join our discord for more info. https://discord.gg/AtJcjvnkg6

### 1.2.2 Major Changes
* Rita now uses Discord.js V12.

### 1.2.2 Bug Fixes
* Same channel translation is now working. You no longer need to have multiple channels set up, you can do it all in one channel.
    * Example `!tr channel from english to spanish for #SameChannelMention` Will translate any English messages to Spanish in your current channel
* AUTO Translate is now working, you can define the "from" language as "AUTO" and it will detect the language for you.
    * Example `!tr auto to lang for #channel` So running `!tr auto to en for #channel` will auto translate anything not in English to English for that channel. 
* DM Translations have been fixed and enabled, thanks to Artanis and Brozer.
    * You can enable this by running the following command `!tr channel to de from en for @user` That will translate English messages to German for the user. Which they will receive in a DM. 
* Duplicate language translation bug is now fixed, meaning you can not translate English to English or French to French etc.
* Various fixes to Nickname Bugs, this should now be working. 
* Desktop Client Gif keyboard caused error due to exclusive embed style.
 
* `google-translate-api` has been changed to RCP to reduce and mitigate the load limiter.
* We have found a way to speed up the translation process, so it should be a little snappier in future. 
 
### 1.2.2 Command Changes 
* New commands added (`debug`, `donate`, `prefix`, `help commands`, `create`)
  > `debug` Is for debug options. Examples below:
    > - `!tr debug on` - turns on debugging, creates debugging channel and webhook
    > - `!tr debug off` - turns off debugging
    > - `!tr stats debug` - prints webhook "ID" and "Token" in channel

  > `donate` - If you would like to donate to RITA you can find the info with this command. Since RITA bot is 100% free donations are greatly appreciated to help with server costs. Examples below:
    > - `!tr donate` - Will return donation options
    > - `!tr donate github` - You can Donate at Github Sponsors
    > - `!tr donate oc` - You can Donate at Open Collective
    
  > `prefix` - You can now change the prefix of your bot, you can make it whatever you want. Examples below:
    > - `!tr prefix` - Will list your current prefix. Default prefix is `!tr`
    > - `!tr prefix $tr` - your prefix would now be `$tr` instead of `!tr`
    > - `!tr prefix reset` - resets your prefix back to `!tr` So if you changed the prefix to `$tr` you would run `$tr prefix reset`
 
  > `help commands` - Shows a list of all available commands. Example below:
    > - `!tr help`

  > `create` - Allows you to use RITA to create a new channel. Example below:
    > - `!tr create bob` - will create a new channel named bob
* Command Changed (`stats global`, `stats server`)
  > `stats global` - Stat tracking of messages sent in global servers.
  > `stats server` - Stat tracking of messages sent in local server.
* Command Removed (`settings dbfix`, `cpu`)
  > `settings dbfix` - This is no longer needed as DB is repaired (If needed) on each startup. 
  > `cpu` - It was broken and I have no idea how to fix it.
 
### 1.2.2 Database Changes
* As the new variables above are stored in the DB, we have made a few changes to how these are handled and they are auto-created upon load. Meaning you no longer need to worry about them again. (If you get any error's please let us know) 
 
### 1.2.2 Misc Changes

* Various Security vulnerabilities fixed.
* Fixed various issues.
* Major code changes
* Dev Dependencies core to this bot, the `google-translate-api` & `google-translate-token` & `gulp-watch` have been updated


## 1.2.1 
* New commands added (embed, bot2bot, settings updatedb)
  * embed command allows you to change the type of message that is sent to the translation channel, in embed format or standard text. Standard text shows the users avatar and name instead of the bot.
  * bot2bot allows for messages sent from other bots, in non embedded format to be translated as well. (Due to limitation this has been implimented but is disabled for now)
  * As the new variables above are stored in the DB, they need new Columns to be added, as such updatedb will complete these actions.
* Major code changes, new code implementations will change the DB and produce errors on first build, but this is a safe version to update to. Follow the below instructions.
  * Step 1: Make a pull request and update from **Master** branch. 
    * Once you update the bot and it initializes you WILL get a db error, this is normal. (we are working on suppressing these)
  * Step 2: `!tr settings updatedb`
    * This will throw another error but it will build the missing columns.
    * The default value for embed is on and botbot is off.
    * Running this multiple times will cause error to be posted to webhook chan, this is a "Value exists" error. Preventing you from destroying the DB
  * Step 3: Completed, and now working.
    * Once you have completed Step 2, the bot will have come online, but it wont have fully Initialised. 
    * To prevent a never ending loop of errors, the VERY FIRST message or command sent on the server will Initialise the DB fully. Meaning you will have to send that message again.
      * Please Note Due to [Automatic dyno restarts](https://devcenter.heroku.com/articles/dynos#automatic-dyno-restarts) the first message after each restart will share the same behaviour as above.
* Added in command triggers and command deletion to clean up command channels.
* Custom Emoji's are now supported and will be sent with the translated message correctly, with the exception of a few languages.
* DM Translation have been disabled as it has been identified they never worked as intended. they will be re-introduced in a later update.
* Various Security vulnerabilities fixed.
* Dev Dependencies core to this bot, the `google-transalte-api` & `google-transalte-token` & `gulp-watch`have been updated
* `eslint` has been replaced with `babel-eslint`
* `!tr settings updatebot` Has been **DISABLED** - This is not needed as of yet and with the similarities to the `!tr settings updatedb` command it may cause issues.
* Deploy with Heroku Setup and integration. 
 
## 1.2.0
* No Code changes, just URL updates for New name of Bot
* Published to NPM
* Non code changes will be appended with Version-\*\* from now on.
* Various Spelling mistakes in ReadMe have been corrected.
* Dev Dependencies core to this bot, the `google-transalte-api` & `google-transalte-token` have been updated
* Setup on a Raspberry Pi instruction Section added.
* gulp-watch updated dependencies. (*Moved to Local Repo as it was out-of-date and full of Security Issues.*)
* Patch for Chinese language support.
* Various Security vulnerabilities fixed.
* Various commands re-activated.

## 1.1.8
* Various Security vulnerabilities fixed.
* Various Spelling mistakes in ReadMe have been corrected.
* Dev Dependencies core to this bot, the google-transalte-api & google-transalte-token have been updated

## 1.1.7
* Setup on a Raspberry Pi Section.
* gulp-watch updated dependancies.
* Patch for Chinese language support.
* Various Security vulnerabilites fixed.
* Various commands re-activated.

## 1.1.6
* Dependancy Updates
* Updated ReadMe with Local Installation Support Section.
* Images can now be sent in chat without the need for accompanying text.
* All Heroku Build Warnings have been fixed.
* The bot now responds when you change the server language.
* Translation to user Via DM is now working again.
* Stop command no longer crashes the bot.

## 1.1.5
* Core Changed with minor Gulp Updates
* Changes to the approved length of Server ID's as Discord API has changed.
* Updated Readme for Database Connection Support

## 1.1.4
* Dependancy Updates

## 1.1.3
* Dependancy Updates
  * "gulp-eslint": "^6.0.0" from "^4.0.2"
  * "eslint": "^6.0.1" from "4.19.1"
* Help File Updates

## 1.1.0
* .eslintrc.json Fixes
* Dependancy Updates
  * Changed "google-translate-token" from @vitalets/google-translate-token to "github:ZyC0R3/google-translate-token"

## 1.0.0
* First Build
