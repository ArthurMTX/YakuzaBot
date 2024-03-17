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

VALIDATOR_ROLE_NAME = 'Validateur';
REACTION_NAME = 'APSRJWHATT';
ROLES_LIST = [
    'Bulliste 🫧',
    'Abonniste 📭',
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

    if (message.partial) {
        try {
            message = await message.fetch();
        } catch (error) {
            console.error('Quelque chose s\'est mal passé lors de la récupération du message :', error);
            return;
        }
    }

    if (emoji.name === REACTION_NAME) {
        try {
            const member = await message.guild.members.fetch(user.id);
            const validatorRole = message.guild.roles.cache.find(role => role.name === VALIDATOR_ROLE_NAME);

            if (!validatorRole) {
                console.log('Le rôle de validateur n\'a pas été trouvé.');
                return;
            }

            if (member.roles.cache.has(validatorRole.id)) {
                console.log('L\'utilisateur a le rôle de validateur.');
                const targetMember = message.guild.members.cache.find(member => member.id === message.author.id);

                let highestRole = targetMember.roles.highest;
                let highestRoleIndex = ROLES_LIST.indexOf(highestRole.name);

                if (highestRoleIndex === -1) {
                    console.log('Le rang actuel n\'a pas été trouvé.');
                    return;
                }

                let newRole = message.guild.roles.cache.find(role => role.name === ROLES_LIST[highestRoleIndex + 1]);

                if (!newRole) {
                    console.log('Le nouveau rôle n\'a pas été trouvé.');
                    return;
                }

                await targetMember.roles.add(newRole);
                console.log(`${targetMember.user.tag} a été promu au nouveau rang.`);
            } else {
                console.log('L\'utilisateur n\'a pas le rôle de validateur.');
            }
        } catch (error) {
            console.error('Une erreur est survenue lors de la gestion de la réaction :', error);
        }
    } else {
        console.log('La réaction n\'est pas celle attendue : ' + emoji.name);
    }
});


client.login(process.env.TOKEN);

