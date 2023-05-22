cc.Class({
    extends: cc.Component,
    ctor() {
        this.gameType = 0;
        this.status = false;
    },

    properties: {
        lbDescription : cc.Label,
        lbMoney : cc.Label,
        lbBet : cc.Label,
        anim : cc.Animation,
        icon : cc.Sprite,
        btnPlay : cc.Button,
        imgRect : cc.Sprite,
        sprActive : cc.SpriteFrame,
        sprUnActive : cc.SpriteFrame,
    },

    UpdateInfo(info) {
        this.id = info.ChallengeId;
        this.isSuccess = false;
        this.gameType = info.GameType;
        cc.resources.load("Img/Icon"+info.GameType , cc.SpriteFrame , (err , pre)=>{ 
            this.icon.spriteFrame = pre;
        });
        this.lbMoney.string = Global.Helper.formatNumber(info.ChallengeReward);
        this.lbBet.string = Global.Helper.formatNumber(info.ChallengeBet);
        this.lbDescription.string = info.ChallengeDescription;
        cc.log(info.ChallengeStatus);
        if(!info.ChallengeStatus) {
            this.btnPlay.node.active = true;
            this.imgRect.spriteFrame = this.sprActive;
        } else {
            this.btnPlay.node.active = false;
            this.imgRect.spriteFrame = this.sprUnActive;
        }
        

    },

    ClickPlay() {
        Global.isChallenge = 1;
        require("ScreenManager").getIns().roomType = this.gameType;
        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);


        // let data = {};
		// data[1] = this.id;
		// require("SendRequest").getIns().MST_Client_Challenge_Register(data);
    },

    
});
