

cc.Class({
    extends: cc.Component,
    ctor() {
        this.listReward = [];
        this.type = 0;
    },

    properties: {
        gameContent : cc.Node,
        btnClose : cc.Node,
    },

    Init(type) {
        this.type = type;
        this.gameContent.active = false;
        let data = {};
		data[1] = type;
        data[40] = type;
        require("SendRequest").getIns().MST_Client_Get_Daily_Game_Reward_List(data);
        this.btnClose.active = false;
    },

    ShowWithRewad(listReward) {
        this.listReward = listReward
        this.gameContent.active = true;
        this.ShowReward(this.listReward);
    },

    ShowNoReward() {
        this.gameContent.active = true;
    },

    ShowReward(listReward) {

    },
});
