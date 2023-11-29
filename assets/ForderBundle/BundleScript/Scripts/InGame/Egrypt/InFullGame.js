cc.Class({
    extends: cc.Component,

    properties: {
        nodeGame: cc.Node,
        nodeDemo: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.GameScence = this;

        this.vecMaxSize = cc.size(1280, 720);
    },

    start() {
        console.log("Slot full game start");
        Global.UIManager.showLoading();
		console.log(require("ScreenManager").getIns().roomType);
        let fullGame = this;
		let url = "";
        let bName = "";
        switch(require("ScreenManager").getIns().roomType){
            case 19:
                bName = "19";
                url = "SlotCaChep";
                break;
            case 20:
                bName = "20";
                url = "SlotMaya";
                break;
            case 21:
                bName = "21";
                url = "SlotChinaQueen";
                break;
            case 22:
                bName = "22";
                url = "SlotSnowFall";
                break;
            case 23:
                bName = "23";
                url = "SlotChinaFall";
                break;
            case 24:
                bName = "24";
                url = "SlotAliceJump";
                break;
            case 25:
                bName = "25";
                url = "SlotDragonFire";
                break;
            case 26:
                bName = "26";
                url = "SlotGonzo";
                break;
            case 28:
                bName = "28";
                url = "SlotTowerUp";
                break;
            case 29:
                bName = "29";
                url = "SlotThai";
                break;
            case 31:
                bName = "31";
                url = "Slot9Pot";
                break;
            case 32:
                bName = "32";
                url = "SlotSweetBonanza";
                break;
            case 33:
                bName = "33";
                url = "SlotTayDuKy";
                this.nodeDemo.position = cc.v2(-505, 585);
                break;
            case 35:
                bName = "35";
                url = "SlotSTTT";
                break;
            case 37:
                bName = "37";
                url = "SlotAnKhe";
                break;
        }
        let seft = this;
        Global.DownloadManager.LoadPrefab(bName,url, (prefab)=>{
            let currentScreen = require("ScreenManager").getIns().currentScreen;
            if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT){
                Global.UIManager.hideLoading();
                let slot = cc.instantiate(prefab);
                seft.RegisResponseServer(slot);
			    fullGame.nodeGame.addChild(slot);
            }
		}, 1);  

        if(Global.agent == 0){
            this.nodeDemo.active = true;
        }
        
    },
    
    //dky add game, sau này thêm xóa game
    RegisResponseServer(slot){
        let slotControl = slot.getComponent("SlotController");
        let slotType = require("ScreenManager").getIns().roomType;
        switch(slotType){
            case 35:
                slotControl.setGameId(Global.Enum.GAME_TYPE.SON_TINH_THUY_TINH);
                slotControl.Init();
                require("SlotNetworkManager").getIns().AddSlotController(Global.Enum.GAME_TYPE.SON_TINH_THUY_TINH, slotControl);
                break;
            case 37:
                slotControl.setGameId(Global.Enum.GAME_TYPE.AN_KHE_TRA_VANG);
                slotControl.Init();
                require("SlotNetworkManager").getIns().AddSlotController(Global.Enum.GAME_TYPE.AN_KHE_TRA_VANG, slotControl);
                break;
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
