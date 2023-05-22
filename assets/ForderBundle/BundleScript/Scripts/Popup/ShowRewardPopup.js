

cc.Class({
    extends: cc.Component,
    ctor(){
        this.listItem = [];
        this.listReward = [];
        this.listCacheShow = [];
        this.listDescriptionReward = [];
        this.listInfo = [];
        this.isShow = false;
    },

    properties: {
        onlineContent : cc.Node,
        dailyContent : cc.Node,
        rewardContent : cc.Node,
        vipContent : cc.Node,
        weeklyItem : cc.Node,
        rewardItem : cc.Node,
        iconOnlineReward : cc.Sprite,
        valueOnlineReward : cc.Label,
        descriptionOnline : cc.Label,
        vipLv : cc.Label,
        vipIcon : cc.Sprite,
        contentKey : cc.Node,
        imgXu : cc.SpriteFrame,
        imgItemIce : cc.SpriteFrame,
        imgItemTarget : cc.SpriteFrame,
        imgItemSpeed : cc.SpriteFrame,
        imgLixi : cc.SpriteFrame,
        imgPiece : cc.SpriteFrame,
        imgCard : cc.SpriteFrame,
        btnXacNhan : cc.Button,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listItem[this.listItem.length] = this.weeklyItem.getComponent("RewardItemView");
        this.listReward[this.listReward.length] = this.rewardItem.getComponent("RewardItemView");
    },

    show(status, content = null) {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.Init();
        this.node.active = true;
        if (status == Global.Enum.STATUS_GIFT_POPUP.ATTENDANCE)
            this.listCacheShow[this.listCacheShow.length] = Global.indexDailyReward;
        else if (status == Global.Enum.STATUS_GIFT_POPUP.ONLINE) {
            this.listCacheShow[this.listCacheShow.length] = Global.indexOnlineReward + 10;
        } else if (status == Global.Enum.STATUS_GIFT_POPUP.VIP) {
            this.listCacheShow[this.listCacheShow.length] = 20;
        }else {
            this.listCacheShow[this.listCacheShow.length] = 30;
            this.listDescriptionReward[this.listCacheShow.length-1] = content;
        }
        if (this.isShow)
            return;
        this.ShowProcess (status);
    },

    ShowProcess(status) {
        this.node.active = true;
        this.isShow = true;
        if (status == Global.Enum.STATUS_GIFT_POPUP.ATTENDANCE) {
            this.dailyContent.active = true;
            this.onlineContent.active = false;
            this.rewardContent.active = false;
            this.vipContent.active = false;
            let rewardConfig = Global.listDailyReward [this.listCacheShow [0]];
            let descriptionDaily = Global.Helper.formatString (Global.MyLocalization.GetText ("RECEIVE_REWARD_DAILY"), [rewardConfig.Time]);
            for (let i = 0; i < this.listItem.length; i++) {
                this.listItem [i].node.active = false;
            }
            this.listInfo = [];
            for (let i = 0; i < rewardConfig.RewardList.length; i++) {
                this.AddInfo(i, rewardConfig.RewardList [i].RewardType, rewardConfig.RewardList [i].ItemType);
                if (i < this.listItem.length) {
                    this.listItem [i].FillInfo (rewardConfig.RewardList [i].RewardType, rewardConfig.RewardList [i].ItemType, rewardConfig.RewardList [i].Amount, this, descriptionDaily);
                } else {
                    let itemTrans = cc.instantiate(this.weeklyItem);
                    itemTrans.active = true;
                    itemTrans.parent = this.weeklyItem.parent;
                    let itemView = itemTrans.getComponent("RewardItemView");
                    this.listItem[this.listItem.length] = itemView;
                    itemView.FillInfo (rewardConfig.RewardList [i].RewardType, rewardConfig.RewardList [i].ItemType, rewardConfig.RewardList [i].Amount, this, descriptionDaily);
                }
            }
            this.btnXacNhan.node.active = true;
            this.btnXacNhan.interactable = true;
        } else if (status == Global.Enum.STATUS_GIFT_POPUP.ONLINE) {
            this.dailyContent.active = false;
            this.onlineContent.active = true;
            this.rewardContent.active = false;
            this.vipContent.active = false;
            let rewardConfig = Global.listOnlineReward [this.listCacheShow [0] - 10];
            this.descriptionOnline.string = Global.Helper.formatString (Global.MyLocalization.GetText ("RECEIVE_REWARD_ONLINE"), [rewardConfig.Time]);
            this.valueOnlineReward.string = "X" + rewardConfig.RewardList [0].Amount;
            this.listInfo = [];
            this.AddInfo(0, rewardConfig.RewardList [0].RewardType, rewardConfig.RewardList [0].ItemType);
            this.SetIconItem (this.iconOnlineReward, rewardConfig.RewardList [0].RewardType, rewardConfig.RewardList [0].ItemType);
            this.btnXacNhan.node.active = true;
            this.btnXacNhan.interactable = true;
        } else if (status == Global.Enum.STATUS_GIFT_POPUP.REWARD) {
            this.dailyContent.active = false;
            this.onlineContent.active = false;
            this.rewardContent.active = true;
            this.vipContent.active = false;
            for (let i = 0; i < this.listReward.length; i++) {
                this.listReward [i].node.active = false;
            }
            let descriptionReward = "";
            if (this.listDescriptionReward [0] == null) {
                descriptionReward = Global.MyLocalization.GetText ("REWARD_DESCIPTION_VIP");
            } else {
                descriptionReward = this.listDescriptionReward [0];
            }
            this.listInfo = [];
            for (let i = 0; i < Global.listReward [0].length; i++) {
                this.AddInfo(i, Global.listReward [0] [i].RewardType, Global.listReward [0] [i].ItemType);
                if (i < this.listReward.length) {
                    this.listReward [i].FillInfo (Global.listReward [0] [i].RewardType, Global.listReward [0] [i].ItemType, Global.listReward [0] [i].Amount, this, descriptionReward);
                } else {
                    let itemTrans = cc.instantiate(this.rewardItem);
                    itemTrans.active = true;
                    itemTrans.parent = this.rewardItem.parent;
                    let itemView = itemTrans.getComponent("RewardItemView");
                    this.listReward[this.listReward.length] = itemView;
                    itemView.FillInfo (Global.listReward [0] [i].RewardType, Global.listReward [0] [i].ItemType, Global.listReward [0] [i].Amount, this, descriptionReward);
                }
            }
           
            this.listDescriptionReward.splice(0, 1);
            Global.listReward.splice (0, 1);
            this.btnXacNhan.node.active = true;
            this.btnXacNhan.interactable = true;
        } else if (status == Global.Enum.STATUS_GIFT_POPUP.VIP) {
            this.dailyContent.active = false;
            this.onlineContent.active = false;
            this.rewardContent.active = false;
            this.vipContent.active = true;
            // this.vipLv.string = Global.MainPlayerInfo.vipLevel.toString();
            Global.Helper.GetVipIcon(Global.MainPlayerInfo.vipLevel, this.vipIcon);
            this.btnXacNhan.node.active = false;
        }
    },

    SetIconItem(img, rewardType, itemType) {
        if (rewardType == Global.Enum.REWARD_TYPE.INGAME_BALANCE) {
            img.spriteFrame = this.imgXu;
        } else if (rewardType == Global.Enum.REWARD_TYPE.ITEM_INGAME) {
            if (itemType == Global.Enum.ITEM_TYPE.ICE) {
                img.spriteFrame = this.imgItemIce
            } else if (itemType == Global.Enum.ITEM_TYPE.TARGET) {
                img.spriteFrame = this.imgItemTarget
            } else if (itemType == Global.Enum.ITEM_TYPE.SPEED) {
                img.spriteFrame = this.imgItemSpeed;
            }
        } else if (rewardType == Global.Enum.REWARD_TYPE.LIXI) {
            img.spriteFrame = this.imgLixi;
        } if (rewardType == Global.Enum.REWARD_TYPE.PIECE_CARD) {
            img.spriteFrame = this.imgPiece;
        } else if (rewardType == Global.Enum.REWARD_TYPE.CARD) {
            img.spriteFrame = this.imgCard;
        }
    },

    AddInfo(i, rewardType, itemType) {
        let info = {
            RewardType : rewardType,
            ItemType : itemType,
        }
        this.listInfo[i] = info;
    },

    Hide() {
        let countItem = 0;
        this.btnXacNhan.interactable = false;
        for(let i = 0; i < this.listInfo.length; i++) {
            let count = 1;
            if(this.listInfo[i].RewardType == Global.Enum.REWARD_TYPE.INGAME_BALANCE)
                count = 2;
            for(let j = 0; j < count; j++) {
                this.scheduleOnce(()=>{
                    cc.resources.load("Key" , cc.Prefab , (err , pre)=>{
                        let node = cc.instantiate(pre);
                        this.contentKey.addChild(node);
                        node.setPosition(cc.v2(0,-250));
                        node.getComponent("ItemRewardView").ItemRewardView_SetImage(this.listInfo[i].RewardType, this.listInfo[i].ItemType);
                        let action1 = cc.moveTo(0.1 , cc.v2(0,-220));
                        let action2 = cc.repeat( cc.sequence(cc.moveBy(0.13 , 0,30),cc.moveBy(0.13 , 0,-30)) , 4);
                        let action3 = cc.moveTo(0.3 , cc.v2(-400,300));
                        let action4 = cc.callFunc(()=>{ node.destroy()});
                        node.runAction(cc.sequence(action1 , action2 , action3 , action4));
                    });
                } , 0.5 * countItem);
                countItem += 1;
            }
        }
        this.node.runAction(cc.sequence(cc.delayTime(countItem * 0.5 + 1) , cc.callFunc(()=>{
            this.listCacheShow.splice (0, 1);
            this.isShow = false;
            if (this.listCacheShow.length == 0) {
                this.node.active = false;
                this.listInfo = [];
                Global.UIManager.hideMark();
            }
            else {
                if (this.listCacheShow [0] < 10)
                    this.ShowProcess (Global.Enum.STATUS_GIFT_POPUP.ATTENDANCE);
                else if (this.listCacheShow[0] < 20)
                    this.ShowProcess (Global.Enum.STATUS_GIFT_POPUP.ONLINE);
                else if (this.listCacheShow[0] < 30)
                    this.ShowProcess (Global.Enum.STATUS_GIFT_POPUP.VIP);
                else 
                    this.ShowProcess (Global.Enum.STATUS_GIFT_POPUP.REWARD);
            }
        })));
        
    },

    onDestroy(){
		Global.ShowRewardPopup = null;
	},
});
