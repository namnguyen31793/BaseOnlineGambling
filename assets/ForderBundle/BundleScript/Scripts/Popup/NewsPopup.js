cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    show(){
		Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.node.getComponent(cc.Animation).play("ShowPopup");
       
	},

    Hide() {
		Global.LobbyView.showStartGame.Action();
		this.node.active = false;
		Global.UIManager.hideMark();
	},

	OnClick() {
		if(CONFIG.MERCHANT == "2") {
			cc.sys.openURL("https://t.me/bancacity/60");
		} else if(CONFIG.MERCHANT == "3") {
			cc.sys.openURL("https://t.me/sieucanet/12");
		} else {
			cc.sys.openURL(Global.ConfigLogin.FanpageUrl);
		}
	},

	PlayFish() {
		require("ScreenManager").getIns().roomType = 20;
		require("ScreenManager").getIns().SetBetMoneyType(0);
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
		// cc.sys.openURL("https://www.facebook.com/bancacity2023/posts/pfbid0ttnud5fCdrXJDDHgeNbLpSeHKc2RXmdCRe5cCZ7zoDht5YdKUiHKzshhkvJMXtbtl");
		this.node.active = false;
		Global.UIManager.hideMark();
		// this.Hide();
		// let r = Global.RandomNumber(1,3);
		// if(r != 1 && r != 2)
		// 	r = 1;
		// require("ScreenManager").getIns().roomType = r;
		// require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
	},
	
	onDestroy(){
		Global.NewsPopup = null;
	},
});
