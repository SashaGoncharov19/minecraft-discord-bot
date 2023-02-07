# Minecraft Discord Bot 1.7.10 +

This bot will show count of players on your minecraft server. It supports custom messages, other localizations, and works without third-party APIs.

## Introduction
Follow the ways to install the script.
To start the script run the command below:
> npm start

## How to install
1. Rename `.env.example` to `.env`.
2. Open `.env` and change settings to your's.

> - IP - Server IP or domain name.
> - PORT - Server port.
> - SV - Server version.
> - DISCORD_TOKEN - Token of your Discord bot.
> - TIME - Time in minutes which will update Discord status.

3. Open terminal in root folder and run command `npm install`.

## Functionality

Bot has string formatter, to replace online players and max players on string.
For example :

> Playing {op}/{mp}.

Output will be: 

> Playing 1235/2000.

Replacable options:
> - {op} - Online players.
> - {mp} - Max players.

## API

For custom texts options you need to call: <br/>
 ### StringBundler(string, [promise(mc.ping)](https://github.com/PrismarineJS/node-minecraft-protocol/blob/master/docs/API.md#mcpingoptions-callback)) Function
 
 `client.user.setActivity(`**StringBundler('Playing {op}/{mp}.', data)**`)`
