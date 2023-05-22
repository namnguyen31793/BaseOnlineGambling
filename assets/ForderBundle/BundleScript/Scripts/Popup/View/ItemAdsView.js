cc.Class({
    extends: cc.Component,
    ctor() {
        this.deactive = false;
    },

    properties: {
        marNormal : cc.Material,
        marOff : cc.Material,
        listItem : [cc.Button],
        isSpecial : false,
        iconItem : cc.Node,
        iconCoin : cc.Node,
        iconFull : cc.Node,
        lbReward : [cc.Label],
        iconGame : [cc.Sprite],
        lbIndex : cc.Label,
    },

    Init(data) {
        this.lbIndex.string = data.MissionId.toString();
        if(this.isSpecial) {
            this.iconItem.active = false;
            this.iconFull.active = false;
            this.iconCoin.active = false;
            if(data.RewardDescription.length > 0) {
                let info = JSON.parse(data.RewardDescription);
                for(let i = 0; i < this.iconGame.length; i++) {
                    if(i%3 < info.length) {
                        this.iconGame[i].node.active = true;
                        Global.Helper.GetIconGame(this.iconGame[i], info[i%3].GameID);
                    } else {
                        this.iconGame[i].node.active = false;
                    }
                }
                if(data.RewardMoney > 0) {
                    this.iconFull.active = true;
                    this.SetReward("Freespin\n+\n"+Global.Helper.formatNumber(data.RewardMoney));
                } else {
                    this.iconItem.active = true;
                    this.SetReward("+Freespin");
                }
            } else {
                this.iconCoin.active = true;
                this.SetReward("+"+Global.Helper.formatNumber(data.RewardMoney));
            }
        } else {
            this.SetReward("+"+Global.Helper.formatNumber(data.RewardMoney));
        }
    },

    SetReward(text) {
        for(let i = 0; i < this.lbReward.length; i++) {
            this.lbReward[i].string = text;
        }
    },

    OnActive() {
        this.lbReward[0].node.active = true;
        this.lbReward[1].node.active = false;
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].interactable = true;
        }
    },

    OnDeActive() {
        this.lbReward[0].node.active = false;
        this.lbReward[1].node.active = true;
        for(let i = 0; i < this.listItem.length; i++) {
            this.listItem[i].interactable = false;
        }
    },
});
