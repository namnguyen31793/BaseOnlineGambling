var SPEED_ITEM = 500;

cc.Class({
    extends: cc.Component,
    ctor(){
        this.positionTarget = 0;
        this.delayTime = 0;
        this.isRun = false;
        this.jsJump = false;
    },

    properties: {
        imageGame : cc.Sprite,
        imageWin : cc.Sprite,
        nickName : cc.Label,
        money : cc.Label,
    },


    Setup(gameType, nickname, moneyString, accountId){
        return;
        // Global.Helper.GetIconGame(this.imageGame, gameType);
        Global.Helper.GetAvataOtherById(this.imageGame, accountId);
        //Global.GetIconWin(this.imageGame, gameType);

        this.nickName.string = nickname;
        this.money.string = moneyString;
    },

    Moveitem(position, delay = 0){
        this.delayTime = delay;
        this.positionTarget = position;
        this.isRun = true;
        this.jsJump = false;
    },

    update (dt) {
        if(this.isRun){
            if(this.delayTime > 0){
                this.delayTime -= dt;
                return;
            }
            let pos = this.node.getPosition().y - SPEED_ITEM*dt;
            if(pos < this.positionTarget){
                pos = this.positionTarget;
                this.isRun = false;
            }
            this.node.setPosition(cc.v2(0, pos));
        }
    },
});
