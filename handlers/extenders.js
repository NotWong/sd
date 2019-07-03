const { MessageEmbed, TextChannel, DMChannel } = require("discord.js");

MessageEmbed.prototype.send = function() {
    if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof DMChannel)) return Promise.reject("No se pudo enviar el embed");
    return this.sendToChannel.send("", { embed: this });
};

TextChannel.prototype.buildEmbed = DMChannel.prototype.buildEmbed = function() {
    return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
};
