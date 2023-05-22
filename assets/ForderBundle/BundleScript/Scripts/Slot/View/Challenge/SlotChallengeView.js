cc.Class({
    extends: cc.Component,
    ctor() {
        this.totalTurn = 0;
        this.totalMoney = 0;
        this.currentTurn = 0;
        this.currentMoney = 0;
        //end
        this.resultStatus = 0;
        this.challengeReward = 0;
        this.ingameBalance = 0;
    },

    properties: {
        logo : cc.Node,
        level : cc.Node,
        nodeMoney : cc.Node,
        content : cc.Node,
        lbTurn : cc.Label,
        lbMoney : cc.Label,
        progress : cc.Sprite,
    },

    onLoad() {
        if(this.logo)
            this.logo.x -= (cc.winSize.width-1344)/2;
    },

    Init(slotView) {
        this.slotView = slotView;
        if(Global.isChallenge != 0) {
            this.level.active = false;
            this.content.active = true;
            if(this.nodeMoney != null)
                this.nodeMoney.active = false;
        }
    },

    ClickEndChallenge() {
        if(Global.isChallenge != 0) {
            Global.UIManager.showConfirmPopup (Global.MyLocalization.GetText("END_CHALLENGE"), ()=>{
                let data = {};
                data[1] = Global.isChallenge;
                data[40] = this.slotView.slotType;
                require("SendRequest").getIns().MST_Client_Challenge_End(data);
            });
        }
        
    },
    
    SetupTarget(totalTurn, totalMoney) {
        this.totalTurn = totalTurn;
        this.totalMoney = totalMoney;
        this.UpdateProgress();
    },

    UpdateProgress() {
        this.lbTurn.string = (this.totalTurn - this.currentTurn).toString();
        this.lbMoney.string = Global.Helper.formatNumber(this.currentMoney);
        this.progress.fillRange = this.currentMoney/this.totalMoney;
    },

    UpdateInfo(currentTurn, currentMoney) {
        if(currentTurn >= 0)
            this.currentTurn = currentTurn;
        if(currentMoney >= 0)
            this.currentMoney = currentMoney;
    },

    SetEndChallenge(resultStatus, challengeReward, ingameBalance) {
        this.resultStatus = resultStatus;
        this.challengeReward = challengeReward;
        this.ingameBalance = ingameBalance;
    },

    CheckEndChallenge() {
        if(this.resultStatus != 0) {
            Global.UIManager.showEndChallengePopup(this.resultStatus, this.challengeReward, this.ingameBalance);
        }
    },
});
