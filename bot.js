// Discord bot needs
const Discord = require('discord.js');
const client = new Discord.Client();

// Filesystem needs
const fs = require('fs');
const util = require('util');
const date = new Date();

// NOTE: Feel free to edit or change most of the const values to your needs.

/* --- Token --- */

// Super secret token!
const token = "token goes here";

/* --- Logging --- */

// Disable logging to a file here
const log_to_file = true;

// Create log file
var log_file;

if (log_to_file) {
    var datetime = "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
    log_file = fs.createWriteStream(__dirname + '/log' +  datetime + '.log', {flags : 'w'});
} else {
    console.log("[!] No logging to file!");
}

// Override log to also write to file
console.log = function(msg) {
  if ( log_to_file ) { log_file.write(util.format(msg) + '\n'); }
  process.stdout.write(util.format(msg) + '\n');
};

/* --- Content Pairs --- */

// Initialize data
var copypastaData;
var tyroneData;

// Dict of trigger : response pairs
// This can be anything, from specific text, to video links, to emojis, to whatever.
// This is loaded in from data.json
var contentPairs = {};

// Load data from json and apply it
function loadContentPairs() {
    /// Read
    // get copypasta data from copypasta.json
    contentData = JSON.parse(fs.readFileSync("copypasta.json"));

    /// Parse
    // Load the copypasta pairs
    console.log('[*] Loading copypasta pairs...');
    // Load data into content pairs from jsonData
    for(var attribute in contentData){
        contentPairs[attribute] = contentData[attribute];
    }

}


/* --- Help message setup --- */

// Length of help output for responses
const responseLen = 40;

// Help message loaded on start
var helpMsg = "";

// This is the command the user must enter to get the help message from the bot
const helpCommand = "!bot.help";

/* --- Ready up --- */

// Ready message
// From the docs:
// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
client.on('ready', () => {

    // Load data from json
    loadContentPairs();

    // Load the help message
    // This creates a specfic message to send to users who request to see the
    // bot features.
    console.log('[*] Loading help...');
    for (var key in contentPairs) {
        helpMsg += (key + " => " + contentPairs[key].substring(0, responseLen) + "...\n")
    }

    // Set the bot's status. Can be anything, but it is a user friendly
    // idea to set it to the command used to get help
    client.user.setStatus('online', helpCommand);

    console.log('[*] Logged in & monitoring');
});

/* --- Main event listener --- */

// Event listener for messages
client.on('message', message => {
    console.log('[:] Msg found...');

    // Ignore messages from bots. Serves to not create endless loops if responds to self for example.
    if (message.author.bot) {
        console.log('[:] Ignorng found as it is a bot msg...');

    } else {
        // Iterate through dict, look for triggers
        console.log('[:] Searching for match...');

        // Search for a match
        for (var key in contentPairs) {
            // If a trigger is found, put response into channel
            if (message.content.indexOf(key) !== -1) {
                console.log("[!] Message found!")
                message.channel.sendMessage(contentPairs[key]);
            }
        }

        if (message.content.indexOf(helpCommand) !== -1) {
            console.log("[:] Help requested.")
            message.channel.sendMessage(message.author + " I PM'd you a list of my commands");
            console.log("[:] Help sent.")
            message.author.sendMessage(helpMsg).catch(error=>{});
        }

        // Alterative methods may be used as well
        // for example, if a message is just 'RMS' it'll respond with the GNU/Linux interjection
        // It is recommended to just make two entries in data.json instead, if you really need it
        if (message.content === "RMS") {
            console.log("[!] Alternative message found!")
            // As you can see, we can just send out contentPairs with a key to get the message
            message.channel.sendMessage(contentPairs["linux"]);
        }

    }
});

// Login
client.login(NTUxMzI3NTczNzg4MDY1Nzk2.D1vazw.RMwcaAN3tZ5O3G-UmiSvfF72x7o);