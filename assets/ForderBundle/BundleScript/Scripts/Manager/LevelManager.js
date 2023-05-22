cc.Class({
    extends: cc.Component,
    ctor() {
        this.listReward = null;
        this.currentLevel = 0;
    },

    properties: {
        lbLevel : cc.Label,
        expProgress : cc.Node,
        contentLevel : cc.Node,
        giftLevelUp : cc.Node,
        hasText : false,
    },

    start () {
        this.listReward = null;
        if(this.giftLevelUp) {
            this.contentLevel.active = true;
            //this.giftLevelUp.active = false;
            this.GetLevelInfo();
        }
        this.isFull = false;
    },

    GetLevelInfo() {
        if(Global.isConnect) {
            require("SendRequest").getIns().MST_Client_Event_Score_Get_Current_Account_Score();
        }
    },

    UpdateInfo(currentExp, totalExp, currentLevel) {
        if(this.expProgress) {
            let spriteExp = this.expProgress.getComponent(cc.Sprite);
            if(spriteExp){
                let value = currentExp/totalExp;
                if (value > 1)
                    value = 1;
                this.expProgress.getComponent(cc.Sprite).fillRange = value;
            }else{
                let newY = -75 + currentExp/totalExp*75;
                if(newY > 0)
                    newY = 0;
                this.expProgress.stopAllActions();
                this.expProgress.runAction(cc.moveTo(0.5, cc.v2(0,newY)));
            }
        }
        
        if(currentExp == totalExp) {
            currentLevel += 1;
            this.isFull = true;
        } else {
            this.isFull = false;
        }
        Global.MainPlayerInfo.level = currentLevel;
        if(this.lbLevel) {
            this.currentLevel = currentLevel;
            if(this.hasText) {
                if(CONFIG.MERCHANT == "3"){
                    this.lbLevel.string = "Cấp "+currentLevel.toString();
                }else{
                    this.lbLevel.string = "LV"+currentLevel.toString();
                }
            } else {
                this.lbLevel.string = currentLevel.toString();
            }
            
            let view = Global.LobbyView;
            // if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
            // view = Global.CityView;
            // }
            // if(view != null)
            //     view.lbLevel.string = Global.MyLocalization.GetText("LEVEL") +": "+currentLevel;
        }
        require("SendRequest").getIns().MST_Client_Event_Level_System_Get_Reward_Info();
        if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
            Global.GameLogic.mainActor.SetLevel(currentLevel);
        } else if(require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
            // Global.LobbyView.UnLockFunction();
        }

        
    },

    UpdateRewardInfo(listReward) {
        if(listReward.length > 0) {
            this.listReward = listReward;
            if(this.expProgress) {
                let spriteExp = this.expProgress.getComponent(cc.Sprite);
                if(spriteExp)
                    spriteExp.fillRange = 1;
                else{
                    //show effect level up
                    this.expProgress.stopAllActions();
                    this.expProgress.runAction(cc.moveTo(0.5, cc.v2(0,0)));
                }
                if(this.giftLevelUp) {
                    //this.contentLevel.active = false;
                    //this.giftLevelUp.active = true;
                }
            }
            this.ClickLevel();
        } else {
            if(this.isFull) {
                if(this.expProgress) {
                    let spriteExp = this.expProgress.getComponent(cc.Sprite);
                    if(spriteExp)
                        this.expProgress.getComponent(cc.Sprite).fillRange = 1;
                    else{
                        this.expProgress.stopAllActions();
                        this.expProgress.runAction(cc.moveTo(0.5, cc.v2(0,-37.5)));
                    }
                }
            }
        }
    },

    ClickLevel() {
		if(this.listReward && this.listReward.length > 0) {
            let data = JSON.parse(this.listReward[0]);
            
            if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
                let cacheStateAuto = Global.SlotNetWork.slotView.isAuto;
                if(Global.SlotNetWork.slotView.isAuto) {
                    Global.SlotNetWork.slotView.menuView.toggleAuto.isChecked = false;
                    Global.SlotNetWork.slotView.isAuto = false;
                }
                Global.UIManager.showLevelPopup(data.LevelReward, data.LevelId, ()=>{
                    Global.SlotNetWork.slotView.menuView.toggleAuto.isChecked = cacheStateAuto;
                    Global.SlotNetWork.slotView.isAuto = cacheStateAuto;
                    Global.SlotNetWork.slotView.ActionAutoSpin();
                });
            } else {
                Global.UIManager.showLevelPopup(data.LevelReward, data.LevelId);
            }
        }
	},

    OnGetReward() {
        this.listReward = null;
        if(this.giftLevelUp) {
            //this.contentLevel.active = true;
            //this.giftLevelUp.active = false;
            let spriteExp = this.expProgress.getComponent(cc.Sprite);
            if(spriteExp)
                this.expProgress.getComponent(cc.Sprite).fillRange = 0;
            else{
                this.expProgress.stopAllActions();
                this.expProgress.runAction(cc.moveTo(0.5, cc.v2(0,-75)));
            }
        }
        this.GetLevelInfo();
       
    },

    onLoad() {
        Global.LevelManager = this;
    },

    onDestroy() {
        Global.LevelManager = null;
    },
});
