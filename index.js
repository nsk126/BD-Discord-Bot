const Discord = require('discord.js');
const puppeteer = require('puppeteer');

const bot = new Discord.Client();
const token = process.env.token;

const path = 'images/recieve.png';
const prefix = '?';

bot.on('ready',() => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user.setPresence({
            activity: { 
                name: 'CE-3! type ?help ?BD',
                type: 'PLAYING'
            }, status: 'online' 
        })
})

bot.on('message', message =>{
    if (!message.guild) return;
    if(message.content[0] == prefix){
        let arg = message.content.substring(prefix.length).split(" ");
        switch(arg[0].toLowerCase()){
            case 'hi':
                message.channel.send("Hello !");
                break;
            case 'about':
                var aboutxt = "```css\n";
                aboutxt += "[About]\n";
                aboutxt += "This bot is still under development.\n";
                aboutxt += "The results this bot produces may not be 100% accurate,\n";
                aboutxt += "Hence i suggest you do not completely depend on it.\n";
                aboutxt += "Incase the bot is offline when required or is not functioning as it is supposed to, do message my discord Ruthless#8524";
                aboutxt += "```";
                message.channel.send(aboutxt);
                break;
            case 'help':
                var helptxt = "```css\n";
                helptxt += "[Banshee - BD commands - Help]\n";
                helptxt += "\n";
                helptxt += "?hi : Hello !\n";
                helptxt += "?help : Shows this menu.\n";
                helptxt += "?BD : Returns a link to BattleDawn Login page.\n";
                helptxt += "?BG : Returns a link to BattleGalaxy Login page.\n";
                helptxt += "?boat : Returns an image of the current Best Of All Time score page.\n";
                helptxt += "?dist : Distance Calculator w/ some added tools\n";
                helptxt += "\t\t-Aruguments ---> Cords1 Cords2 (optinal -radar)(to check if one cordinate is in radar range of the other cordinate.)\n";
                helptxt += "\t\t-Eg: ?dist N:1111 E:22222 N:3333 E:44444\n";
                helptxt += "\t\t-Note: additonal whitespace may result in an error\n";
                helptxt += "\t\t-If Cordinates are not in N:xxxxx E:xxxxx format, this tool may fail.\n";
                helptxt += "?mil : Returns the upper & lower bounds of a military scan report.\n";
                helptxt += "\t\t-If more than 1 scan result is given as an argument, sample mean of the scans is returned.\n";
                helptxt += "?adv : Returns the upper & lower bounds of an advance scan report.\n";
                helptxt += "\t\t-If more than 1 scan result is given as an argument, sample mean of the scans is returned.\n";
                helptxt += "?about : About this Discord Bot.\n";
                helptxt += "?op : Returns cordinates of perfect op cords with a provided ETA and angle\n";
                helptxt += "\t\t-Eg: ?op N:1111 E:22222 2 30 <----- Here the first 2 arguments are reserved for the origin cordinates, the 2nd argument stands for the ETA(friendly) and the 3rd argument stands for the Angle in counterclockwise fashion.\n"
                helptxt += "\n\nTo add this bot to your personal servers,\n"
                helptxt += "<https://discord.com/api/oauth2/authorize?client_id=694073455120744458&permissions=124928&scope=bot>"
                helptxt += "\n\nBanshee's Update logs :  https://pastebin.com/8vQy23Hj";
                
               
                
                helptxt += "```";      
                message.channel.send(helptxt);
                break;
            case 'ava':
                message.reply(message.author.displayAvatarURL());
                break;
            case 'anime':
                const attachment = new Discord.MessageAttachment('images/anime-girl.jpg');
                message.channel.send(attachment);
                break;
            case 'bd':
                const BD_link = 'http://battledawn.com/client/game.php?portal=earthMarsFantasy';
                message.channel.send(BD_link);
                break;
            case 'bg':
                const BG_link = 'http://battlegalaxy.com/battledawn/client/game.php?portal=space';
                message.channel.send(BG_link);
                break;
            case 'dist':
                // N:2697 E:9598 <- example arg
                // N:6940 E:37334 N:5972 E:36621

                //check for proper format                
                for(let i = 0;i<arg.length;i++){
                    if(arg[i] == ""){
                        let err = "";
                        err += "```css";
                        err += "\nError.\nWrong Format."
                        err += "\n```"
                        message.reply(err);
                        return;
                    }                    
                }
                if(arg[1] == null || arg[2] == null || arg[3] == null || arg[4] == null){
                    let err = "";
                    err += "```css";
                    err += "\nError.\nWrong Format."
                    err += "\n```"
                    message.reply(err);
                    return;
                }
                if(arg[1].slice(0,2) != "N:" || arg[2].slice(0,2) != "E:" || arg[3].slice(0,2) != "N:" || arg[4].slice(0,2) != "E:"){
                    let err = "";
                    err += "```css";
                    err += "\nError.\nWrong Format."
                    err += "\n```"
                    message.reply(err);
                    return;
                }

                // Checks done
                
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
                d = Math.ceil(d);
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
                // console.log(hETA);
                hETA = Math.max(hETA,3);
                // console.log(hETA);
                var fETA = Math.ceil(hETA/2);
                fETA = Math.max(fETA,2);
                var nukeETA = Math.max(hETA,6);

                var replydist = "```css";
                if(x == 0 && y == 0){
                    replydist += "\n Same cords !\n Please Try Again !" 
                }else{
                    replydist += "\nDistance(Km) = " + d;
                    replydist += "\nHostile ETA = " + hETA;
                    replydist += "\nFriendly ETA = " + fETA;
                    replydist += "\nNuke ETA = "+ nukeETA;
                }
                
                if(arg[5] == "-radar"){
                    if(d <= 1800){
                        replydist += "\nIn Radar range."
                    }else{
                        replydist += "\nNot in Radar range."
                    }
                }
                replydist += "```";
                message.reply(replydist);
                break;

            case 'mil':
                // console.log(arg.length);
                // Mil scan accuracy +-50% 
                // Wiki says 66% to 200% Standard Deviation

                var scan = [];
                var Lscan = [];
                var Uscan = [];
                var sample_mean = 0;
                for(i = 0;i < arg.length-1; i++){
                    if(isNaN(arg[i+1])){
                        let err = "";
                        err += "```css";
                        err += "\nIncorrect Input."
                        err += "\n```"
                        message.reply(err);
                        return;
                    }
                
                }
                for(i = 0;i < arg.length-1; i++){
                    scan[i] = arg[i+1];
                    sample_mean += parseInt(arg[i+1]);
                    // console.log(sample_mean);
                }
                
                // console.log(scan);
                for(i = 0;i < arg.length-1; i++){
                    Lscan[i] = scan[i] * 0.66;
                    Uscan[i] = scan[i] * 2.00;
                }

                sample_mean = sample_mean / (arg.length-1);
                sample_mean = Math.round(sample_mean);
                // console.log(Lscan);
                // console.log(Uscan);

                var Lbound = Math.max(...Lscan).toFixed(2);;
                var Ubound = Math.min(...Uscan).toFixed(2);;

                Lbound = Math.round(Lbound);
                Ubound = Math.round(Ubound);
                
                
                var milop = "```css";
                milop += "\nMax units = " + Ubound;
                milop += "\nMin units = " + Lbound;
                if(arg.length > 2){
                    milop += "\nSample mean = " + sample_mean;
                }
                milop += "\n```";
                
                message.reply(milop);
                break;

            case 'adv':
                // adv scan accuracy +-25% 
                // Wiki says 80% to 130% Standard Deviation
                var scan = [];
                var Lscan = [];
                var Uscan = [];
                var sample_mean = 0;
                for(i = 0;i < arg.length-1; i++){
                    scan[i] = arg[i+1];
                    sample_mean += parseInt(arg[i+1]);
                }
                // console.log(scan);
                for(i = 0;i < arg.length-1; i++){
                    Lscan[i] = scan[i] * 0.80;
                    Uscan[i] = scan[i] * 1.33;
                }
                sample_mean = sample_mean / (arg.length-1);
                sample_mean = Math.round(sample_mean);
                // console.log(Lscan);
                // console.log(Uscan);
                var Lbound = Math.max(...Lscan).toFixed(2);
                var Ubound = Math.min(...Uscan).toFixed(2);
                
                Lbound = Math.round(Lbound);
                Ubound = Math.round(Ubound);

                var advop = "```css";
                advop += "\nMax units = " + Ubound;
                advop += "\nMin units = " + Lbound; 
                if(arg.length > 2){
                    advop += "\nSample mean = " + sample_mean;
                }
                advop += "\n```"

                message.reply(advop);
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
            case 'op':
                var cord1N = arg[1].substring(2,arg[1].length);
                var cord1E = arg[2].substring(2,arg[2].length);
                cord1N = parseInt(cord1N);
                cord1E = parseInt(cord1E);

                var ETA = parseInt(arg[3]);
                var dist = 400 * ETA;

                var angle = parseInt(arg[4]);
                var deg = angle;

                angle = angle * (Math.PI/180);

                var cord2N = dist * Math.sin(angle);
                var cord2E = dist * Math.cos(angle);
                
                cord2E = Math.floor(cord2E);
                cord2N = Math.floor(cord2N);

                cord2E = cord1E + cord2E;
                cord2N = cord1N - cord2N;
                
                var optxt = "```css";
                optxt += "\nOp cords for ETA "+ ETA;
                optxt += "\nAt an angle of "+deg;
                optxt += "°\nN:"+cord2N+" E:"+cord2E;
                optxt += "```";

                message.reply(optxt);
                break;

            case 'opspot':

                break;
            
            

        }
    }
        
})

bot.login(token);





