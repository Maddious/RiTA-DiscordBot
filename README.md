## RITA (beta)
Translation bot built using `discord.js` and `Google Translate API`.

![GitHub package.json version](https://img.shields.io/github/package-json/v/ZyC0R3/Rita?label=Stable%20Version)
[![codebeat badge](https://codebeat.co/badges/a26b41c5-771e-4452-8a60-1947b0ed302c)](https://codebeat.co/projects/github-com-zyc0r3-rita-1-1-6)
[![Build Status](https://travis-ci.com/ZyC0R3/Rita.svg?branch=1.1.7)](https://travis-ci.com/ZyC0R3/Rita)
[![CircleCI](https://circleci.com/gh/ZyC0R3/Rita/tree/1.1.7.svg?style=svg)](https://circleci.com/gh/ZyC0R3/Rita/tree/1.1.7)
![GitHub last commit](https://img.shields.io/github/last-commit/ZyC0R3/Rita.svg)
![GitHub](https://img.shields.io/github/license/ZyC0R3/Rita.svg)
![GitHub issues](https://img.shields.io/github/issues-raw/ZyC0R3/Rita.svg)
[![invite](https://img.shields.io/badge/Discord_Support-JOIN-7289DA.svg?)](https://discordapp.com/invite/mgNR64R)


#### Current Test Branch
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/ZyC0R3/Rita/test-branch?label=Test%20Version)
[![Build Status](https://travis-ci.com/ZyC0R3/Rita.svg?branch=test-branch)](https://travis-ci.com/ZyC0R3/Rita)
[![CircleCI](https://circleci.com/gh/ZyC0R3/Rita/tree/test-branch.svg?style=svg)](https://circleci.com/gh/ZyC0R3/Rita/tree/test-branch)

## Coming Soon!

01. Error Message Support Section.
02. Auto Reverse translation for the auto function.
03. `!t tasks #TargetChannel` Implementation. 
04. Introduction of a Streamlined Command Handler. (This will be done as a New Project)

## New in 1.1.7
* Setup on a Raspberry Pi Section.
* gulp-watch updated dependancies. (*Moved to Local Repo as it was out-of-date and full of Security Issues.*)
* Patch for Chinese language support.
* Various Security vulnerabilites fixed.
* Various commands re-activated.

## New in 1.1.6
* Updated ReadMe with Local Installation Support Section.
* Images can now be sent in chat without the need for accompanying text.
* All Heroku Build Warnings have been fixed.
* the bot now responds when you change the server language.
* Translation to user Via DM is now working again.
* Stop command no longer crashes the bot.

## Table of Contents

01. [Features](#features)
02. [Usage](#usage)
03. [Setting up a New Bot (RECOMMENDED)](#new-bot)
04. [How to Update](#update)
05. [C-3PO to RITA Bot Migration (EXPERIMENTAL)](#migration)
06. [Heroku Database Support](#database)
07. [Local Installation Support](#local)
08. [Setup on a Raspberry Pi](#pi)
09. [Troubleshooting](#troubleshooting)
10. [Error Messages](#errors)
11. [Commands](#commands)
12. [Credits & License](#credits-&-license)
13. [Design Team](#design-team)

## <a name="features"></a>Features
* Translate custom messages
* Translate messages by reacting with flag emoji
* Translate last message(s) in channel
* Translate to multiple languages at once
* Automatic translation of channels with option to forward translations to users or seperate channels.
* Supports 100+ languages

## <a name=""></a>Usage
* Cerate your own with the instructions below.
* Write `!translate help` or `!t help` for a list of commands.


**If you are looking to set up a New Bot then follow the instruction below, If you already have a Heroku Bot Using C-3P0 then Scroll down for instruction on how to migrate your translation settings.**


## <a name="new-bot"></a>Setting up a New Bot (RECOMMENDED)

**To deploy a free translation bot that you can add to your discord server, follow these easy steps.**


#### 1. Fork this repo.
* If you don't yet have a github account, [create one](https://github.com/join)! It's free and easy.
* Use the button in the upper righthand side of this page to fork the repo so that it will be associated with your github account.

#### 2. Create a new [Discord App](https://discordapp.com/developers/applications/me/create)
* Give app a friendly name and click the **Create App** button
  * I like the name **C-3PO**, but feel free to pick something different if you fear George Lucas's wrath. Maybe **C-4PO**
* Take note of the app **CLIENT ID**, you will need it later
* Scroll down to the **Bot** section
* Click the **Create a Bot User** button
* Click the **Yes, do it!** button
* Copy the bot's **TOKEN**, you will need it later

#### 3. Create a [Heroku account](https://id.heroku.com/signup/login) (It's free!)
* Create a new app. It's name must be unique and composed of all lowercase letters and dashes. Something like `yourname-discordbot` is fine
* Under **Deployment Method** select Github. Connect to your Github account and search for this repo by name.
* Scroll down to the manual deploy section, and select the **Master** branch. Click deploy branch, and wait for the successfully deployed message.
* Go to the **Resources** tab and look for the addons section. Search 'Postgres', and add a 'Hobby Dev - Free' version of Heroku Postgres. This will be automatically attached as your bot's database.
* Go to the **Settings** tab. Click to reveal Config Variables, then add a new one. The key will be **DISCORD_TOKEN**, and the value will be your discord bot's token that you copied earlier.
* Go to the **Overview** tab and click configure dynos. Turn off the default `web npm start` dyno and turn on the `worker node src/bot.js` dyno. Your bot will now be up and running!

#### 4. Invite your bot to your server and configure it!
* Replace the CLIENTID string in the following url with your own apps client id: https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8
* Visit the resulting url and add your bot to any server where you have admin privileges.
* Once added, your bot should show up more or less instantaneously. Type `!t help` within the discord chat for more details on how to use it. Happy translating!


## <a name="update"></a>How to Update to 1.1.7
#### 1. Checklist
* You must have a bot already running on your server, if not then refer to [Setting up a New Bot](#new-bot)

#### 2. Fork this Repo 
* Complete a Pull Request from the master Branch of ZyC0R3/Rita to your master branch.
* Detailed instructions with example can be found here: https://www.sitepoint.com/quick-tip-sync-your-fork-with-the-original-without-the-cli/

#### 3. Deploy Update in Heroku
* Log in to your Heroku account.
* Select the bot you made in step 3 of [Setting up a New Bot](#new-bot)
* Under **Deployment Method** Scroll down to the manual deploy section, and select the **Master** branch. Click deploy branch, and wait for the successfully deployed message.


## <a name="migration"></a>C-3PO to RITA Bot Migration (EXPERIMENTAL)
**If you already have a Heroku Bot Using C-3P0**

#### 1. Checklist
* Make sure you have completed the following steps before attempting to migrate translation settings.
1. You have an already up and running C-3P0 Bot.
2. You are using Heroku to run the old version.
3. Make sure you do not disable, reset or delete your database (preferably Postgres from Heroku)

#### 2. Migrate
* Go to Heroku and click your app of C-3PO, once you have direct yourself to the deploy section. Once at the deploy section fork this project ( https://github.com/ZyC0R3/Rita ) and name it whatever you like.  
* Go back to the deploy section in Heroku and scroll down until you see the current fork your C-3PO bot is running off of, next to it there should be a button saying "Disconnect" click that and then click search on repositories.
* Click your fork of this project and wait for it to load. Once that is completed you need to deploy the 'Master' version of the bot.
* Wait for it to finish deploying and you should be good to go. Turn on your worker dyno (if it was not already) and make sure your DISCORD_TOKEN is connected in the variables section in Settings. All data from your previous C-3PO bot should be saved in the database of Postgres as long as you do not delete it and will connect to all the previous channel translation connections. Happy Translating!


## <a name="database"></a>Heroku Database Support
Sometimes you need to edit the Database manually, This is not something you should be playing around with unless you really know what you are doing.

#### 1. Checklist
1. Know that you are doing, if you don't then **don't** touch the DB. Simple.
2. Download and Install [Postgres Admin 4](https://www.postgresql.org/ftp/pgadmin/pgadmin4/v4.10/), This guide will be for Windows, but it shouldn't be much different for any other OS.
3. Locate your credentials for you Heroku Database, Log in to **Heroku** > Select your **App** > Click **Resources** > Click **Heroku Postgres** > Click **Settings** > Click **View Credentials** (*Note: Heroku rotates credentials periodically and updates applications where this database is attached.*)

#### 2. Connect
For a fresh install of pgAdmin, the dashboard likely contains only one server. This is your local server, Ignore this.
1. Right click server(s) > create > server …
2. Fill out the following:
  * **Name:** This is solely for you. Name it whatever you want, I chose ‘Heroku-Run — On’

*Under the connection tab:*
  * **Hostname/Address:** This is the host credential you located in Step 3. It should look like \*\*-\*\*-\*\*...amazonaws.com
  * **Port:** Keep the port at 5432, unless your credentials list otherwise
  * **Maintenance databaseL** This is the database field located in Step 3.
  * **Username:**  This is the user field in the credentials
  * **Password:** The password field located in Step 3. I highly advise checking save password so that you don’t have to copypasta this every time you want to connect.
  * In the **SSL Tab**, mark SSL mode as require

At this point, if we were to hit ‘save’ (please don’t), something very strange would happen. You’d see hundreds if not thousands of databases appear in pgAdmin. This has to do with how Heroku configures their servers. You’ll still only have access to your specific database, not those of others. In order to avoid parsing so many databases, we have to white list only those databases we care about.

3. Go to the **Advanced** tab and under db restriction copy the database name (it’s the same value as the **Maintenance Database** field filled earlier).
4. Click Save/Connect and you are done. Edit away.

## <a name="local"></a>Local Installation Support
The bot can also be run locally without Heroku. The local setup requires more steps since the database needs to be setup and the development tools need be installed. Start with the steps 1 and 2 in [Setting up a New Bot](#new-bot) and the continue as follows:

#### 1. Create a local database
Any Database that runs with SQL Sequelize ('https://sequelize.org/master/') can be used. My recommendation is to use the [SQL Lite](https://www.sqlite.org/index.html) database since the setup is fast and access is easy. Copy the connection details to the database for the next step. Example: The connection to a sqlite database with the name *database.db* stored at the same level of this README file would be *./database.db*.

#### 2. Create a new .env File
Copy the existing **.env.example** file and name it **.env**. Edit the Values of **DISCORD_TOKEN**, **DISCORD_BOT_OWNER_ID** and the **DATABASE_URL** according to the values that you copied earlier.

#### 3. Install nodejs
Install nodejs ('https://nodejs.org/en/').  

#### 4. Run and start the bot
Run `npm install -g gulp` in your console to install gulp. Build the bot code using `npm build` and run the bot with `npm start`. 

#### 5. Invite your bot to your server and configure it!
Return to step 4 in [Setting up a New Bot](#new-bot).

## <a name="pi"></a>Setup on a Raspberry Pi
We recommend to initially run your bot in a local environment on your laptop before you run the translator on a Raspberry Pi. The local setup allows you to get familiar with the setup and the settings.

The following description allows a headless configuration. Only a network connection is required. This description is explicitely for running the bot on a Raspberry Pi 4, but the setup should be similar for earlier version.

Recommendation: run it locally first before putting the code on pi. Easier to ensure that .env variabels are setup correctly.

#### 1. Write Raspbian on your SD card 
Download the minimal image of Raspbian (https://www.raspberrypi.org/downloads/raspbian/). This setup is based on Raspbian Buster Lite, July 2019. 

Use balenaEtcher(https://www.balena.io/etcher/) to write the image on your SD card.

For more Information: See https://www.raspberrypi.org/documentation/installation/installing-images/README.md

#### 2. Enable SSH 
Enable SSH by placing a file named “ssh” (without any extension) onto the boot partition of the SD card.

#### 3. Start and Login
* Pop your prepared SD card, power and a network cable into the Pi.
* Find your Pi's IP Adrdress. Check your Router's DHCP allocation table or use a mobile app like Fing (https://play.google.com/store/apps/details?id=com.overlook.android.fing) to find the IP of Pi.
* Install WinSCP and Putty on your Laptop. 
* Start Putty and login into your Pi. Username: pi, PW: raspberry. Change your password with 'passwd'.

#### 4. Initial Setup
* Type `raspi-config` and change your locales
* Update the package lists from repositories: `sudo apt-get update`
* Update your repositories: `sudo apt-get dist-upgrade`

#### 5. Install node and npm
The fastes way to install the current node and npm versions (https://nodejs.org/en/download/) was to follow the description from nodesource (https://github.com/nodesource/distributions/blob/master/README.md): 
* Get the source: `curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`
* Install: `sudo apt-get install -y nodejs`
* Check version: `node -v` and `npm -v`

#### 6. Get the code
It is recommend to install git and pull from your fork or main:
* Install git: `sudo apt-get install git`
* Create the folder for the source: `mkdir Rita`
* Clone the repository: `git clone https://github.com/ZyC0R3/Rita.git`
* Checkout the branch you need: `git checkout --track origin/1.1.7`

Alternative: move the source code with WinSCP from your local environment to the Pi.

#### 7. Install the database
Install sqlite3 with `sudo apt-get install sqlite3`. 

Create an empty database file (`sqlite3 database.db`)and call `.tables`)

#### 8. Copy your .env
Use WinSCP to copy your .env file from your local environment to the Pi.

#### 9. Run the code
* Install gulp is installed: `sudo npm install -g gulp` (not sure if still necessary)
* Make sure you are in the Rita folder
* Get and install all packages of RITA: `npm install`
* Build the code: `npm run-script build`
* Start the bot: `npm run-script start`

#### 10. Autostart
There are different ways to make the bot initialize at startup. The following description is based on `init.d` and `update-rc.d`:
* Create a `init.d` script: Edit the script template in `.pi/translate_bot` if necessary and copy it to the folder `/etc/init.d/` with `sudo mv .pi/translate_bot /etc/init.d/.`
* Make the file executable: `sudo chmod +x /etc/init.d/translate_bot`
* Update the system script links: `sudo update-rc.d translate_bot defaults`
* Now, you can interact with the bot service with commands `sudo service translate_bot start`,  `sudo service translate_bot status` and `sudo service translate_bot stop`
* The logging will be in `/var/log/translate_bot.err` and `/var/log/translate_bot.log` 
* Reboot and hope everything is running smooth: `sudo reboot`
* Enjoy (or return to step 4 in [Setting up a New Bot](#new-bot) if you haven't done yet)

## <a name="troubleshooting"></a>Troubleshooting
* You can set up debugging Webhooks using the following steps
    1. Create a new channel on your server to receive the Webhooks, let's say `#Webhooks`.
    2. Go to Server Settings -> Webhooks -> Create Webhook. Select the `#Webhooks` channel, then copy the Webhook's URL. It will look something like `https://discordapp.com/api/webhooks/012345678901234567/VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL`
    3. In the **Settings** tab of your Heroku app add the following Config Variables (values extracted from your URL):
        * **DISCORD_DEBUG_WEBHOOK_ID** : 012345678901234567
        * **DISCORD_DEBUG_WEBHOOK_TOKEN** : VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL
    4. Restart your app's `worker node src/bot.js` dyno, and you will begin to receive debugging messages in your `#Webhooks` channel.
* If your bot in unresponsive, the first thing to check is Heroku. Log in and manually restart the `worker node src/bot.js` dyno.
* For further troubleshooting, it's helpful to install the Heroku command line interface. Once installed you can login from a terminal with `heroku login` and check your apps logs with `heroku logs --tail -a <your-app-name>`
* If you are unable to solve a problem yourself, report it with as much detail as possible in this repo's issue tracker.

## <a name="errors"></a>Error Messages
This section/feature is being Created, Check back soon or join the support discord.


## <a name="commands"></a>Commands
* [Translate Custom Text](https://github.com/ZyC0R3/Rita/wiki/Translate-Custom-Message)
* [Translate by Reaction](https://github.com/ZyC0R3/Rita/wiki/Translate-by-Reacting)
* [Translate Last Message](https://github.com/ZyC0R3/Rita/wiki/Translate-Last-Message)
* [Translate Channel](https://github.com/ZyC0R3/Rita/wiki/Translate-Channel-Automatic)
* [Settings](https://github.com/ZyC0R3/Rita/wiki/Settings)
* [Misc. Commands](https://github.com/ZyC0R3/Rita/wiki/Misc.-Commands)

## <a name="credits-&-license"></a>Credits & License

This project was originally released by Aziz under the MIT license. He chose to take the project private/commercial at version 0.4.2 Beta. Bobby Johnson forked the project and renamed it Louie after his dog. AlooAkbar forked Louie and added the necessary modifications for simple and free deployment of the bot using Heroku. ZyC0R3 Picked up the fork and as part of a team fixed over 200 errors and brought it in to the modern age, All would like to thank Aziz for his hard work and making these early versions OSS so that others may learn and build on his hard work to share with the community.

## <a name="design-team"></a>Design Team
* Zycore / [ZyC0R3](https://github.com/ZyC0R3)
* Artanis / [ArtanisTheOne](https://github.com/ArtanisTheOne)
* Balthazar / [Jshep89](https://github.com/JShep89)
* Z3US / [cyberlooper](https://github.com/cyberlooper)
* Maddious / [MadIndex](https://github.com/MadIndex)
* defqon.1 / [wdaniel1985](https://github.com/wdaniel1985)

Released under MIT license.
