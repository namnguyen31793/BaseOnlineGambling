cc.Class({
    extends: cc.Component,

    ctor(){
        this.currentBet = 90000;
        this.roomId = 0;
        this.valueBet = 0;
    },

    properties: {
        nodeGacha : sp.Skeleton,
        btnSpin : cc.Node,
        lbValue : cc.Label,
        lbCurrentDiamon : cc.Label,
        itemTakeNode : cc.Node,
    },
    
    AnimShow(roomID, valueBet, nameSkin, isEvent = false){
        cc.log("AnimShow "+valueBet+"     "+nameSkin);
        this.nodeGacha.setSkin(nameSkin);
        this.nodeGacha.setAnimation(0,'xuathien',false);
        this.nodeGacha.node.scale = 1;

        this.currentBet = valueBet;
        this.roomId = roomID;
        this.scheduleOnce(()=>{
            this.btnSpin.active = true;
            this.nodeGacha.setAnimation(0,'choannutquay',true);
            this.lbValue.node.active = true;
            this.lbValue.string = valueBet;
            this.lbCurrentDiamon.node.active = true;
        } , 0.7);
        this.valueBet = valueBet;
        this.CheckAmountDiamon();
    },

    ClickSpin(){
        this.btnSpin.active = false;
        this.lbValue.node.active = false;
        this.lbCurrentDiamon.node.active = false;
        Global.Gacha.ActiveButton(false);
        let msgData = {};
        msgData[1] = this.roomId;
        require("SendRequest").getIns().MST_Client_Event_LootBox_Spin (msgData);
        this.nodeGacha.setAnimation(0,'loop-vong-quay',true);
    },

    ShowWinGacha(value, ExtendDescription, IngameBalance, listDataBagString){
        this.nodeGacha.setAnimation(0,'annutquay',false);
        var infoItem = ExtendDescription.split('.');
        var typeId = parseInt(infoItem[0]);
        var typeValue = parseInt(infoItem[1]);
        //end anim
        this.scheduleOnce(()=>{
            Global.Helper.GetIconItemByTypeGacha(this.itemTakeNode.getComponent(cc.Sprite), typeId, typeValue)
            if(typeId == 3){
                this.itemTakeNode.getChildByName('value').getComponent(cc.Label).string = 1;
            }else{
                this.itemTakeNode.getChildByName('value').getComponent(cc.Label).string = Global.Helper.formatPrice(typeValue);
            }
            let listData = [];
            for (let i = 0; i < listDataBagString.length; i++) {
                listData[i] = JSON.parse(listDataBagString[i]);
            }
            this.itemTakeNode.runAction(cc.scaleTo(0.3, 1).easing(cc.easeSineOut()));      

            require("BagController").getIns().UpdateBagInfo(listData);
            this.scheduleOnce(()=>{
                let currentScreen = require("ScreenManager").getIns().currentScreen;
                if(currentScreen != 0 && currentScreen) {
                    if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                        cc.log(IngameBalance);
                        require("WalletController").getIns().UpdateWallet(IngameBalance);
                    }
                    else if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                        if(value > 0) {
                            Global.GameLogic.mainActor.UpdateBalance(value, true);
                        }
                        // require("WalletController").getIns().UpdateWallet(IngameBalance);
                        Global.GameLogic.mainActor.itemControl.UpdateInfo();
                        for(let i = 0; i < listData.length; i++) {
                            if(listData[i].ItemId == 4) {
                                Global.GameLogic.mainActor.itemControl.UpdateInfo();
                                Global.GameLogic.UpdateDiamond(listData[i].AccountId ,listData[i].Amount);
                                // Global.GameLogic.UpdateBalane(listData[i].AccountId, IngameBalance);
                            }
                        }
                    }
                    else {
                        require("WalletController").getIns().UpdateWallet(IngameBalance);
                    }
                }
                this.scheduleOnce(()=>{
                    this.itemTakeNode.runAction(cc.scaleTo(0.1, 0).easing(cc.easeSineOut()));  
                    Global.Gacha.ActiveButton(true);
                    this.CheckAmountDiamon();
                    this.nodeGacha.setAnimation(0,'xuathien',false);  
                    this.scheduleOnce(()=>{
                        this.btnSpin.active = true;
                        this.lbValue.node.active = true;
                        this.lbCurrentDiamon.node.active = true;
                        this.nodeGacha.setAnimation(0,'choannutquay',true);
                    } , 0.5);  
                }, 1.5);
            }, 1);
        } , 2.85);
    },

    CheckAmountDiamon(){
        let listItemData = require("BagController").getIns().listDataItem;
        
        if(listItemData == null){
            this.btnSpin.getComponent(cc.Button).interactable = false;
            this.lbCurrentDiamon.string = "0";
        }else{
            var infoDiamon = null;
            for(let i = 0; i < listItemData.length; i++){
                if(listItemData[i].ItemId == 4)
                    infoDiamon = listItemData[i];
            }
            if(infoDiamon == null) {
                this.lbCurrentDiamon.string = "0";
            }
                
            else {
                this.lbCurrentDiamon.string = Global.Helper.formatNumber(infoDiamon.Amount);
            }
            if(infoDiamon == null || infoDiamon.Amount < this.valueBet){
                this.btnSpin.getComponent(cc.Button).interactable = false;
                this.lbValue.node.color = cc.Color.RED;
            }else{
                this.btnSpin.getComponent(cc.Button).interactable = true;
                this.lbValue.node.color = cc.Color.WHITE;
            }
        }
    },

    ResetUI(){
        this.nodeGacha.node.scale = 0;
        this.btnSpin.active = false;
        this.lbValue.node.active = false;
        this.lbCurrentDiamon.node.active = false;
        this.lbValue.string = "";
        this.itemTakeNode.scale = 0;
        this.itemTakeNode.getComponent(cc.Sprite).spriteFrame = null;
        this.itemTakeNode.getChildByName('value').getComponent(cc.Label).string = "";
    },
});
