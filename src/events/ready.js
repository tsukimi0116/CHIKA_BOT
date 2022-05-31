module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: '女裝豆花',
                    type: 'PLAYING',
                },
            ],
        });
        console.log(`[ API ] Logged in as ${client.user.tag}`);
    },
};