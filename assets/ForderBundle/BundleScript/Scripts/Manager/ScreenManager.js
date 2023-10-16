var ScreenManager = cc.Class({
    statics: {
        getIns() {
            if (this.self == null) this.self = new ScreenManager();
            return this.self;
        }
    },

    properties: {
        // foo: {
        currentScreen: 0,
        roomType: 0,
        playType:0, //0-normal, 1-battle

        lastScreen:0,
        lastRoomType:0,
        moneyType:0,     //0-free, 1-money
    },

    LoadScene(screenCode, isCacheScene = true) {
        if(isCacheScene) {
            this.lastScreen = screenCode;
            this.lastRoomType = this.roomType;
        }
        if (screenCode == Global.Enum.SCREEN_CODE.LOGIN) {
            
            if(Global.isConnect) {
                Global.isConnect = false;
                Global.NetworkManager.OnDisconnect();
            }
            this.currentScreen = Global.Enum.SCREEN_CODE.LOGIN;
            // if(CONFIG.IS_MAP) {
            //     cc.director.preloadScene("CityView");
            //     cc.director.loadScene("CityView");
            // } else {
                if(Global.language == "vi") {
                    Global.DownloadManager.LoadScene("Lobby","LobbyScene", (scene)=>{
                        cc.director.runScene(scene);
                    })
                } else {
                    Global.DownloadManager.LoadScene("Lobby","LobbyScene", (scene)=>{
                    //Global.DownloadManager.LoadScene("LobbyEng","LobbyScene", (scene)=>{
                        cc.director.runScene(scene);
                    })
                }
            // }
        }
        else if (screenCode == Global.Enum.SCREEN_CODE.LOBBY) {
            Global.UIManager.showLoading();
            this.currentScreen = Global.Enum.SCREEN_CODE.LOBBY;
            if(Global.language == "vi") {
                Global.DownloadManager.LoadScene("Lobby","LobbyScene", (scene)=>{
                    cc.director.runScene(scene);
                },1)
            } else {
                Global.DownloadManager.LoadScene("Lobby","LobbyScene", (scene)=>{
                //Global.DownloadManager.LoadScene("LobbyEng","LobbyScene", (scene)=>{
                    cc.director.runScene(scene);
                },1)
            }
        }
        else if (screenCode == Global.Enum.SCREEN_CODE.CITY) {
            Global.UIManager.showLoading();
            this.currentScreen = Global.Enum.SCREEN_CODE.CITY;
            cc.director.preloadScene("CityView");
            cc.director.loadScene("CityView");
        }
        else if (screenCode == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
            Global.UIManager.showLoading();
            this.currentScreen = Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS;
            Global.DownloadManager.LoadScene("Fish","InGameFish", (scene)=>{
                let currentScreen = require("ScreenManager").getIns().currentScreen;
                if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                    cc.director.runScene(scene);
                }
            },1)
        } else if (screenCode == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
            console.log("start load ingame slot");
            Global.UIManager.showLoading();
            this.currentScreen = Global.Enum.SCREEN_CODE.INGAME_SLOT;
            //Global.AudioManager.PlayMusicInGameSlot();
            Global.DownloadManager.LoadScene("Slot","InGameSlot", (scene)=>{
                console.log("show ingame slot");
                cc.director.runScene(scene);
            })
        }
        else if (screenCode == Global.Enum.SCREEN_CODE.HOME_VIEW) {
            Global.UIManager.showLoading();
            this.currentScreen = Global.Enum.SCREEN_CODE.HOME_VIEW;
            cc.director.preloadScene("HomeVIew");
            cc.director.loadScene("HomeVIew");
        }
        else if (screenCode == Global.Enum.SCREEN_CODE.LOBBY_FISH) {
            Global.UIManager.showLoading();
            this.currentScreen = Global.Enum.SCREEN_CODE.LOBBY_FISH;
            Global.DownloadManager.LoadScene("Fish","LobbyFish", (scene)=>{
                cc.director.runScene(scene);
            },1)
        }
        else if (screenCode == Global.Enum.SCREEN_CODE.LOBBY_MONEY) {
            Global.UIManager.showLoading();
            this.currentScreen = Global.Enum.SCREEN_CODE.LOBBY_MONEY;
            Global.DownloadManager.LoadScene("Lobby","LobbyScene2", (scene)=>{
                cc.director.runScene(scene);
            },1)
        }
    },

    ChangeBetMoneyType(){
        if(this.moneyType == 0)
            this.moneyType = 1;
        else
            this.moneyType = 0;
    },

    SetBetMoneyType(moneyType) {
        this.moneyType = moneyType;
    },
});
module.exports = ScreenManager;