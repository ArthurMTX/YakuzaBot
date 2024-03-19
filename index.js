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
    'Arc-en-cieliste 🌈',
    'Yakuza 1️⃣'
]

client.once(Events.ClientReady, c => {
    console.log(`Le bot est prêt ! Connecté en tant que ${client.user.tag}.`);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    let { message, emoji } = reaction;
    const logsChannel = client.channels.cache.get(LOGS_CHANNEL_ID);

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

                const targetMember = message.guild.members.cache.find(member => member.id === message.author.id);

                let highestRole = targetMember.roles.highest;
                let highestRoleIndex = ROLES_LIST.indexOf(highestRole.name);

                if (highestRoleIndex === -1) {
                    console.log('Le rang actuel n\'a pas été trouvé.');
                    logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (err : current role not found).`);
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
                logsChannel.send(`<@${user.id}> a réagi avec ${emoji.name} à [ce message](<${message.url}>) (promotion de ${targetMember.user.tag} au rang ${newRole.name}).`);

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


client.login(process.env.TOKEN);

