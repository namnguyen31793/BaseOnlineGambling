var DailyGameManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new DailyGameManager();
            return this.self;
        }
    },

    ctor() {
        this.openGame = false;
        this.dailyGame = null;
        this.listReward = [];
        this.typeGame = 1;
        this.configFree = null;
        this.cachePacket = null;
        /* public class RewardSpin_Model{
            public int AccountId { get; set; }
            public int GameID { get; set; }
            public int RoomID { get; set; }
            public string Message { get; set; }
            public int Amount { get; set; }}   
        */
    },

    DailyGameHandleResponse(operationResponse) {
        var data = operationResponse;

        let defineRe = Global.Enum.RESPONSE_CODE.CTP_TAG;
        let packet = data.vals;
        var responseCode = packet[defineRe];
        if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_SHOW_EVENT_GAME){
            this.cachePacket = packet;
            // this.ShowDailyGame(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_PLAY_DAILY_GAME){
            this.HandlePlayCoTyPhu(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_GET_DAILY_REWARD_LIST){
            this.GetRewardList(packet);
        } else if (responseCode == Global.Enum.RESPONSE_CODE.MST_SERVER_DAILYGAME_SLOT_BASIC_PLAY){
            this.HandlePlayDaoVang(packet);
        }
    },

    CheckCacheShowDailyGame() {
        cc.log("check show daily game");
        if(this.cachePacket == null) {
            Global.LobbyView.showStartGame.Action();
        }
        if(Global.LoginGiftPopup == null || Global.LoginGiftPopup.node.active == false) {
            if(this.cachePacket != null) {
                this.ShowDailyGame(this.cachePacket);
                this.cachePacket = null;
            }
        }
    },

    ShowDailyGame(packet) {
        this.typeGame = packet[1];
        this.typeGame = 2;
        let dailyManager = this;
        if(this.typeGame == 1) {
            Global.DownloadManager.LoadPrefab("DailyGame","CoTyPhu", (prefab)=>{
                dailyManager.openGame = true;
                let cotyphu = cc.instantiate(prefabs);
				Global.UIManager.parentMiniGame.addChild(cotyphu);
                dailyManager.dailyGame = cotyphu.getComponent("DailyGameView");
                dailyManager.dailyGame.Init(this.typeGame);
			})
        } else if(this.typeGame == 2) {
            Global.DownloadManager.LoadPrefab("DailyGame","DaoVang", (prefab)=>{
                dailyManager.openGame = true;
                let daovang = cc.instantiate(prefab);
				Global.UIManager.parentMiniGame.addChild(daovang);
                dailyManager.dailyGame = daovang.getComponent("DailyGameView");
                dailyManager.dailyGame.Init(this.typeGame);
			})
        }
    },

    InitInfoFreeGame(configFree) {
        this.configFree = configFree;
    },

    GetRewardList(packet) {
        let listData = packet[1];
        this.listReward = [];
        for(let i = 0; i < listData.length; i++) {
            this.listReward.push(JSON.parse(listData[i]));
        }
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            this.CheckShowDailyGame();
        }
        
    },

    HandlePlayCoTyPhu(packet) {
        let winMoney = packet[1];
        let accountBalance = packet[2];
        let description = packet[3];
        let idCell = packet[4];
        this.dailyGame.GetReult(winMoney, accountBalance, description, idCell);
    },

    HandlePlayDaoVang(packet) {
        let winMoney = packet[1];
        let accountBalance = packet[2];
        let data = packet[3];
        this.dailyGame.SetData(winMoney, accountBalance, data);
    },

    CheckShowDailyGame() {
        if(this.typeGame == 1) {
            if(this.openGame && this.listReward.length > 0) {
                this.dailyGame.ShowWithRewad(this.listReward);
            }
        } else if(this.typeGame == 2) {
            if(this.openGame)
                this.dailyGame.ShowNoReward();
        }
        
            
    },

});
module.exports = DailyGameManager;