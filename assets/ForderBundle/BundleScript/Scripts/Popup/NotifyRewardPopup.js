var SPACE_ITEM = 120;
cc.Class({
    extends: cc.Component,

    properties: {
        listItemNode : {
            default : [],
            type : cc.Node,
        },
        animShow : cc.Animation,
        skeFx : sp.Skeleton,
        nodeClickHide : cc.Node,
        title : cc.Node,//sp.Skeleton,
    },

    //chi show mã 5, sau sua lai thanh keo hoac mo rong sau
    Show(money, rewardDescription, currentAccountBalance){
        cc.log("show notify reward");
		this.node.active = true;
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        let countItem = 0;
        // this.title.active = true;
        //this.title.setAnimation(0, 'animation', false);
        cc.log(money);
        
        if(rewardDescription != null && rewardDescription != "" && rewardDescription != " " && rewardDescription != "  "){
            var dataItem = JSON.parse(rewardDescription);
            cc.log(dataItem);
            cc.log(dataItem.length);
            if(dataItem.length == null){
                countItem += 1;
                let item = this.listItemNode[countItem];
                item.active = true;
                Global.Helper.GetIconBagByType(item.getChildByName('IconItem').getComponent(cc.Sprite), dataItem.RewardItemId);
                item.getChildByName('label').getComponent(cc.Label).string = Global.Helper.formatNumber(dataItem.Amount);
            } else {
                for(let i = 0; i < dataItem.length ; i++){
                    countItem += 1;
                    if(countItem >= 5)
                        continue;
                    let item = this.listItemNode[countItem];
                    item.active = true;
                    cc.log(dataItem[i]);
                    item.getChildByName('label').getComponent(cc.Label).string = Global.Helper.formatNumber(dataItem[i].Amount);
                    if(dataItem[i].ItemType != null) {
                        Global.Helper.GetIconBagByType(item.getChildByName('IconItem').getComponent(cc.Sprite), dataItem[i].ItemType);
                        item.getChildByName('IconGame').getComponent(cc.Sprite).spriteFrame = null;
                    }
                       
                    else if(dataItem[i].GameID != null) {
                        Global.Helper.GetIconBagByType(item.getChildByName('IconItem').getComponent(cc.Sprite), 99);
                        Global.Helper.GetIconGame(item.getChildByName('IconGame').getComponent(cc.Sprite), dataItem[i].GameID);
                    }
                        
                    
                }
            }
        }
        if(money > 0){
            let item = this.listItemNode[countItem];
            item.active = true;
            Global.Helper.GetIconBagByType(item.getChildByName('IconItem').getComponent(cc.Sprite), 0);
            if(countItem != 0)
                item.getChildByName('label').getComponent(cc.Label).string ="X"+ Global.Helper.formatPrice(money);
            else item.getChildByName('label').getComponent(cc.Label).string ="X"+ Global.Helper.formatNumber(money);
        }
        cc.log(this.skeFx);
        this.skeFx.node.active = true;
        this.skeFx.setAnimation(0, 'xuat hien', false);
        this.scheduleOnce(()=>{
            this.skeFx.setAnimation(0, 'loop keo dai', true);
        } , 0.5);
        this.animShow.play("RewardPopupShow");

        this.scheduleOnce(()=>{
            let currentScreen = require("ScreenManager").getIns().currentScreen;
            if(currentScreen != 0 && currentScreen) {
                if(currentScreen == Global.Enum.SCREEN_CODE.LOBBY){
                    cc.log("111111:"+currentAccountBalance);
                    require("WalletController").getIns().UpdateWallet(currentAccountBalance);
                }
                if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                    cc.log("222222222");
                    Global.GameLogic.mainActor.UpdateBalance(money, true);
                }
                if (currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
                    cc.log("333333333");
					require("WalletController").getIns().UpdateWallet (currentAccountBalance);
				}
            }
            //send get bag
		    require("SendRequest").getIns().MST_Client_Account_Bag_Get_Account_Info();
            //this.nodeClickHide.active = true;
        } , 1.5);
        //effect move item to bag
        this.scheduleOnce(()=>{
            this.Hide();
        } , 2.5);
    },

    Hide(){
        this.skeFx.setAnimation(0, 'bien mat', false);
        // this.title.active = false;
        this.scheduleOnce(()=>{
            this.ResetUI();
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.5);
    },

    ResetUI(){
        this.skeFx.node.active = false;
        this.nodeClickHide.active = false;
        for(let i = 0; i < this.listItemNode.length; i++){
            this.listItemNode[i].active = false;
        }
        this.listItemNode[0].parent.scaleX = 0;
    },

    onDestroy(){
		Global.NotifyRewardPopup = null;
	},
});
