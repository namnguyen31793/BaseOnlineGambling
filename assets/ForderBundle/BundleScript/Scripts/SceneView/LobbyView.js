var TIME_GET_BIGWIN = 15;
var TIME_GET_SPIN = 15;
var TIME_GET_LOGIN = 200;
var TIME_RANDOM_LOGIN = 3;

const DailyGameManager = require("../DailyGame/DailyGameManager");

cc.Class({
	extends: cc.Component,
	ctor(){
		this.txtJackpotRoom1 = null;
		this.txtJackpotRoom2 = null;
		this.countTime = 0;
		this.bonusTime = 0;
		this.notifyUI = null;

		this.infoLoginCollecsion = null;

		this.countLoad = 0;
		this.viewLive = false;

		this.currentLiveToken = '';
		this.currentLiveChannel = '';
		this.currentIDChannel = 0;
		this.currentTypeChannel = 0;
		this.countAnimBigWinLive = 0;
		this.listDataBigWinLive = [];

		this.listButtonLive = [];
		this.dataChannelInfo = [];

		this.listCachePlayer = {};
		this.firstLogin = false;
    },

	properties: {
		txtGold: cc.Label,
		txtDiamon: cc.Label,
		txtVip: cc.Label,
		txtName: cc.Label,
		boxNotify: cc.Node,
		imgAva: cc.Sprite,
		mailObj : cc.Node,
		toggleMusic : cc.Toggle,
		loginPanel: cc.Node,
		header: cc.Node,
		pathTxt : cc.TextAsset,
		//
		markBg : cc.Node,
		nodeScroll : cc.Node,
		imgNotifyContent : cc.Node,
		markNotify : cc.Node,
		startPosNotify : cc.Node,

		animBtnMenu : cc.Animation,

		markLockFunc : cc.Node,
		lbTimeSale : cc.Label,
		showStartGame : require("ShowStartGame"),
		settingLobby : require("SettingLobby"),
	},

	start() {
		Global.LobbyView = this;
		let musicValue = Global.AudioManager.GetValueMusic();
		let soundValue = Global.AudioManager.GetValueSound();
		if(musicValue == 1) {
            this.toggleMusic.isChecked = false;
        } else {
            this.toggleMusic.isChecked = true;
		}
		Global.AudioManager.PlayMusicLobby();
		this.markBg.width = cc.winSize.width;

		if (Global.isLogin) {
			this.Connect();
			this.header.active = true;
			this.loginPanel.active = false;
		} else {
			this.header.active = false;
			this.loginPanel.active = true;
		}

		this.countLoad = 0;
		this.settingLobby.Init();
	},

	CheckLoadSuccess() {
		cc.log("check load success:"+this.countLoad);
		Global.UIManager.hideLoading();
	},

	CheckOneSignal() {
	},


	Init() {
		if(this.isInit)
        {
            return;
        }
        this.isInit = true;
		this.CheckShowMiniGame();
	},

	Connect() {
		this.Init();
		if (Global.isConnect == false) {
			var data = {
			}
			Global.BaseNetwork.request(Global.ConfigLogin.GameConfigUrl, data, this.GetConfig);
			Global.BaseNetwork.request(Global.ConfigLogin.GetRoomMulti, data, this.GetRoomMultiSlot);
		} else {
			Global.showLuckyBonus = true;
			this.CheckLoadSuccess();
			this.UpdateInfoView();
		}
		
	},

	GetConfig(response) {
		let dataJson = JSON.parse(response);
		if (dataJson.c != 0) {
			this.CheckLoadSuccess();
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText(dataJson.m), this.Connect);
		} else {
			Global.GameConfig = dataJson.d;
			Global.NetworkManager.init("");
			Global.NetworkManager.connect_sv();

			
		}
	},

	OnUpdateMoney(money) {
		if(money < 1000000000) {
			this.txtGold.string = Global.Helper.formatNumber(money);
		} else {
			this.txtGold.string = Global.Helper.formatNumberLong(money);
		}
	},

	UpdateInfoView() {
		this.txtName.string = Global.MainPlayerInfo.nickName;
		if(Global.MainPlayerInfo.ingameBalance < 1000000000) {
			this.txtGold.string = Global.Helper.formatNumber(Global.MainPlayerInfo.ingameBalance);
		} else {
			this.txtGold.string = Global.Helper.formatNumberLong(Global.MainPlayerInfo.ingameBalance);
		}
		
		this.txtVip.string = "VIP " + Global.MainPlayerInfo.vipLevel;
		Global.Helper.GetAvata(this.imgAva);
	},

	ClickJoinFishRoom_New(event, index) {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();

		if(index == 3) {
			CONFIG.MULTI_PLAYER = true;
		} else {
			CONFIG.MULTI_PLAYER = false;
		}
		cc.log(Global.LevelManager.currentLevel)

		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
	},

	ClickBtnSetting() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showSettingPopup();

	},


    ClickChangeStatusMusic(event, data) {
        if(this.toggleMusic.isChecked) {
            Global.AudioManager.ChangeValueMusic(0);
        } else {
            Global.AudioManager.ChangeValueMusic(1);
        }
    },

	ClickCommingSoon() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("COMMING_SOON"));
	},

	ClickTeam() {
		Global.AudioManager.ClickButton();
		cc.sys.openURL("https://t.me/team3bamboo");
	},

	ClickShare() {
		console.log("invite friend");
		sdkbox.PluginFacebook.inviteFriends(
			"https://fb.me/1127490447739796",
			"http://www.cocos2d-x.org/attachments/801/cocos2dx_portrait.png");
	},

	playSlot(event, index) {
		Global.AudioManager.ClickButton();
		cc.log(Global.isLogin);
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		cc.log(Global.GameConfig.FeatureConfig);
		if (!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SlotGame))
			return;
		// Global.SendTrackerLogView("Play Slot "+index);
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().SetBetMoneyType(0);
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
	},

	playSlotRealMoney(event, index) {
		Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}

	},
	ClickBtnShopCashOut() {
		Global.AudioManager.ClickButton();

	},

	CLickShowListButton(){
        this.animBtnMenu.play("ShowMenuLobby");
    },

    CLickHideListButton(){
        this.animBtnMenu.play("HideMenuLobby");
    },


	CheckShowMiniGame() {
		if(!Global.isConnect)
			return;
		require("WalletController").getIns().init();
        require("WalletController").getIns().AddListener(Global.LobbyView);
		// require("SendRequest").getIns().MST_Client_Get_Daily_Spin_Info();
		require("SyncTimeControl").getIns().SendPing();

		let data = {};
		data[1] = Global.Enum.MISSION_TYPE.DAILY;
		require("SendRequest").getIns().MST_Client_Event_Mission_Get_Mission_Config(data);
		
		this.showStartGame.Action();

	},

	CheckNewUser(listMission, listSuccess) {
		
	},
	
	UpdateNotify(content, speed) {
		if (Global.GameConfig.FeatureConfig.NotifyLobbyFeautre != Global.Enum.EFeatureStatus.Open)
			return;
		// this.notifyUI.UpdateListNotify (content, speed);
	},

	ShowNotifyCash(content, speed, repeat) {
		// this.notifyUI.AddNotify (content, speed, repeat);
	},


	OnUpdateDiamonView() {
		let listItemData = require("BagController").getIns().listDataItem;
        for(let i = 0; i < listItemData.length; i++) {
            if(listItemData[i].ItemId == 4) {
				this.txtDiamon.string = Global.Helper.formatNumber(listItemData[i].Amount.toString());
            }
        }
	},

	onDestroy() {
		Global.LobbyView = null;
		require("WalletController").getIns().RemoveListener();
	},


	UpdateTime() {
	},

	TestShowHome(){
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.HOME_VIEW);
	},

	GetLoginCollecsion(response){

	},


	GetRoomMultiSlot(response){
		let dataJson = JSON.parse(response);
		if (dataJson.c != 0) {
			Global.SlotRoomMuitlConfig = [];
		} else {
			Global.SlotRoomMuitlConfig = dataJson.d;
		}
	},

	ClickShowDemoCity(){
		Global.UIManager.ShowDemoCity();
	},

	ClickChangeBetMoneyType(){
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY_MONEY);
		// require("ScreenManager").getIns().ChangeBetMoneyType();
		// this.playSlot(null, 20);
	},
			
	ClickShowBag() {

	},

	CreateButtonTutorial() {

	},
});

