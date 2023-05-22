

cc.Class({
    extends: cc.Component,

    properties: {
        element1 : cc.Label,
        element2 : cc.Label,
        element3 : cc.Label,
    },

    initItem(info) {
        this.element1.string = this.formatTime(info.DateTime);
        this.element2.string = Global.Helper.formatNumbertNumber(info.NewAccountBalance);
        this.element3.string = info.ActionDescription;
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString2((new Date(str)).getTime());
    },
    
});
