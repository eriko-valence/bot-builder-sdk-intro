var restify = require('restify');
var builder = require('botbuilder');
var azure = require('botbuilder-azure'); 

// Table storage
var tableName = "BotState"; // You define
var storageName = "erikobotbuildersdk"; // Obtain from Azure Portal
var storageKey = "Jn/4tqAaQLKTywbDhKKMNtC6CKdTYsQ6wVP8QrRVZF5uoinD+GV6oLavCYGWVQgkigsrrkPSBgY0Qa0sBieMOQ=="; // Obtain from Azure Portal

var azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
var tableStorage = new azure.AzureBotStorage({gzipData: false}, azureTableClient);

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    console.log(session.message.text);
    session.send("You said: %s", session.message.text);
    session.send
}).set('storage', tableStorage);