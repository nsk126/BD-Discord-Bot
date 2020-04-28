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
    if(message.content[0] == prefix){
        let arg = message.content.substring(prefix.length).split(" ");
        switch(arg[0]){
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
                helptxt += "?boat : Returns an image of the current Best Of All Time score page.\n";
                helptxt += "?dist : Distance Calculator w/ some added tools\n";
                helptxt += "\t\tAruguments ---> Cords1 Cords2 (optinal -radar)\n";
                helptxt += "\t\tIf Cordinates are not in N:xxxxx E:xxxxx format, this tool may fail.\n";
                helptxt += "?mil : Returns the upper & lower bounds of a military scan report.\n";
                helptxt += "\t\tIf more than 1 scan result is given as an argument, sample mean of the scans is returned.\n";
                helptxt += "?adv : Returns the upper & lower bounds of an advance scan report.\n";
                helptxt += "\t\tIf more than 1 scan result is given as an argument, sample mean of the scans is returned.\n";
                helptxt += "?about : About this Discord Bot.\n";
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
                replydist += "\nDistance(Km) = " + d;
                replydist += "\nHostile ETA = " + hETA;
                replydist += "\nFriendly ETA = " + fETA;
                replydist += "\nNuke ETA = "+ nukeETA;

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

                var Lbound = Math.max(...Lscan).toFixed(2);;
                var Ubound = Math.min(...Uscan).toFixed(2);;
                
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
                // console.log(Lscan);
                // console.log(Uscan);
                var Lbound = Math.max(...Lscan).toFixed(2);
                var Ubound = Math.min(...Uscan).toFixed(2);

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
            
            case 'sim':
                console.log(arg.length);
                console.log(arg);

                var ally = [];
                for(var i = 0; i < 3; i++){
                    ally[i] = [];
                    for(var j = 0; j < 9; j++){
                        ally[i][j] = 0;
                    }
                }
                var enemy = [];
                for(var i = 0; i < 3; i++){
                    enemy[i] = [];
                    for(var j = 0; j < 9; j++){
                        enemy[i][j] = 0;
                    }
                }

                for(var i = 1; i < arg.length; i++){
                    console.log(arg[i]);
                    switch(arg[i].slice(0,4)){
                        //ally
                        case 'aICA':
                            ally[2][0] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aICD':
                            ally[1][0] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aICR':
                            ally[0][0] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aIBA':
                            ally[2][1] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aIBD':
                            ally[1][1] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aIBR':
                            ally[0][1] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aIXA':
                            ally[2][2] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aIXD':
                            ally[1][2] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aIXR':
                            ally[0][2] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVCA':
                            ally[2][3] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVCD':
                            ally[1][3] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVCR':
                            ally[0][3] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVBA':
                            ally[2][4] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVBD':
                            ally[1][4] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVBR':
                            ally[0][4] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVXA':
                            ally[2][5] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVXD':
                            ally[1][5] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aVXR':
                            ally[0][5] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTCA':
                            ally[2][6] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTCD':
                            ally[1][6] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTCR':
                            ally[0][6] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTBA':
                            ally[2][7] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTBD':
                            ally[1][7] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTBR':
                            ally[0][7] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTXA':
                            ally[2][8] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTXD':
                            ally[1][8] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'aTXR':
                            ally[0][8] = parseInt(arg[i].slice(4,arg[i].length));
                            break;

                        //Enemy
                        case 'bICA':
                            enemy[2][0] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bICD':
                            enemy[1][0] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bICR':
                            enemy[0][0] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bIBA':
                            enemy[2][1] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bIBD':
                            enemy[1][1] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bIBR':
                            enemy[0][1] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bIXA':
                            enemy[2][2] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bIXD':
                            enemy[1][2] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bIXR':
                            enemy[0][2] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVCA':
                            enemy[2][3] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVCD':
                            enemy[1][3] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVCR':
                            enemy[0][3] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVBA':
                            enemy[2][4] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVBD':
                            enemy[1][4] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVBR':
                            enemy[0][4] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVXA':
                            enemy[2][5] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVXD':
                            enemy[1][5] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bVXR':
                            enemy[0][5] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTCA':
                            enemy[2][6] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTCD':
                            enemy[1][6] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTCR':
                            enemy[0][6] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTBA':
                            enemy[2][7] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTBD':
                            enemy[1][7] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTBR':
                            enemy[0][7] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTXA':
                            enemy[2][8] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTXD':
                            enemy[1][8] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        case 'bTXR':
                            enemy[0][8] = parseInt(arg[i].slice(4,arg[i].length));
                            break;
                        
                    }
                }

                // console.log(ally);
                // console.log(enemy);
                message.reply(
                    "*Initial Forces*\n" + 
                    "```\n" + 
                    "Ally"+ "\n"+
                    ally[0][0] + "\t" + ally[0][1] + "\t" + ally[0][2] + "\t" + ally[0][3] + "\t" + ally[0][4] + "\t" + ally[0][5] + "\t" + ally[0][6] + "\t" + ally[0][7] + "\t" + ally[0][8] + "\t" + "\n" + 
                    ally[1][0] + "\t" + ally[1][1] + "\t" + ally[1][2] + "\t" + ally[1][3] + "\t" + ally[1][4] + "\t" + ally[1][5] + "\t" + ally[1][6] + "\t" + ally[1][7] + "\t" + ally[1][8] + "\t" + "\n" + 
                    ally[2][0] + "\t" + ally[2][1] + "\t" + ally[2][2] + "\t" + ally[2][3] + "\t" + ally[2][4] + "\t" + ally[2][5] + "\t" + ally[2][6] + "\t" + ally[2][7] + "\t" + ally[2][8] + "\t" + "\n" + 
                    "```" + "\n" + 
                    "```\n" +
                    "Enemy"+"\n" +
                    enemy[0][0] + "\t" + enemy[0][1] + "\t" + enemy[0][2] + "\t" + enemy[0][3] + "\t" + enemy[0][4] + "\t" + enemy[0][5] + "\t" + enemy[0][6] + "\t" + enemy[0][7] + "\t" + enemy[0][8] + "\t" + "\n" + 
                    enemy[1][0] + "\t" + enemy[1][1] + "\t" + enemy[1][2] + "\t" + enemy[1][3] + "\t" + enemy[1][4] + "\t" + enemy[1][5] + "\t" + enemy[1][6] + "\t" + enemy[1][7] + "\t" + enemy[1][8] + "\t" + "\n" + 
                    enemy[2][0] + "\t" + enemy[2][1] + "\t" + enemy[2][2] + "\t" + enemy[2][3] + "\t" + enemy[2][4] + "\t" + enemy[2][5] + "\t" + enemy[2][6] + "\t" + enemy[2][7] + "\t" + enemy[2][8] + "\t" + "\n" + 
                    "```"
                );


                //send initial battle as a message
                break;

        }
    }
        
})

bot.login(token);





