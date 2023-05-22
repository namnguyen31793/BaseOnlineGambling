
cc.Class({
    extends: cc.Component,

    properties: {
        imgAva : cc.Sprite,
        lbName : cc.Label,
        lbRank : cc.Label,
        lbScore : cc.Label,
        nodeIcon : cc.Node,
        top1 : cc.Node,
        top2 : cc.Node,
        top3 : cc.Node,
        isMe : {
            default : false,
        },
    },

    SetInfoOther(info) {
        if(!info) {
            this.lbName.string = "-";
            this.lbScore.string = "-";
            this.nodeIcon.active = false;
        } else {
            this.lbName.string = info.Nickname;
            this.lbScore.string = Global.Helper.formatNumber(info.Score);
            this.nodeIcon.active = true;
            
            this.scheduleOnce(()=>{
                this.nodeIcon.x = this.lbScore.node.x + this.lbScore.node.width/2 + 10 + this.nodeIcon.width/2;
            } , 0.1); 
            Global.Helper.GetAvataOther(this.imgAva, info.Nickname);
        }
    },

    SetInfoUser(info) {
        Global.Helper.GetAvata(this.imgAva);
        if(!info) {
            this.lbName.string = Global.MainPlayerInfo.nickName;
            this.lbRank.string = "-";
            this.lbScore.string = "0";
        } else {
            this.lbName.string = info.Nickname;
            this.lbScore.string = Global.Helper.formatNumber(info.Score);
            if(info.RankId == 1) {
                this.top1.active = true;
                this.top2.active = false;
                this.top3.active = false;
                this.lbRank.node.active = false;
            } else if(info.RankId == 2) {
                this.top1.active = false;
                this.top2.active = true;
                this.top3.active = false;
                this.lbRank.node.active = false;
            } else if(info.RankId == 3) {
                this.top1.active = false;
                this.top2.active = false;
                this.top3.active = true;
                this.lbRank.node.active = false;
            } else {
                this.top1.active = false;
                this.top2.active = false;
                this.top3.active = false;
                this.lbRank.node.active = true;
            }
            this.lbRank.string = Global.Helper.formatNumber(info.RankId);
        }
        this.scheduleOnce(()=>{
            this.nodeIcon.x = this.lbScore.node.x + this.lbScore.node.width/2 + 5 + this.nodeIcon.width/2;
        } , 0.1); 
    },
});
