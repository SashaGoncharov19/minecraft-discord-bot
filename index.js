import * as dotenv from 'dotenv';
dotenv.config();
import mp from 'minecraft-protocol';

import { ActivityType, Client, GatewayIntentBits } from 'discord.js';

const { ping } = mp;

const { IP, PORT, DISCORD_TOKEN, SV, TIME } = process.env;
import Localization from './en.json' assert { type: "json" };

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const updateStatus = async () => {
    const data = await pingServer();

    if (data.error) {
        client.user.setStatus('dnd');
        return client.user.setActivity(Localization.ServerDisabled, {
            type: ActivityType.Playing
        });
    }

    const { players } = data;

    if (players.online === 0) {
        client.user.setStatus('idle');
        client.user.setActivity(Localization.ServerIsEmpty, {
            type: ActivityType.Playing
        })
    }

    if (players.online === players.max) {
        client.user.setStatus('dnd');
        client.user.setActivity(Localization.ServerIsFull, {
            type: ActivityType.Playing
        });
    }

    if (players.online <= players.max - 1) {
        client.user.setStatus('online');
        client.user.setActivity(StringBundler(Localization.ServerHasPlayers, data), {
            type: ActivityType.Playing
        });
    }

    console.log(`[BOT] Refresh: ${new Date().toLocaleTimeString()}`)
};

client.on('ready', () => {
    console.log(`[BOT] Logged in as ${client.user.tag}!`);
});

client.login(DISCORD_TOKEN).then(() => {
    console.log(`[BOT] Try to login with credentials...`)

    client.user.setStatus('online');
    client.user.setActivity('Bot starting..');
});

function StringBundler (string, data) {
    const operators = {
        op: data.players.online,
        mp: data.players.max
    };

    const keys = Object.keys(operators);

    keys.map((object, index) => {
        string = string.replace(`{${keys[index]}}`, operators[keys[index]])
    })

    return string;
}

async function pingServer () {
    return await ping({
        host: IP,
        port: PORT,
        version: SV
    }).catch(() => {
        return { error: true };
    })
}

setInterval(async () => {
    await updateStatus()
}, TIME * 60 * 1000);