cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initItem(rawData) {
        var info = JSON.parse(rawData);
        let date = new Date(info.CreatedTime);//new Date(info.CreatedTime);
        let lbDate = date.getDate();
        let lbMonth = date.getMonth()+1;
        let lbHour = date.getHours();
        let lbMinute = date.getMinutes();
        let lbSeccond = date.getSeconds();
        let timeReturn = lbDate + "/" + lbMonth + " " + lbHour + ":" + lbMinute + ":" + lbSeccond;

        let listCp = this.getComponentsInChildren(cc.Label);
        listCp[0].string = timeReturn
        listCp[1].string = info.SpinID;
        var roomBet = 0;
        switch (info.RoomID) {
            case 1:
                roomBet = 100;
                break;
            case 2:
                roomBet = 1000;
                break;
            case 3:
                roomBet = 10000;
                break;
            default:
                break;
        }
        listCp[2].string = Global.Helper.formatNumber(roomBet);
        listCp[3].string = Global.Helper.formatNumber(info.Total);
        listCp[4].string = Global.Helper.formatNumber(info.AccountBalance);
    },

    // update (dt) {},
});
