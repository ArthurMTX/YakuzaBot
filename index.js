const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, EmbedBuilder, Partials} = require('discord.js');
require('dotenv').config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});
const dbPath = path.join(__dirname, 'processedMessages.json');

if (!process.env.DISCORD_TOKEN) {
    console.error('Le token n\'a pas été trouvé.');
    process.exit(1);
}

if (!fs.existsSync(dbPath)) {
    console.log('Le fichier DB n\'existe pas. Création du fichier...');
    fs.writeFileSync(dbPath, '{}', 'utf8');
}

ANNOUNCEMENTS_CHANNEL_ID = '1217042241298632775';
LOGS_CHANNEL_ID = '1219682616412868618';
VALIDATOR_ROLE_NAME = 'Yakuza 1️⃣';
REACTION_NAME = 'APSRJWHATT';
ROLES_LIST = [
    'Bulliste de Base 🫧',
    'Bulliste en Mieux 🫧',
    'Bulliste qui Progresse 🫧',
    'Abonniste de Base 📭',
    'Abonniste en Mieux 📭',
    'Yakuziste 🐉',
    'Perdiste 🚫',
    'Cuicuiste 🐣',
    'Kantiste 📚',
    'Couilliste 🪇',
    'Pizza-yolo 🍕',
    'Educator 🎓',
    'Arc-en-cieliste 🌈'
]
CHANNELS_LIST = [
    '1073286655584247841', // jacuzzi
    '1212946526830329956', // a-plusieurs-sous-raphael-julliard
    '1213055457019822111', // cousu-de-fil-rouge
    '1212935551167111218', // y’a-un-yakuza-dans-mon-jacuzzi
    '1213526921418383370', // marylin-monroe
    '1213053540268904448', // hey-perdedor
    '1213053455472787546', // cui-cui
    '1213053349373546497', // kant-ou-brocante
    '1213055410010062858', // samba-les-couilles
    '1213053495285121056', // pizza-pasta
    '1213076615647600700', // private-education
    '1213055330456703046', // les-arcenciels
    '1215269193075920916' // bravo
]
ANNOUNCEMENTS_MESSAGES = [
    '${USER}, t\'as vu ? Tu es devenu un ${ROLE} !',
    'Regarde derrière ton oreille ${USER}, là tu vois ? Oui c’est ton nouveau rôle, tu es ${ROLE} !',
    'Mesdames et Messieurs et Moulins à poivre, sur ce tabouret ${USER} va enfin devenir ${ROLE}',
    'Sur la longue route pour devenir <@&1213039056913436673>, ${USER} a réussi un pas de fourmi volante : il se transforme en ${ROLE}',
    '${USER}, jadis tu fus <@&1212937772227362857>, mais tu as pris de la bouteille, et tu es un grand maintenant, tu es ${ROLE}',
    'Vive le vent, vive le vent, vive le vent de ${USER}, boule de neige et jour de l’an, t’as reçu le rôle de ${ROLE}',
    'Woof woof ? Meow ! ${USER} grrr ${USER} ${ROLE} couac'
]

client.once(Events.ClientReady, c => {
    console.log(`Le bot est prêt ! Connecté en tant que ${client.user.tag}.`);
});

function readDB() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier DB :', error);
        return {};
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Erreur lors de l\'écriture dans le fichier DB :', error);
    }
}

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    let { message, emoji } = reaction;
    const logsChannel = client.channels.cache.get(LOGS_CHANNEL_ID);

    const processedMessages = readDB();

    if (processedMessages[message.id]) {
        console.log('Ce message a déjà conduit à une promotion. Ignoré.');
        logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : already processed).`);
        return;
    }

    if (message.partial) {
        try {
            message = await message.fetch();
        } catch (error) {
            console.error('Quelque chose s\'est mal passé lors de la récupération du message :', error);
            logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : ${error}).`);
            return;
        }
    }

    if (emoji.name === REACTION_NAME) {
        try {
            const channelIndex = CHANNELS_LIST.indexOf(message.channel.id);
            const member = await message.guild.members.fetch(user.id);
            const validatorRole = message.guild.roles.cache.find(role => role.name === VALIDATOR_ROLE_NAME);

            if (!validatorRole) {
                console.log('Le rôle de validateur n\'a pas été trouvé.');
                logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : validator role not found).`);
                return;
            }

            if (member.roles.cache.has(validatorRole.id)) {
                console.log('L\'utilisateur a le rôle de validateur.');
                logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (validator).`);

                const targetMember = await message.guild.members.fetch(message.author.id);

                let highestRole = targetMember.roles.highest;
                let highestRoleIndex = ROLES_LIST.indexOf(highestRole.name);

                if (highestRoleIndex === -1) {
                    console.log('Le rang actuel n\'a pas été trouvé.');
                    logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : current role (<@&${highestRole.id}>) not found).`);
                    return;
                }

                if (highestRoleIndex !== channelIndex) {
                    console.log('Le rang actuel ne correspond pas au salon.');
                    logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : channel mismatch).`);
                    return;
                }

                let newRole = message.guild.roles.cache.find(role => role.name === ROLES_LIST[highestRoleIndex + 1]);

                if (!newRole) {
                    console.log('Le nouveau rôle n\'a pas été trouvé.');
                    logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : new role not found).`);
                    return;
                }

                await targetMember.roles.add(newRole);
                console.log(`${targetMember.user.tag} a été promu au nouveau rang.`);
                logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (promotion de ${targetMember.user.tag} au rang <@&${newRole.id}>).`);

                let announcementMessage = ANNOUNCEMENTS_MESSAGES[Math.floor(Math.random() * ANNOUNCEMENTS_MESSAGES.length)];
                announcementMessage = announcementMessage.replace('${USER}', '<@' + targetMember.id + '>');
                announcementMessage = announcementMessage.replace('${ROLE}', '<@&' + newRole.id + '>');
                client.channels.cache.get(ANNOUNCEMENTS_CHANNEL_ID).send(announcementMessage);

                processedMessages[message.id] = true;
                writeDB(processedMessages);
            } else {
                console.log('L\'utilisateur n\'a pas le rôle de validateur.');
                logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : not a validator).`);
            }
        } catch (error) {
            console.error('Une erreur est survenue lors de la gestion de la réaction :', error);
            logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : ${error}).`);
        }
    } else {
        console.log('La réaction n\'est pas celle attendue : ' + emoji.name);
        logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : unknown reaction).`);
    }
});

// if message mention the bot, reply with an AI generated message via OpenAI API


client.login(process.env.DISCORD_TOKEN);

