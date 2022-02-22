const config = require("./config.json");
const axios = require("axios");

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

let status;
let playersOnline;
let playersMax;
let serverName;

let i = 1;

function start() {
    axios.get(`https://mcapi.us/server/status?ip=${config.ip}` + (config.port ? `&port=${config.port}` : ``)).then((res) => {
        if (res.status === 200) {
            let data = res.data;
            if (data.online) {
                console.log(res.data.players.now)

                status = data.online;

                serverName = data.server.name;

                playersOnline = data.players.now;
                playersMax = data.players.max;

                changeInfo()
            } else {
                status = data.online;
                changeInfo()
            }
        } else {
            console.log("<!-- Error -->");
            console.log(res.statusText);
        }
    });
}

function changeInfo() {
    if (status) {
        console.log("<!-- INFO -->");
        console.log(`Players: ${playersOnline}/${playersMax}`);
        console.log(`Server name: ${serverName}`);
        console.log(`Update: ${i}`);
        if (playersOnline === 0) {
            client.user.setStatus('idle');
            client.user.setActivity(`На сервере нету игроков.`, {
                type: 'PLAYING'
            });
        } else if (playersOnline <= playersMax - 1) {
            client.user.setStatus('online');
            client.user.setActivity(`${playersOnline}/${playersMax} игроков.`, {
                type: 'PLAYING'
            });
        } else if (playersOnline === playersMax) {
            client.user.setActivity(`Сервер полон.`, {
                type: 'PLAYING'
            });
            client.user.setStatus('dnd');
        }

        i++;
    } else {
        console.log("[SERVER] Выключен.")
        client.user.setStatus('dnd');
        client.user.setActivity(`Сервер выключен.`, {
            type: 'PLAYING'
        });
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    start();
    setInterval(start, config.time * 1000 * 60);
});

client.login(config.token);