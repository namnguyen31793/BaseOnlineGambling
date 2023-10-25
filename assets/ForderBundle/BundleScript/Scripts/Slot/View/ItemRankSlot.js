// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor() {
        this.RankView = null;
        this.data = null;
    },

    properties: {
    },

    initItem(info, rankview) {
        this.node.active = true;
        this.rankview = rankview;
        this.data = info;

        let date = new Date(info.ActionTime);//new Date(info.CreatedTime);
        let listCp = this.getComponentsInChildren(cc.Label);
        listCp[0].string = Global.Helper.GetStringFullYear(date);
        listCp[1].string = Global.Helper.formatNumber(info.TotalBet/20);
        listCp[2].string = info.Nickname;
        listCp[3].string = Global.Helper.formatNumber(info.RewardValue);
    },

    ClickShowInfo(){
        this.rankview.ShowDetailTurn(this.data);
    },

    Clear(){
        this.node.active = false;
        let listCp = this.getComponentsInChildren(cc.Label);
        listCp[0].string = '';
        listCp[1].string  = '';
        listCp[2].string = '';
        listCp[3].string = '';
    },
});
