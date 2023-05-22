cc.Class({
    ctor() {
        this.info = null;
        this.lastInfo = null;
        this.score = 0;
        this.rank = 0;
        
    },
    extends: cc.Component,

    properties: {
        imgAva : cc.Sprite,
        lbRank : require("TextJackpot"),
        lbName : cc.Label,
        lbScore : require("TextJackpot"),
        top1: cc.Node,
        effectRun : cc.Node,
    },

    SetInfo(info, isMe) {
        this.info = info;
        this.node.active = true;
        if(!info) {
            this.lbRank.node.getComponent(cc.Label).string = "-";
            this.lbName.string = "-";
            this.lbScore.node.getComponent(cc.Label).string = "-";
        } else {
            this.lbRank.node.getComponent(cc.Label).string = info.RankId;
            this.rank = info.RankId;
            this.lbName.string = Global.Helper.formatName(info.Nickname);
            this.lbScore.node.getComponent(cc.Label).string = Global.Helper.formatNumber(info.Score);
            Global.Helper.GetAvataOther(this.imgAva, info.Nickname);
        }
        if(isMe) {
            this.lbName.string = Global.Helper.formatName(Global.MainPlayerInfo.nickName);
            Global.Helper.GetAvata(this.imgAva);
        }
    },

    SetFake(rank, listTop, scoreCheck, isUp, listRandomName, isCoppy = false) {
        this.rank = rank;
        if(rank <= listTop.length) {
            if(rank > 0) {
                this.lbRank.node.getComponent(cc.Label).string = rank.toString();
                this.lbName.string = Global.Helper.formatName(listTop[rank-1].Nickname);
                this.lbScore.node.getComponent(cc.Label).string = Global.Helper.formatNumber(listTop[rank-1].Score);
                this.score = listTop[rank-1].Score;
            }
            
        } else {
            if(rank <= 3) {
                this.lbRank.node.getComponent(cc.Label).string = "-";
                this.lbName.string = "-";
                this.lbScore.node.getComponent(cc.Label).string = "-";
                this.score = 0;
            } else {
                this.lbRank.node.getComponent(cc.Label).string = rank.toString();
                let r = Global.RandomNumber(0,listRandomName.length-1);
                let name = listRandomName[r];
                this.lbName.string = Global.Helper.formatName(name);
                if(isCoppy) {
                    this.score = scoreCheck;
                } else {
                    if(isUp) {
                        this.score = scoreCheck + Global.RandomNumber(0,4) * 5;
                        if(this.score >= listTop[listTop.length-1].Score)
                            this.score = listTop[listTop.length-1].Score;
                    } else {
                        this.score = scoreCheck - Global.RandomNumber(0,4) * 5;
                        if(this.score < 0)
                            this.score = 0;
                    }
                }
                Global.Helper.GetAvataOther(this.imgAva, name);
                this.lbScore.node.getComponent(cc.Label).string = Global.Helper.formatNumber(this.score);
            }
            
        }
    },

    MovePosition(pos) {
        if(this.lastInfo == null || this.lastInfo.RankId != this.info.RankId || this.lastInfo.Score != this.info.Score) {
            this.effectRun.active = true;
            this.scheduleOnce(()=>{
                this.effectRun.active = false;
            } , 1);
        }
        if(this.info) {
            this.lbRank.StartIncreaseTo(this.info.RankId);
            this.lbScore.StartIncreaseTo(this.info.Score);
            if(this.info.RankId != 1) {
                this.top1.active = false;
                this.lbRank.node.active = true;
            }
        }
        
        let acMove = cc.callFunc(() => {
            this.node.runAction(cc.moveTo(0.5, pos));
        });
        let acEnd = cc.callFunc(()=>{ 
            if(this.info) {
                if(this.info.RankId == 1) {
                    this.top1.active = true;
                    this.lbRank.node.active = false;
                } else {
                    this.top1.active = false;
                    this.lbRank.node.active = true;
                }
            }
            
        });
        this.node.runAction(cc.sequence(acMove, cc.delayTime(0.5), acEnd));
        this.lastInfo = this.info;
    },

    Move(distance) {
        this.node.y += distance;
    },

    Hide() {
        this.node.active = false;
    },

    
});
