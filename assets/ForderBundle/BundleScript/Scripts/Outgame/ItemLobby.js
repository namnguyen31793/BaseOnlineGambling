

cc.Class({
    extends: cc.Component,
    ctor() {
        this.itemID = 0;
        this.index = 0;
        this.cachePress = false;
    },
    //0-bau cua,1-casino,2-tansuu,3-banca,4-tamquoc,5,minipoker,6-minislot

    properties: {
        button:cc.Button,
       txtJackpotRoom1 :require("TextJackpot"),
       txtJackpotRoom2 :require("TextJackpot"),
       txtJackpotRoom3 :require("TextJackpot"),
       dragon : dragonBones.ArmatureDisplay,
       itemDBAsset: {
        default: [],
        type: dragonBones.DragonBonesAsset,
        },

        itemDBAtlasAsset: {
            default: [],
            type: dragonBones.DragonBonesAtlasAsset,
        },

    },

    initItem(rawData) {
        this.index = this.itemID  % 7;
        this.dragon.dragonAsset = this.itemDBAsset[this.index];
        this.dragon.dragonAtlasAsset = this.itemDBAtlasAsset[this.index];
        this.UpdateJackpot();
    },

    UpdateJackpot() {
        let listData = Global.listJackpot;
        if(!listData)
            return;
        if(this.index == 3) {
            this.txtJackpotRoom1.node.active = false;
            this.txtJackpotRoom2.node.active = false;
            this.txtJackpotRoom3.node.active = false;
        } else {
            this.txtJackpotRoom1.node.active = true;
            this.txtJackpotRoom2.node.active = true;
            this.txtJackpotRoom3.node.active = true;
        }
        
        let mode = 0;
        if(this.index == 0)
            mode = 14;
        if(this.index == 1)
            mode = 15;
        if(this.index == 2)
            mode = 17;
        if(this.index == 4)
            mode = 16;
        if(this.index == 5)
            mode = 8;
        if(this.index == 6)
            mode = 14;   
        for (let i = 0; i < listData.length; i++) {
            if (listData [i].GameId == 2) {
                if (listData [i].PlayMode == mode) {
                    if (listData [i].RoomType == 1) {
                        this.txtJackpotRoom1.StartIncreaseTo(listData[i].JackpotValue);
                    } else if (listData [i].RoomType == 2) {
                        this.txtJackpotRoom2.StartIncreaseTo(listData[i].JackpotValue);
                    } else if (listData [i].RoomType == 3) {
                        this.txtJackpotRoom3.StartIncreaseTo(listData[i].JackpotValue);
                    }
                }
            }
        }
    },

    SetIndexInView(indexView) {
        switch(indexView) {
            case 0:
                // this.button.node.color = cc.Color.WHITE;
                this.button.node.setPosition(cc.v2(24,-20));
                this.button.node.setContentSize(84, 356);
                break;
            case 1:
                // this.button.node.color = cc.Color.GREEN;
                this.button.node.setPosition(cc.v2(40,-17));
                this.button.node.setContentSize(208, 430);
                break;
            case 2:
                // this.button.node.color = cc.Color.BLUE;
                this.button.node.setPosition(cc.v2(-18,-15));
                this.button.node.setContentSize(248, 446);
                break;
            case 3:
                // this.button.node.color = cc.Color.RED;
                this.button.node.setPosition(cc.v2(-70,-18));
                this.button.node.setContentSize(188, 432);
                break;
            case 4:
                // this.button.node.color = cc.Color.BLACK;
                this.button.node.setPosition(cc.v2(-29,-14));
                this.button.node.setContentSize(81, 322);
                break;
            default:
                
                this.button.node.setPosition(cc.v2(0,0));
                this.button.node.setContentSize(0, 0);
                break;
        }
    },

    ClickButton() {
        Global.AudioManager.ClickButton();
		if (!Global.isLogin) {
			Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NEED_LOGIN"));
			return;
		}
        switch(this.index) {
            case 0:
                if (!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SlotGame))
                    return;
                require("ScreenManager").getIns().roomType = 0;
                require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
                break;
            case 1:
                if (!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SlotGame))
                    return;
                require("ScreenManager").getIns().roomType = 3;
                require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
                break;
            case 2:
                if (!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SlotGame))
                    return;
                require("ScreenManager").getIns().roomType = 4;
                require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
                break;
            case 3:
                for (var i = 0; i < Global.GameConfig.ListRoomConfig.length; i++) {
                    if (Global.GameConfig.ListRoomConfig[i].RoomId == 1) {
                        if (Global.MainPlayerInfo.ingameBalance < Global.GameConfig.ListRoomConfig[i].MinMoney) {
                            Global.UIManager.showCommandPopup(Global.Helper.formatString(Global.MyLocalization.GetText("MIN_MONEY_JOIN_ROOM"), [Global.Helper.formatNumber(Global.GameConfig.ListRoomConfig[i].MinMoney)]), null);
                        }
                    }
                }
                require("ScreenManager").getIns().roomType = 1;
                require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS);
                break;
            case 4:
                if (!Global.Helper.CheckFunction(Global.GameConfig.FeatureConfig.SlotGame))
                    return;
                require("ScreenManager").getIns().roomType = 1;
                require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
                break;
            case 5:
                Global.BtnMiniGame.clickMiniPoker();
                break;
            case 6:
                Global.BtnMiniGame.clickMiniSlot();
                break;
            default:
                break;
        }
    },
});
