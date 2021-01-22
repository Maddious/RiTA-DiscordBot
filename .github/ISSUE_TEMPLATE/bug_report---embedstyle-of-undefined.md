---
name: Bug report - TypeError Cannot read property 'embedstyle' of undefined
about: This bug report is for tracking the TypeError Cannot read property 'embedstyle' of undefined weeoe ONLY, Please do not use it for anything else
title: 'TypeError: Cannot read property 'embedstyle' of undefined'
labels: TypeError, Bug
assignees: 'ZyC0R3'

---

**Please ensure you follow the Below Steps fully.**
1. Make sure you have set up a web hook channel on your server. 
    * You can set up debugging Webhooks using the following steps
        * Create a new channel on your server to receive the Webhooks, let's say #Webhooks.
        * Go to Server Settings -> Webhooks -> Create Webhook. Select the #Webhooks channel, then copy the Webhook's URL. It will look something like https://discordapp.com/api/webhooks/012345678901234567/VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL
        * In the Settings tab of your Heroku app add the following Config Variables (values extracted from your URL):
            DISCORD_DEBUG_WEBHOOK_ID : 012345678901234567
            DISCORD_DEBUG_WEBHOOK_TOKEN : VCj9yOOtJF9VCm-BU2F9xrbnoWD5gBZZ-UU1mZHcxi5VLgr3bPb9NanRJM8YD9cpBisL
1. Restart All Dyno's in Heroku
    *  Go to https://dashboard.heroku.com/apps and select your bot.
    *  In the top right of the page select "More" and then "Restart all dynos"
2. Once this is done, And your bot is back online, run the following commands on your discord server
    * !t settings dbfix
    * !t settings updatedb
Note: They need to be ran in the correct order. 
