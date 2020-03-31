const Discord = require('discord.js');
const puppeteer = require('puppeteer');

const bot = new Discord.Client();
const token = "";

const prefix = '??';

bot.on('ready',() => {
    console.log(`Logged in as ${bot.user.tag}!`);
})

bot.on('message', message =>{
    let arg = message.content.substring(prefix.length).split(" ");
    switch(arg[0]){
        case 'hello':
            message.channel.send("Hello !");
            break;
        case 'help':
            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('All Commands')
                .addFields(
                    {name: '??hello', value: 'Hello !'},
                    {name: '??help', value: 'this menu !'},
                    {name: '??ava', value: 'shows your avatar'},
                    {name: '??boat', value: 'shows an image'},
                );
            message.channel.send(embed);
            break;
        case 'ava':
            message.reply(message.author.displayAvatarURL());
            break;
        case 'anime':
            const attachment = new Discord.MessageAttachment('images/anime-girl.jpg');
            message.channel.send(attachment);
            break;
        case 'boat':
            (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto('http://www.battledawn.com/?p=high_score');
                await page.screenshot({path: 'images/recieve.png'});
                await browser.close();
              })();
            const recimg = new Discord.MessageAttachment('images/recieve.png');  
            message.channel.send(recimg);
            break;

    }
        
})

bot.login(token);