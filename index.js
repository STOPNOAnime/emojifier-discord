const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json');
const chars = require('./font.js').chars;

var emojis_available = [];

function getRandomInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function set_config (background) {
    config.background_emoji = background;
    fs.writeFile('./config.json', JSON.stringify(config, null, 4), err => {
        if (err) {
            console.log('Error writing config.', err);
        }
    });
}

function print_letter (a) {
    var x,y,set;
    var string = "";
    var bitmap = chars[a];

    for (y = 0; y < 8; y++) {
        for (x = 7; x >= 0; x--) {
            set = bitmap[y] & 1 << x;
            string = string.concat(set ? emojis_available[getRandomInt(0, emojis_available.length-1)] : config.background_emoji);
        }
        string = string.concat('\n');
    }

    return string;
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(config.prefix_main)){
        const string_to_convert = message.content.slice(config.prefix_main.length).trim();

        var ascii = /^[ -~\t\n\r]+$/;

        if(!ascii.test(string_to_convert) || string_to_convert.length > 10) {
            message.channel.send(`${message.author} Provide a correct string (only basic ASCI and up to 10 characters).`);  
        }
        else{
		emojis_available = client.emojis.cache.map(e=>e.toString());
		var tmp = emojis_available.indexOf(config.background_emoji);
		if(tmp >=0){
			emojis_available.splice(tmp,1);
			for(i=0;i<string_to_convert.length;i++){
		    		message.channel.send(print_letter(string_to_convert.charCodeAt(i)));
			}
		}
		else{
			message.channel.send(`${message.author} Background emoji is not set.`);
			set_config("");
		}
        }
    }
    else if (message.content.startsWith(config.prefix_config)){
        const args = message.content.slice(config.prefix_config.length).trim().split(' ');;
        const command = args.shift().toLowerCase();

        if(command === 'help' && !args.length){
            message.channel.send(`${message.author} Available commands: \n\`!emoji help\` - show this help message.\n\`!emoji set :emoji:\` - set background emoji.\n\`!emojify text\` - convert text to emoji.`);
        }
        else if(command === 'set'  && args.length === 1){
            var tmp = client.emojis.cache.find(e => e.toString() === args[0]);
            if(tmp === undefined){
                message.channel.send(`${message.author} You didn't provide a valid emoji.`);
            }
            else{
                set_config(tmp.toString());
                message.channel.send(`${message.author} Successfully set the background emoji.`);
            }
        }
        else{
            message.channel.send(`${message.author} Invalid command, use \`!emoji help\` for help.`);
        }
    }
});

client.login(config.token);
