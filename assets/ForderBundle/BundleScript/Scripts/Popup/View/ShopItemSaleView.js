

cc.Class({
    ctor() {
        
    },

    properties: {
        lbNumbItem : cc.Label,
        iconGame : cc.Sprite,
    },

    Init(id, cost, value, rewardStr, bonus, i) {
        this._super(id, cost, value, rewardStr, bonus, i);
        let data = JSON.parse(rewardStr);
        if(data[0].ItemType != null) {
            this.lbNumbItem.string = "x"+Global.Helper.formatNumber(data[0].Amount);
        } else if(data[0].GameID != null) {
            this.lbNumbItem.string = "FREE x"+data[0].Amount;
            Global.Helper.GetIconGame(this.iconGame, data[0].GameID);
        }
    },

});
