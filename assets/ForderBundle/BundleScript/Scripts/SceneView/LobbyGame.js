var TIME_GET_BIGWIN = 15;
var TIME_GET_SPIN = 5;
var TIME_GET_LOGIN = 200;

cc.Class({
	extends: cc.Component,
	ctor(){
		this.txtJackpotRoom1 = null;
		this.txtJackpotRoom2 = null;
		this.countTime = 0;
		this.bonusTime = 0;
		this.notifyUI = null;

		this.countTimeGetBigWin = 0;
		this.countTimeTotalSpinGame = 0;
		this.countTimeGetLogin = 0;
		this.countTimeRandomLogin = 0;
		this.infoLoginCollecsion = null;

		this.countLoad = 0;
		this.viewLive = false;

		this.currentLiveToken = '';
		this.currentLiveChannel = '';
		this.currentIDChannel = 0;
		this.currentTypeChannel = 0;
		this.countAnimBigWinLive = 0;

		this.listButtonLive = [];
		this.dataChannelInfo = [];
		this.countTimeChat = 0;

		this.listCachePlayer = {};
		this.firstLogin = false;
		this.countCheckMail = 0;
    },

	properties: {
		txtGold: cc.Label,
		txtDiamon: cc.Label,
		txtName: cc.Label,
		txtVip : cc.Label,
		iconVip : cc.Sprite,
		imgAva: cc.Sprite,
		mailObj : cc.Node,
		toggleMusic : cc.Toggle,
		loginPanel: cc.Node,
		header: cc.Node,
		pathTxt : cc.TextAsset,
		//

		listEffItemOutGame : {
			default : [],
			type : require("EffectItemOutGame")
		}, 

		listEffItemPlinko : {
			default : [],
			type : require("EffectItemOutGame")
		},

		btnOnline : require("BtnOnline"),
		showStartGame : require("ShowStartGame"),
		settingLobby : require("SettingLobby"),
		showBigWin : require("ShowBigWinLobby"),
		notifyManager : require("NotifyLobbyView"),
		lbJackpot : [require("LbMonneyChange")],
		popupChoiceFish : cc.Animation,
		bannerContent : cc.Node,
	},

	start() {
		console.log("start lobby");
		CONFIG.TYPE_FISH_MINI_JACKPOT = 105;
		CONFIG.TYPE_FISH_MINOR_JACKPOT = 106;
		CONFIG.TYPE_FISH_MAJOR_JACKPOT = 107;
		CONFIG.TYPE_FISH_GRAND_JACKPOT = 108;
		CONFIG.TYPE_FISH_EVENT_SMALL_USER = 113;
		CONFIG.TYPE_FISH_EVENT_BIG_USER = 114;
		CONFIG.TYPE_FISH_FROG_1M = 115;
		CONFIG.TYPE_FISH_MONSTER_WINTER = 116;
		Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_BLACK_DRAGON = 117;
		Global.Enum.FISH_BOSS_TYPE.TYPE_FISH_GOD_OF_WEALTH = 122;
		Global.LobbyView = this;

		this.LoadMussicBackgroud();
		

		//get list bigWin
		this.SendGetListBigWin();
		//get list login online
		this.SendGetLoginCollecsion();
		//get total spin tung game
		this.SendGetTotalSpin();

		if (Global.isLogin) {
			this.Connect();
			this.header.active = true;
			this.loginPanel.active = false;
		} else {
			this.header.active = false;
			this.loginPanel.active = true;
		}

		this.countLoad = 0;
		// let funNext = () => {
		// 	cc.log("fun next");
		// 	this.CheckLoadSuccess();
		// }
		// Global.UIManager.showLoading();
		// if (Global.UIManager) {
		// 	Global.UIManager.preLoadPopupInRes(funNext);
		// } else {
		// 	funNext();
		// }
		this.settingLobby.Init();

		Global.DownloadManager.LoadPrefab("Banner2","banner", (prefab)=>{
            let notify = cc.instantiate(prefab);
            notify.parent = Global.LobbyView.bannerContent;
            
        });
	},

	OnCheckMail() {
		this.countCheckMail += 1;
		if(this.countCheckMail == 2) {
			Global.UIManager.showConfirmPopup(Global.MyLocalization.GetText("NEW_MAIL_OPEN"),()=>{
                Global.UIManager.showMailPopup();
            },null);
		}
	},

	CheckLoadSuccess() {
		cc.log("check load success:"+this.countLoad);
		this.countLoad += 1;
		if(this.countLoad >= 2) {
			// Global.UIManager.hideLoading();
		}
		Global.UIManager.hideLoading();
		if(Global.BtnMiniGame)
			Global.BtnMiniGame.Init();
	},

	CheckOneSignal() {
		jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hello", "(Ljava/lang/String;)V", "this is a message from js");

		// var result = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "sum", "(II)I", 3, 7);
		let id = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "GetDeviceId", "(Ljava/lang/String;)I", "this is a message from js");
		// console.log(result); //10	
		console.log("GGGG id:"+id);	
		this.scheduleOnce(()=>{
			this.CheckOneSignal();
		} , 2);
	},


	Init() {
		console.log("---------------Init Path Fish: "+this.isInit);
		if(this.isInit)
        {
            return;
        }
		Global.DownloadManager.LoadAssest("Config",cc.TextAsset, "PathFish", (pre)=>{
			console.log("---------------load config fish-----------------");
			Global.LobbyView.pathTxt = pre;
			require("PathStore").getIns().setInfoData(pre.text);
			require("PathStore").getIns().setInfoConfigFish(pre.text);
		});
        this.isInit = true;
		this.CheckShowMiniGame();
	},

	Connect() {
		this.Init();
		cc.log("check show free bonus:"+this.firstLogin);
		if (Global.isConnect == false) {
			var data = {
			}
			cc.log("-------------first login-------------");
			this.firstLogin = true;
			cc.log(Global.ConfigLogin);
			Global.BaseNetwork.request(Global.ConfigLogin.GameConfigUrl, data, this.GetConfig);
			Global.BaseNetwork.request(Global.ConfigLogin.GetRoomMulti, data, this.GetRoomMultiSlot);
			this.RequestGetFishConfig();
		} else {
			Global.showLuckyBonus = true;
			this.CheckLoadSuccess();
			this.UpdateInfoView();
			this.RequestGetVipConfig();
			this.OnCheckMail();
			if(Global.LevelManager)
                Global.LevelManager.GetLevelInfo();
			if(!this.firstLogin)
			 	require("SendRequest").getIns().MST_Client_FreeReward_Show_Banner();
		}
	},
	LoadMussicBackgroud()
	{
		Global.AudioManager.PlayMusicLobby2();
	},
	RequestGetFishConfig() {
		Global.BaseNetwork.requestGet(CONFIG.BASE_API_LINK+"v1/Services-config/GetConfigFishTxt", {}, this.GetFishConfig);
	},

	GetFishConfig(response) {
		cc.log(response);
		let dataJson = JSON.parse(response);
		Global.FishConfig = JSON.parse(dataJson);
		cc.log(Global.FishConfig);
	},

	GetConfig(response) {
		let dataJson = JSON.parse(response);
		if (dataJson.c != 0) {
			this.CheckLoadSuccess();
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText(dataJson.m), this.Connect);
		} else {
			Global.GameConfig = dataJson.d;
			cc.log(Global.GameConfig);
			Global.NetworkManager.init("");
			Global.NetworkManager.connect_sv();
		}
	},

	OnUpdateMoney(money) {
		cc.log("on update money:"+money);
		if(money < 1000000000) {
			this.txtGold.string = Global.Helper.formatNumber(money);
		} else {
			this.txtGold.string = Global.Helper.formatNumberLong(money);
		}
	},
	

	UpdateInfoView() {
		cc.log(Global.MainPlayerInfo);
		this.txtName.string = Global.MainPlayerInfo.nickName;
		if(Global.MainPlayerInfo.ingameBalance < 1000000000) {
			this.txtGold.string = Global.Helper.formatNumber(Global.MainPlayerInfo.ingameBalance);
		} else {
			this.txtGold.string = Global.Helper.formatNumberLong(Global.MainPlayerInfo.ingameBalance);
		}
		
		Global.Helper.GetAvata(this.imgAva);
	},

	ClickJoinFishRoom(event, index) {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		// for (var i = 0; i < Global.GameConfig.ListRoomConfig.length; i++) {
		// 	if (Global.GameConfig.ListRoomConfig[i].RoomId == index) {
		// 		if (Global.MainPlayerInfo.ingameBalance < Global.GameConfig.ListRoomConfig[i].MinMoney) {
		// 			Global.UIManager.showCommandPopup(Global.Helper.formatString(Global.MyLocalization.GetText("MIN_MONEY_JOIN_ROOM"), [Global.Helper.formatNumber(Global.GameConfig.ListRoomConfig[i].MinMoney)]), null);
		// 		}
		// 	}
		// }
		if(index == 3) {
			CONFIG.MULTI_PLAYER = true;
		} else {
			CONFIG.MULTI_PLAYER = false;
		}
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
	},

	ClickJoinFishRoom2D(event, index) {
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
		// for (var i = 0; i < Global.GameConfig.ListRoomConfig.length; i++) {
		// 	if (Global.GameConfig.ListRoomConfig[i].RoomId == index) {
		// 		if (Global.MainPlayerInfo.ingameBalance < Global.GameConfig.ListRoomConfig[i].MinMoney) {
		// 			Global.UIManager.showCommandPopup(Global.Helper.formatString(Global.MyLocalization.GetText("MIN_MONEY_JOIN_ROOM"), [Global.Helper.formatNumber(Global.GameConfig.ListRoomConfig[i].MinMoney)]), null);
		// 		}
		// 	}
		// }
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
	},

	ClickShowGiftPopup() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showWeeklyRewardPopup(Global.Enum.STATUS_GIFT_POPUP.ATTENDANCE);
	},

	ClickBtnAchievementPopup() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showAchievementPopup();
	},

	ClickShowQuestPopup() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showQuestPopup();
		
		
	},

	ClickShowVipInfoPopup() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showVipInfoPopup();
	},

	ClickBtnNews() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showEventPopup(Global.Enum.STATE_EVENT.NEWS);
	},

	ClickBtnEvent() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showEventPopup(Global.Enum.STATE_EVENT.EVENT);
	},

	ClickBtnSupport() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.ShowSupportPopup();
	},

	ClickBtnSpin() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		if(!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SpinFeature))
			return;
		if (Global.listResult == null)
			return;
		Global.UIManager.showLuckySpinPopup (Global.listResult, Global.currentSpin);
	},

	ClickBtnSetting() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showSettingPopup();

		
	},

	ClickBtnGiftCode() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showGiftCodePopup();
	},

	ClickBtnMail() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showMailPopup();
	},

	ClickBtnRank() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showRankPopup();
	},

	ClickBtnHistory() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showHistoryPopup();
	},

	ClickBtnProfilePopup() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showProfilePopup();
	},

	ClickBtnCollection() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showCollectionPopup();
	},

    ClickChangeStatusMusic(event, data) {
        if(this.toggleMusic.isChecked) {
            Global.AudioManager.ChangeValueMusic(0);
        } else {
            Global.AudioManager.ChangeValueMusic(1);
        }
    },

	ClickButtonMiniPoker() {
		Global.UIManager.showMiniPoker();
	},

	ClickButtonMiniSlot() {
		Global.UIManager.showMiniSlot();
	},

	ClickButtonMiner() {
		Global.UIManager.showMiniMiner();
	},

	ClickButtonLongPhung() {

	},

	ClickCommingSoon() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("COMMING_SOON"));
	},

	ClickTest2() {
		cc.log("11111111111111111111");
		console.log("send MST_Client_Event_Get_ReferenceInfo");
		require("SendRequest").getIns().MST_Client_Event_Get_ReferenceInfo();

    },

	ClickPigBank() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.AudioManager.ClickButton();
		require("SendRequest").getIns().MST_Client_Event_PingBank_Get_Current_PigBank_Info();
	},

	UpdateMailStatus() {
		let numberMailNotRead = 0;
		for(let i = 0; i < Global.MainPlayerInfo.listMail.length; i++) {
			if(Global.MainPlayerInfo.listMail[i].IsReaded == 0) {
				numberMailNotRead += 1;
			}
		}
		if(numberMailNotRead > 0) {
			this.mailObj.active = true;
			// this.mailObj.getComponentInChildren(cc.Label).string = numberMailNotRead.toString();
		} else {
			this.mailObj.active = false;
		}
	},

	playSlot(event, index) {
		Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		if (!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SlotGame))
			return;
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().SetBetMoneyType(0);
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
	},

	ClickBtnShopCashIn() {
		Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		// if(Global.GameConfig.FeatureConfig.CashinLobbyFeature != Global.Enum.EFeatureStatus.Open) {
		// 	return;
		// }
		Global.UIManager.showShopPopup();
		Global.AudioManager.ClickButton();

	},

	ClickBtnGiftCode() {
		Global.UIManager.showShopPopup(false);
		Global.AudioManager.ClickButton();
	},

	ClickBtnShopCashOut() {
		Global.AudioManager.ClickButton();

	},

	ClickCity() {
		Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.CITY);
	},

	ClickBtnGrateful() {
		Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.ShowGratefulPopup();
	},

	CheckShowMiniGame() {
		if(!Global.isConnect)
			return;
		this.RequestGetVipConfig();
		require("WalletController").getIns().init();
        require("WalletController").getIns().AddListener(Global.LobbyView);
		// require("SendRequest").getIns().MST_Client_Get_Daily_Spin_Info();
		require("SyncTimeControl").getIns().SendPing();
	
		
	},

	SetTimeRegister(timeRegister) {
	},

	CheckTimeRegister() {
		this.showStartGame.Action();
	},

	UpdateTime() {
		cc.log();
		this.showStartGame.Action();
	},

	UpdateNotify(content, speed) {
		if (Global.GameConfig.FeatureConfig.NotifyLobbyFeautre != Global.Enum.EFeatureStatus.Open)
			return;
		// this.notifyUI.UpdateListNotify (content, speed);
	},

	ShowNotifyCash(content, speed, repeat) {
		// this.notifyUI.AddNotify (content, speed, repeat);
	},

	ShowPopupChoiceFish() {
		Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		this.popupChoiceFish.node.active = true;
		this.popupChoiceFish.play("ShowPopup");
	},

	HidePopupChoiceFish() {
		Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		this.popupChoiceFish.play("HidePopup");
		this.scheduleOnce(()=>{
            this.popupChoiceFish.node.active = false;
        } , 0.2);
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
		if(this.processShowShare != null)
            this.unschedule(this.processShowShare);
		Global.LobbyView = null;
		require("WalletController").getIns().RemoveListener();
	},

	update(dt) {
		this.countTimeGetBigWin += dt;
		this.countTimeTotalSpinGame += dt;
		this.countTimeGetLogin += dt;
		this.countTimeRandomLogin += dt;
		this.countTimeChat += dt;
		if(this.countTimeGetBigWin > TIME_GET_BIGWIN){
			this.SendGetListBigWin();
		}
		if(this.countTimeTotalSpinGame > TIME_GET_SPIN){
			this.SendGetTotalSpin();
		}
		// if(this.countTimeGetLogin > TIME_GET_LOGIN){
		// 	this.SendGetLoginCollecsion();
		// }
		// if(this.countTimeRandomLogin > TIME_RANDOM_LOGIN){
		// 	this.RandomLoginCollecsion();
		// }
		// if(this.viewLive){
		// 	if(this.countTimeChat > 3){
		// 		this.countTimeChat = 0;// Global.RandomNumber(0,2);
		// 		cc.log(this.countTimeChat);
		// 		//dang trong kenh thi day chay vao
		// 		if(this.currentTypeChannel != 0){
		// 			// let data = {
		// 			// 	Nickname : "Vip123",
		// 			// 	ChatContent : "Chào mừng bạn tham gia trò chơi "+this.countTimeChat,
		// 			// 	Type :	1,	//1 chat, 2 thong bao thoat va vao phong, 3 thong bao donate
		// 			// 	Gold: 0
		// 			// }
		// 			this.LiveChatView.addChat(data);
		// 		}
		// 	}
		// }
	},

	TestShowHome(){
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.HOME_VIEW);
	},

	GetBigWin(response){
		let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode != Global.Enum.SCREEN_CODE.LOBBY && lastScreenCode != Global.Enum.SCREEN_CODE.LOGIN)
				return;
        }
		let dataJson = JSON.parse(response);
		let data = dataJson.d;
		if(Global.LobbyView == null)
			return;
		Global.listDataBigWinLive = [];
		for(let i = 0; i < data.length; i++){
			let model = JSON.parse(data[i]);
			if(model.length > 0){
				let gametype = model[0].GameType;
				Global.LobbyView.SetupEffectItemOutGame(gametype, model);
				for(let i =0; i < model.length; i++){
					Global.listDataBigWinLive.push(model[i]);
				}
			}
		}
		if(Global.listDataBigWinLive.length > 0) {
			Global.LobbyView.showBigWin.Init();
			Global.LobbyView.notifyManager.Init();
		}
		
	},

	SetupEffectItemOutGame(gametype, data){
		for(let i = 0; i < Global.LobbyView.listEffItemOutGame.length; i++){
			if(Global.LobbyView.listEffItemOutGame[i].typeGame == gametype)
				Global.LobbyView.listEffItemOutGame[i].Setup(data, Global.Enum.TYPE_NOTIFY.TAKE_VALUE);
		}
	},

	GetTotalSpinGame(response){
		let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode != Global.Enum.SCREEN_CODE.LOBBY && lastScreenCode != Global.Enum.SCREEN_CODE.LOGIN)
				return;
        }
		let dataJson = JSON.parse(response);
		let data = dataJson.d;
		// for(let i = 0; i < data.length; i++){
		// 	let model = data[i];
		// 	for(let j = 0; j < Global.LobbyView.listEffItemOutGame.length; j++){
		// 		if(Global.LobbyView.listEffItemOutGame[j].typeGame == model.GameType){
		// 			Global.LobbyView.listEffItemOutGame[j].UpdateTotalSpin(model.TotalCounterToDay);
		// 			break;
		// 		}
		// 	}
		// }
	},
	
	GetJackpotValue(response) {
		let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode != Global.Enum.SCREEN_CODE.LOBBY && lastScreenCode != Global.Enum.SCREEN_CODE.LOGIN)
				return;
        }
		let dataJson = JSON.parse(response);
		let data = dataJson.d;
		
		for(let i = 0; i < data.length; i++){
			let model = data[i];
			if(model.GameType == Global.Enum.GAME_TYPE.SNOW_FALL) {
				Global.LobbyView.lbJackpot[0].setMoney(model.JackpotValue);
			}
			if(model.GameType == Global.Enum.GAME_TYPE.MAYA_GAME) {
				Global.LobbyView.lbJackpot[1].setMoney(model.JackpotValue);
			}
			if(model.GameType == Global.Enum.GAME_TYPE.SLOT_9_POTS) {
				Global.LobbyView.lbJackpot[2].setMoney(model.JackpotValue);
			}
		}
	},

	GetLoginCollecsion(response){
		let dataJson = JSON.parse(response);
		let lastScreenCode = require("ScreenManager").getIns().lastScreen;
        if(lastScreenCode != 0 && lastScreenCode) {
            if(lastScreenCode != Global.Enum.SCREEN_CODE.LOBBY && lastScreenCode != Global.Enum.SCREEN_CODE.LOGIN)
				return;
        }
		if(dataJson.d == null)
			return;
		Global.infoLoginCollecsion = dataJson.d;
		Global.listWin = dataJson.d;
	},

	SendGetListBigWin(){
		var data = {
			version: CONFIG.VERSION,
			os: require("ReceiveResponse").getIns().GetPlatFrom(),
			merchantid: CONFIG.MERCHANT,
		}
		this.countTimeGetBigWin = 0;
		Global.BaseNetwork.request(Global.ConfigLogin.GetBigWinUrl, data, this.GetBigWin);
	},

	SendGetTotalSpin(){
		var data = {
			version: CONFIG.VERSION,
			os: require("ReceiveResponse").getIns().GetPlatFrom(),
			merchantid: CONFIG.MERCHANT,
		}
		this.countTimeTotalSpinGame = 0;
		// Global.BaseNetwork.request(Global.ConfigLogin.GetTotalSpinGame, data, this.GetTotalSpinGame);
		Global.BaseNetwork.requestGet(CONFIG.BASE_API_LINK+"v1/Services-effect/GetJackpotSlotLobby", data, this.GetJackpotValue);
	},

	SendGetLoginCollecsion(){
		var data = {
			version: CONFIG.VERSION,
			os: require("ReceiveResponse").getIns().GetPlatFrom(),
			merchantid: CONFIG.MERCHANT,
		}
		this.countTimeGetLogin = 0;
		Global.BaseNetwork.request(Global.ConfigLogin.GetLoginCollection, data, this.GetLoginCollecsion);
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
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		Global.UIManager.showBag();
	},

	ClickBanner() {
		
	},

	RequestGetVipConfig() {
		require("SendRequest").getIns().MST_Client_Get_Vip_Config_Info();
	},

	
});

