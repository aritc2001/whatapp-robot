const qrcode = require('qrcode-terminal');
const {Client, LegacySessionAuth, LocalAuth, MessageMedia, List} = require('whatsapp-web.js');
const moment = require("moment");
const db = require("./db/db"); //Database MySQL
const email = require("./email/email"); //Email

const client = new Client({
        authStrategy: new LocalAuth({
            clientId: "client-one" //Unidentificador(Sugiero que no lo modifiques)
     })
})

const db_wabot = db.db_connect(); //Connect to mysql server
db.db_create_database(db_wabot); //Create new database
db.db_create_table(db_wabot); //Create new table

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    if (typeof session !== 'undefined' && session !== null) {
        console.log(session);
    }
});

//Generate QR code for WA linked device
client.on("qr", qr => {
    qrcode.generate(qr, {small: true});
})

//Connect to WA-Bot
client.on('ready', () => {
    console.log("Connected, ready to go")
});

// Mention contacts that send you a message
client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    
    const wabot_chat = {
        chat_subject: 'Whatapp Notification ' + chat.lastMessage.id.id,
        chat_time: moment.unix(chat.timestamp).format('YYYY/MM/DD HH:mm:ss'), //convert timestamp to milliseconds and construct Date object
        chat_sender_number: contact.number,
        chat_receiver_number: contact.client.info.me.user,
        chat_body: chat.lastMessage.body,
        chat_sender_name: contact.name + ' (' + contact.pushname + ')',
        chat_receiver_name: contact.client.info.pushname,
        chat_id: chat.lastMessage.id.id,
        chat_id_serialized: chat.id._serialized
    };

    const db_record = {
        chat_time: "'" + moment.unix(chat.timestamp).format('YYYY/MM/DD HH:mm:ss') + "'", //convert timestamp to milliseconds and construct Date object
        chat_sender_number: "'" + chat.id.user + "'",
        chat_body: "'" + chat.lastMessage.body + "'"
    };

    if(msg.body.toLowerCase() === 'assalamualaikum') {
        msg.reply(`Wa'alaikumussalam @${wabot_chat.chat_sender_name}`);
        
        await chat.sendMessage(`Wa'alaikumussalam @${chat.id.user}`, {
                mentions: [chat.id._serialized]
            }
        );
	}
    else {
        await chat.sendMessage(`Greeting @${chat.id.user}`, {
                mentions: [chat.id._serialized]
            }
        );
    }

    console.log('>> ' + wabot_chat.chat_time + ` > @${chat.id.user}` + " said: '" + chat.lastMessage.body + "'"); //write log in consolo panel
    db.db_insert_record_log(db_wabot, db_record); //Insert new record
    
    email.email_Send(wabot_chat); //Send email
});

client.initialize();