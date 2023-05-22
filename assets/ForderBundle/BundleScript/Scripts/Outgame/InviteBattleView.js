cc.Class({
    extends: cc.Component,
    ctor() {
        this.isInvite = false;
        this.isShowInvite = false;
        this.currentId = 0;
        this.currentBet = 0;
    },

    properties: {
        animInviteBattle : cc.Animation,
        avaUser : cc.Sprite,
        iconGame : cc.Sprite,
        lbBet : cc.Label,
    },

    CreateInvite() {
        this.scheduleOnce(()=>{
            if(this.config == null) {
                require("SendRequest").getIns().MST_Client_Battle_Field_Get_Config();
            } else {
                // let r = Global.RandomNumber(0,this.config.length);
                let r = Global.RandomNumber(0,24);
                Global.Helper.GetIconGame(this.iconGame, this.config[r].GameId);
                this.currentBet = this.config[r].BetValue;
                this.lbBet.string = Global.Helper.formatNumber(this.config[r].BetValue/1000)+"K";
                this.currentId = this.config[r].Id;
                let randomTime = Global.RandomNumber(5,10);
                this.scheduleOnce(()=>{
                    this.ShowInviteBattle();
                } , randomTime);
            }
        } , 0.5);
    },

    GoInviteBattle() {
        if(Global.MainPlayerInfo.ingameBalance < this.currentBet) {
            Global.UIManager.ShowGetMoneyPopup();
            // Global.UIManager.showConfirmPopup (Global.MyLocalization.GetText("NOT_ENOUGHT_BATTLE"), ()=>{
            //     Global.UIManager.showMiniLoading();
            //     Global.UIManager.ShowGetMoneyPopup();
            // });
            return;
        }
        let data = {};
		data[1] = this.currentId;
		require("SendRequest").getIns().MST_Client_Battle_Field_Register(data);
    },

    UpdateConfig(config) {
        this.config = config;
        this.isInvite = false;
    },

    ShowInviteBattle() {
        return;
        this.isInvite = true;
        this.animInviteBattle.play("ShowInviteBattle");
		this.scheduleOnce(()=>{
			this.animInviteBattle.play("CountTimeInvite");
            this.isShowInvite = true;
		} , 0.6);
		this.schedule(this.HideInviteBattle, 10);
    },

    HideInviteBattle() {
		this.animInviteBattle.play("HideInviteBattle");
        this.isShowInvite = false;
        this.scheduleOnce(()=>{
			this.isInvite = false;
		} , 0.5);
		this.unschedule(this.HideInviteBattle);
	},

    update(dt) {
        // if (Global.isConnect == true && this.isInvite == false) {
        //     this.isInvite = true;
        //     this.CreateInvite();
        // }
    },

    onLoad() {
        Global.InviteBattleView = this;
    },

    onDestroy() {
        Global.InviteBattleView = null;
    },
    
});
