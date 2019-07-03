const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "redraw",
        });
    }

    async execute(message) {
        if (!message.guildAdmin && !message.globalAdmin) return message.channel.send('No puede usar este comando');

        const match = /(?:redraw)(?:\s+(?:<#)?(\d{17,20})(?:>)?)?(?:\s+(\d+))/i.exec(message.content);

        if (!match) return message.channel.send('Uso: `mg!redraw [channel-mention|channel-id] <giveaway-number>`');

        const channel = match[1] ? message.guild.channels.get(match[1]) || message.channel : message.channel;

        if (this.client.lastGiveawayCache.filter(giveaway => giveaway.channel.id === channel.id).size <= 0) return message.channel.send(`There has been no prior giveaway in ${channel.name}.`);

        const lastGiveaway = this.client.lastGiveawayCache.get(`${channel.id}-${match[2]}`);
        if(!lastGiveaway) return message.channel.send(`Giveaway no encontrado.`);

        const winnerIds = lastGiveaway.winners.map(u => u.id);

        const users = (await lastGiveaway.msg.reactions.get("🎉").users.fetch()).array().filter(u => u.id !== lastGiveaway.msg.author.id && (lastGiveaway.winners.length && !winnerIds.includes(u.id)));

        if (!users.length) return message.channel.send("Todos los usuarios que ingresaron fueron elegidos.");

        const winner = lastGiveaway.draw(users);
        lastGiveaway.winners.push(winner);
        channel.send(`¡Felicitaciones ${winner.toString()}! Ganaste **${lastGiveaway.title}**, para reclamar pidelo en <#583033222133448729>`);
    }
};
