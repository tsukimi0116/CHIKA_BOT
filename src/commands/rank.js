const { SlashCommandBuilder } = require('@discordjs/builders');
const Axios = require('axios');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('戰隊戰排名查詢')
        .addStringOption((option) =>
            option
                .setName('server')
                .setDescription('伺服器編號')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('戰隊名稱，支援模糊搜尋，名字不用全打上來')
                .setRequired(true)),
    async execute(interaction) {
        // 格式化時間
        let initYearMonth = moment().format('L');
        let hour = moment().format('H');
        let minite = moment().format('mm');
        let FormatYearMonth = initYearMonth.split('/');
        let YearMonth = `${FormatYearMonth[2] + FormatYearMonth[0] + FormatYearMonth[1]}`;
        if (minite <= '30') {
            minite = '00';
        }
        else {
            minite = '30';
        }
        let hours = parseInt(hour);
        if (hours <= 9) {
            hour = '0' + hour;
        }
        let server = interaction.options.getString('server');
        let name = interaction.options.getString('name');
        try {
            // 取得排名資訊
            let request = await Axios.post('http://sd016808.asuscomm.com:6812/query/clandata',
                { 'server': server, 'date': YearMonth + hour + minite });
            let initData = request.data.message;
            let Data = Object.keys(initData).map(key => {
                return {
                    obj: initData[key],
                };
            });
            // 模糊搜尋戰隊資訊 使用變數為戰隊名稱
            let Filter = Data.filter((val) => {
                return val.obj.Clan_Name.includes(name);
            });
            if (Filter.length === 0) {
                interaction.reply({
                    content: '你是不是打錯戰隊名稱了呢? <a:Holo_ayame:847486006399336448>',
                });
            }
            else {
                let { Clan_Name, Rank, Lap, Boss, Damage, Left_Hp, Lead_Name } = Filter[0].obj;
                interaction.reply({
                    content: `>>> 時間檔次:${YearMonth} ${hour}${minite}
戰隊名：${Clan_Name}
隊長：${Lead_Name}
排名：${Rank}
目前進度：${Lap}周 ${Boss}王
分數：${Damage}
剩餘血量：${Left_Hp}`,
                });
            }
        }
        catch (error) {
            console.log(hour);
            interaction.reply({
                content: '整點或30分時資料可能還在跑唷，請稍後再搜尋 <a:Holo_ayame:847486006399336448>',
            });
        }
    },
};