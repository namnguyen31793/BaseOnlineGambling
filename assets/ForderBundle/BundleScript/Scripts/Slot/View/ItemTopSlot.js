cc.Class({
    extends: cc.Component,

    properties: {
        labelTime: cc.Label,
        labelAccount: cc.Label,
        labelSess: cc.Label,
        labelRoom: cc.Label,
        labelGold: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItem(rawData) {
        if(this.itemID  == 0 ){
            this.node.children[0].active = false;
        }else{
            this.node.children[0].active = true;
        }
        var info = JSON.parse(rawData);
        let date = new Date(info.LogTime);//new Date(dateUnTime);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        var roomBet = 0;
        switch (info.RoomId) {
            case 1:
                roomBet = 100;
                break;
            case 2:
                roomBet = 500;
                break;
            case 3:
                roomBet = 1000;
                break;
            case 4:
                roomBet = 10000;
                break;
            default:
                break;
        }

        this.labelTime.string = day + "/" + month + " " + hours + ":" + minutes + ":" + seconds;
        this.labelAccount.string = info.Nickname;
        this.labelSess.string = info.SpinId;
        this.labelRoom.string = Global.Helper.formatNumber(roomBet);
        this.labelGold.string = Global.Helper.formatNumber(info.TotalJackpotReward);
    },


    // update (dt) {},
});
