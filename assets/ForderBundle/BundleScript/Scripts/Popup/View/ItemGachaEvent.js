cc.Class({
    extends: require("ItemGachaElement"),
    ctor() {
        this.amount = 0;
    },

    properties: {
        sprSpin : [cc.SpriteFrame],
        imgBtnSpin : cc.Sprite,
    },

    UpdateAmount(smallSpin, bigSpin) {
        if(this.roomId == 1)
            this.amount = smallSpin;
        else this.amount = bigSpin;
        this.imgBtnSpin.spriteFrame = this.sprSpin[this.roomId-1];
        this.CheckAmountDiamon();
    },

    ClickSpin(){
        this.btnSpin.active = false;
        this.lbValue.node.active = false;
        this.lbCurrentDiamon.node.active = false;
        Global.GachaEvent.ActiveButton(false);
        let key = Global.Enum.ITEM_TYPE.KEY_EVENT_SMALL_USER;
        if(this.roomId == 2) 
            key = Global.Enum.ITEM_TYPE.KEY_EVENT_BIG_USER;
        let msgData = {};
        msgData[1] = key;
        require("SendRequest").getIns().MST_Client_Event_Play_Game (msgData);
        this.nodeGacha.setAnimation(0,'loop-vong-quay',true);
    },

    CheckAmountDiamon(){
        this.lbCurrentDiamon.string = Global.Helper.formatNumber(this.amount);
        if(this.amount < this.valueBet){
            this.btnSpin.getComponent(cc.Button).interactable = false;
            this.lbValue.node.color = cc.Color.RED;
        }else{
            this.btnSpin.getComponent(cc.Button).interactable = true;
            this.lbValue.node.color = cc.Color.WHITE;
        }
    },

    ShowWinGacha(value, ExtendDescription, IngameBalance, listDataBagString){
        this.nodeGacha.setAnimation(0,'annutquay',false);
        // var infoItem = ExtendDescription.split('.');
        // var typeId = parseInt(infoItem[0]);
        // var typeValue = parseInt(infoItem[1]);
        //end anim
        this.scheduleOnce(()=>{
            Global.Helper.GetIconItemByTypeGacha(this.itemTakeNode.getComponent(cc.Sprite), 0, value)
            // if(typeId == 3){
                // this.itemTakeNode.getChildByName('value').getComponent(cc.Label).string = 1;
            // }else{
                this.itemTakeNode.getChildByName('value').getComponent(cc.Label).string = Global.Helper.formatPrice(value);
            // }
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
                        require("WalletController").getIns().UpdateWallet(IngameBalance);
                    }
                    else if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                        if(value > 0) {
                            Global.GameLogic.mainActor.UpdateBalance(value, true);
                        }
                        require("WalletController").getIns().UpdateWallet(IngameBalance);
                        Global.GameLogic.mainActor.itemControl.UpdateInfo();
                        for(let i = 0; i < listData.length; i++) {
                            if(listData[i].ItemId == 4) {
                                Global.GameLogic.mainActor.itemControl.UpdateInfo();
                                Global.GameLogic.UpdateDiamond(listData[i].AccountId ,listData[i].Amount);
                                // Global.GameLogic.UpdateBalane(listData[i].AccountId, IngameBalance);
                            }
                            let smallSpin = 0;
                            let bigSpin = 0;
                            if(listData[i].ItemId == Global.Enum.ITEM_TYPE.KEY_EVENT_SMALL_USER) {
                                smallSpin = listData[i].Amount
                            }
                            if(listData[i].ItemId == Global.Enum.ITEM_TYPE.KEY_EVENT_BIG_USER) {
                                bigSpin = listData[i].Amount
                            }
                            Global.GachaEvent.UpdateAmount(smallSpin, bigSpin);
                        }
                    }
                    else {
                        require("WalletController").getIns().UpdateWallet(IngameBalance);
                    }
                }
                this.scheduleOnce(()=>{
                    this.itemTakeNode.runAction(cc.scaleTo(0.1, 0).easing(cc.easeSineOut()));  
                    Global.GachaEvent.ActiveButton(true);
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
});
