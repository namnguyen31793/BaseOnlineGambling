cc.Class({
    extends: cc.Component,
    ctor() {
        this.isInit = false;
    },

    properties: {
        lbName : cc.Label,
        lbMoney : cc.Label,
        ava : cc.Sprite,
        nodeMove : cc.Node,
        flag : cc.Sprite,
    },

    Init() {
        if(this.isInit)
            return;
        this.isInit = true;
        this.schedule(() => {
            if(Global.listDataBigWinLive.length > 0) {
                let data = Global.listDataBigWinLive[Global.RandomNumber(0, Global.listDataBigWinLive.length)];
                this.ShowBigWin(data.AccountId, data.Nickname, data.RewardBalance);
            }
        }, 8);
    },

    ShowBigWin(id, name, money) {
        if(id == Global.MainPlayerInfo.accountId) {
            Global.Helper.GetNationRandom(this.flag, 0);
            Global.Helper.GetAvata(this.ava);
        } else {
            Global.Helper.GetNationRandom(this.flag, id);
            Global.Helper.GetAvataOther(this.ava, name);
        }
        
        this.lbName.string = name;
        this.lbMoney.string = Global.Helper.formatNumber(money);
        this.nodeMove.setPosition(cc.v2(215, 0));
        this.nodeMove.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0,0)), cc.delayTime(6), cc.moveTo(0.5, cc.v2(-215, 0)), cc.delayTime(1) , cc.callFunc(()=>{
            
        })));
    },

});
