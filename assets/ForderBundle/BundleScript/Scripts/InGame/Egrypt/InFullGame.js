cc.Class({
    extends: cc.Component,

    properties: {
        nodeGame: cc.Node,
        nodeDemo: cc.Node,
        nodeUIButton: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.GameScence = this;

        this.vecMaxSize = cc.size(1280, 720);
    },

    start() {
        if(Global.uitype == 2){
            this.nodeUIButton.active = true;
        }
        console.log("Slot full game start");
        Global.UIManager.showLoading();
		console.log(require("ScreenManager").getIns().roomType);
        let fullGame = this;
		let url = "";
        let bName = "";
       if(require("ScreenManager").getIns().roomType == 19){
            bName = "19";
			url = "SlotCaChep";
        }else if(require("ScreenManager").getIns().roomType == 20){
            bName = "20";
			url = "SlotMaya";
        }else if(require("ScreenManager").getIns().roomType == 21){
            bName = "21";
			url = "SlotChinaQueen";
        }else if(require("ScreenManager").getIns().roomType == 22){
            bName = "22";
			url = "SlotSnowFall";
        }else if(require("ScreenManager").getIns().roomType == 23){
            bName = "23";
			url = "SlotChinaFall";
        }else if(require("ScreenManager").getIns().roomType == 24){
            bName = "24";
			url = "SlotAliceJump";
        }else if(require("ScreenManager").getIns().roomType == 25){
            bName = "25";
			url = "SlotDragonFire";
        }else if(require("ScreenManager").getIns().roomType == 26){
            bName = "26";
			url = "SlotGonzo";
        }else if(require("ScreenManager").getIns().roomType == 27){
            bName = "27";
			url = "SlotRpg";
        }else if(require("ScreenManager").getIns().roomType == 28){
            bName = "28";
			url = "SlotTowerUp";
        }else if(require("ScreenManager").getIns().roomType == 29){
            bName = "29";
			url = "SlotThai";
        }else if(require("ScreenManager").getIns().roomType == 31){
            bName = "31";
			url = "Slot9Pot";
        }else if(require("ScreenManager").getIns().roomType == 32){
            bName = "32";
			url = "SlotKraken2";
        }else if(require("ScreenManager").getIns().roomType == 1001){
            bName = "PlinkoBase";
			url = "PlinkoBase";
        }else{
            url = "GamePrefabs/SlotShockDeer";
        }
        Global.DownloadManager.LoadPrefab(bName,url, (prefab)=>{
            let currentScreen = require("ScreenManager").getIns().currentScreen;
            if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT){
                Global.UIManager.hideLoading();
			    fullGame.nodeGame.addChild(cc.instantiate(prefab));
            }
		}, 1);  

        if(Global.agent == 0){
            this.nodeDemo.active = true;
        }
        
    },

    SendLeaveRoom(){
        let msg = {};
        msg[40] = require("ScreenManager").getIns().roomType;
        require("SendRequest").getIns().MST_Client_Slot_Leave_Room(msg);
        Global.UIManager.showLoadingNotHide();
    },

    // update (dt) {},
});
