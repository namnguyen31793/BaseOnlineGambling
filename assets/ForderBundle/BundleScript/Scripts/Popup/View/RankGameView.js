cc.Class({
    extends: cc.Component,

    properties: {
        lbPosition : cc.Label,
        lbName : cc.Label,
        lbScore : cc.Label,
        imgAva : cc.Sprite,
    },

    initItem(info) {
        this.lbPosition.string = info.Position.toString();
        this.lbName.string = info.Nickname;
        this.lbScore.string = Global.Helper.formatNumber(info.Score);
        Global.Helper.GetAvataOther(this.imgAva, info.Nickname);
    },


});
