var TIME_GET_BIGWIN = 15;
var TIME_GET_SPIN = 15;
var TIME_GET_LOGIN = 200;
var TIME_RANDOM_LOGIN = 3;



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

		this.listDataBigWinLive = [];

		this.listButtonLive = [];
		this.dataChannelInfo = [];

		this.listCachePlayer = {};
		this.firstLogin = false;
    },

	properties: {
		loginPanel: cc.Node,
		pathTxt : cc.TextAsset,
		//
		markBg : cc.Node,

		lbTimeSale : cc.Label,
		showStartGame : require("ShowStartGame"),
		
	},

	start() {
		Global.LobbyView = this;	
		this.markBg.width = cc.winSize.width;

		if (Global.isLogin) {
			this.Connect();	
			this.loginPanel.active = false;
		} else {
			this.loginPanel.active = true;
		}

		this.countLoad = 0;
		
	},

	CheckLoadSuccess() {
		cc.log("check load success:"+this.countLoad);
		Global.UIManager.hideLoading();
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
			//Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"api/config/GetRoomMultiSlot", data, this.GetRoomMultiSlot);
			Global.NetworkManager.init("");
			Global.NetworkManager.connect_sv();
		} else {
			this.CheckLoadSuccess();
		}
	},

    GetRoomMultiSlot(response){
		let dataJson = JSON.parse(response);
		if (dataJson.c != 0) {
			Global.SlotRoomMuitlConfig = [];
		} else {
			Global.SlotRoomMuitlConfig = dataJson.d;
			//cc.log("--------GetRoomMultiSlot "+response);
			// Global.NetworkManager.init("");
			// Global.NetworkManager.connect_sv();
		}
	},
	
	ClickJoinFishRoom_New(event, index) {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		
		if(index == 3) {
			CONFIG.MULTI_PLAYER = true;
		} else {
			CONFIG.MULTI_PLAYER = false;
		}
		

		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
	},

	

	ClickCommingSoon() {
		if (!Global.isConnect) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
	
		Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("COMMING_SOON"));
	},

	

	playSlot(event, index) {
		
		cc.log(Global.isLogin);
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		// Global.SendTrackerLogView("Play Slot "+index);
		require("ScreenManager").getIns().roomType = index;
		require("ScreenManager").getIns().SetBetMoneyType(0);
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
	},

	Handle_JoinSlot(gameSlotID)
	{
		cc.log(Global.isLogin);
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
		
		require("ScreenManager").getIns().roomType = gameSlotID;
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
	

	CheckShowMiniGame() {
		if(!Global.isConnect)
			return;
		require("WalletController").getIns().init();
        require("WalletController").getIns().AddListener(Global.LobbyView);
		require("SyncTimeControl").getIns().SendPing();
	
		this.showStartGame.Action();
		let msgData = {};
		msgData[1] = Global.GameId;
		require("SendRequest").getIns().MST_Client_Slot_Get_Game_Config_Info(msgData);
	},


	onDestroy() {
		Global.LobbyView = null;
		require("WalletController").getIns().RemoveListener();
	},

	UpdateTime() {
	},

	ClickChangeBetMoneyType(){
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY_MONEY);
		
	},
			
	
});

