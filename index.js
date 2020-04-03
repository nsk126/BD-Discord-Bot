const Discord = require('discord.js');

const bot = new Discord.Client();
const token = process.env.token;

const prefix = '??';

bot.on('ready',() => {
    console.log(`Logged in as ${bot.user.tag}!`);
})

bot.on('message', message =>{
    let arg = message.content.substring(prefix.length).split(" ");
    switch(arg[0]){
        case 'hi':
            message.channel.send("Hello !");
            break;
        case 'help':
            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('All Commands')
                .addFields(
                    {name: '??hi', value: 'Hello !'},
                    {name: '??help', value: 'this menu !'},
                    {name: '??ava', value: 'shows your avatar'},
                    {name: '??BD', value: 'Battle-Dawn'},
                    {name: '??dist', value: '??dist Cord1 Cord2'},
                    {name: '??mil', value: 'Military scan results: N number of scans '},
                    {name: '??adv', value: 'Advance scan results: N number of scans '},
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
        case 'BD':
            const BD_link = 'http://battledawn.com/client/game.php?portal=earthMarsFantasy';
            message.channel.send(BD_link);
            break;
        case 'dist':
            // N:2697 E:9598 <- example arg
            // N:6940 E:37334 N:5972 E:36621

            var cord1N = arg[1].substring(2,arg[1].length);
            var cord1E = arg[2].substring(2,arg[2].length);
            var cord2N = arg[3].substring(2,arg[3].length);
            var cord2E = arg[4].substring(2,arg[4].length);
            
            cord1N = parseInt(cord1N);
            cord1E = parseInt(cord1E);
            cord2N = parseInt(cord2N);
            cord2E = parseInt(cord2E);
            
            var x = cord1N - cord2N;
            var y = cord1E - cord2E;
            var d = x**2 + y**2;
            d = Math.sqrt(d);
            d = Math.round(d);
            /*
            Distance Log
                Hostile ETA
                400KM - 2 , not applied
                600KM - 3
                800KM - 4
                1000KM - 5
                1200KM - 6 ... so on
            */

            var hETA = Math.ceil(d/200);
            console.log(hETA);
            hETA = Math.max(hETA,3);
            console.log(hETA);
            var fETA = Math.ceil(hETA/2);
            fETA = Math.max(fETA,2);

            message.reply("\nDistance(Km) = " + d + "\n" +"Hostile ETA = " + hETA + "\nFriendly ETA = " + fETA);
            break;

        case 'mil':
            // console.log(arg.length);
            // Mil scan accuracy +-50% 
            // Wiki says 66% to 200% Standard Deviation
            var scan = [];
            var Lscan = [];
            var Uscan = [];
            for(i = 0;i < arg.length-1; i++){
                scan[i] = arg[i+1];
            }
            // console.log(scan);
            for(i = 0;i < arg.length-1; i++){
                Lscan[i] = scan[i] * 0.66;
                Uscan[i] = scan[i] * 2.00;
            }
            // console.log(Lscan);
            // console.log(Uscan);
            var Lbound = Math.max(...Lscan).toFixed(2);;
            var Ubound = Math.min(...Uscan).toFixed(2);;
            message.reply("\nMax units = " + Ubound + "\nMin units = " + Lbound);
            break;
        case 'adv':
            // adv scan accuracy +-25% 
            // Wiki says 80% to 130% Standard Deviation
            var scan = [];
            var Lscan = [];
            var Uscan = [];
            for(i = 0;i < arg.length-1; i++){
                scan[i] = arg[i+1];
            }
            // console.log(scan);
            for(i = 0;i < arg.length-1; i++){
                Lscan[i] = scan[i] * 0.80;
                Uscan[i] = scan[i] * 1.33;
            }
            // console.log(Lscan);
            // console.log(Uscan);
            var Lbound = Math.max(...Lscan).toFixed(2);
            var Ubound = Math.min(...Uscan).toFixed(2);
            message.reply("\nMax units = " + Ubound + "\nMin units = " + Lbound);
            break;

    }
        
})

bot.login(token);





