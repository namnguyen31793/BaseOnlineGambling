cc.Class({
    extends: cc.Component,

    properties: {
        txtGold: cc.Label,
		txtDiamon: cc.Label,
		txtId: cc.Label,
		txtVip: cc.Label,
		txtName: cc.Label,
		iconVip : cc.Sprite,
		imgAva: cc.Sprite,
    },

    start() {
        this.UpdateInfoView();
		require("WalletController").getIns().init();
		require("WalletController").getIns().AddListener(Global.LobbyFish);
		require("SendRequest").getIns().MST_Client_Account_Bag_Get_Sell_Config ();
        require("SendRequest").getIns().MST_Client_Account_Bag_Get_Account_Info ();
    },

	OnUpdateMoney(money) {
		this.txtGold.string = Global.Helper.formatNumber(Global.MainPlayerInfo.ingameBalance);
	},

    UpdateInfoView() {
		this.txtName.string = Global.MainPlayerInfo.nickName;
		this.txtGold.string = Global.Helper.formatNumber(Global.MainPlayerInfo.ingameBalance);
		// this.txtVip.string = "VIP " + Global.MainPlayerInfo.vipLevel;
		// this.txtId.string = Global.MainPlayerInfo.accountId;
		Global.Helper.GetAvata(this.imgAva);
		Global.Helper.GetVipIcon(Global.MainPlayerInfo.vipLevel, this.iconVip);
		
	},

    ClickJoinFishRoom(event, index) {
		if (!Global.isConnect) {
			Global.LoginView.OnclickShowLoginView();
			return;
		}
		Global.AudioManager.ClickButton();
		for (var i = 0; i < Global.GameConfig.ListRoomConfig.length; i++) {
			if (Global.GameConfig.ListRoomConfig[i].RoomId == index) {
				if (Global.MainPlayerInfo.ingameBalance < Global.GameConfig.ListRoomConfig[i].MinMoney) {
					Global.UIManager.showCommandPopup(Global.Helper.formatString(Global.MyLocalization.GetText("MIN_MONEY_JOIN_ROOM"), [Global.Helper.formatNumber(Global.GameConfig.ListRoomConfig[i].MinMoney)]), null);
				}
			}
		}
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
	},

	OnBack() {
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
	},

	ClickJoinFishRoom2D(event, index) {
		if (!Global.isConnect) {
			Global.LoginView.OnclickShowLoginView();
			return;
		}
		Global.AudioManager.ClickButton();
		for (var i = 0; i < Global.GameConfig.ListRoomConfig.length; i++) {
			if (Global.GameConfig.ListRoomConfig[i].RoomId == index) {
				if (Global.MainPlayerInfo.ingameBalance < Global.GameConfig.ListRoomConfig[i].MinMoney) {
					Global.UIManager.showCommandPopup(Global.Helper.formatString(Global.MyLocalization.GetText("MIN_MONEY_JOIN_ROOM"), [Global.Helper.formatNumber(Global.GameConfig.ListRoomConfig[i].MinMoney)]), null);
				}
			}
		}
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
	},

	

	onDestroy() {
		Global.LobbyFish = null;
	},

	onLoad() {
		Global.LobbyFish = this;
	},
    
});
