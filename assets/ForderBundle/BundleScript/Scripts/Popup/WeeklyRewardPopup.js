

cc.Class({
    extends: cc.Component,
    ctor(){
        this.listItem = [];
        this.listOnline = [];
    },

    properties: {
        btnGiftOnline : cc.Button,
        btnGiftAttendance : cc.Button,
        tabOnline : cc.Node,
        tabAttendance : cc.Node,
        weeklyItem : cc.Node,
        itemOnline : cc.Node,
        txtShowTime : cc.Label,
        imgXu : cc.SpriteFrame,
        imgItemIce : cc.SpriteFrame,
        imgItemTarget : cc.SpriteFrame,
        imgItemSpeed : cc.SpriteFrame,
        imgLixi : cc.SpriteFrame,
        imgPiece : cc.SpriteFrame,
        imgCard : cc.SpriteFrame,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listItem[this.listItem.length] = this.weeklyItem.getComponent("WeeklyItemView");
        this.listOnline[this.listOnline.length] = this.itemOnline.getComponent("WeeklyItemView");
    },

    show(status) {
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.Init();
        this.node.active = true;
        if(status == Global.Enum.STATUS_GIFT_POPUP.ATTENDANCE)
            this.ShowTabAttendance ();
        else if(status == Global.Enum.STATUS_GIFT_POPUP.ONLINE)
            this.ShowTabGiftOnline ();
    },

    ShowTabGiftOnline() {
        this.btnGiftAttendance.interactable  = true;
        this.btnGiftOnline.interactable  = false;
        this.tabOnline.active = true;
        this.tabAttendance.active = false;
        for (let i = 0; i < this.listOnline.length; i++) {
            this.listOnline [i].node.active = false;
        }
        for (let i = 0; i < Global.listOnlineReward.length; i++) {
            if (i < this.listOnline.length) {
                this.listOnline [i].ShowReward (Global.listOnlineReward[i], this, i, true);
            } else {
                let itemTrans = cc.instantiate(this.itemOnline);
                itemTrans.active = true;
                itemTrans.parent = this.itemOnline.parent;
                let itemView = itemTrans.getComponent("WeeklyItemView");
                itemView.ShowReward (Global.listOnlineReward[i], this, i, true);
                this.listOnline[this.listOnline.length] = itemView;
            }
        }
    },

    ShowTabAttendance() {
        this.btnGiftAttendance.interactable = false;
        this.btnGiftOnline.interactable = true;
        this.tabOnline.active = false;
        this.tabAttendance.active = true;
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem [i].node.active = false;
        }
        for (let i = 0; i < Global.listDailyReward.length; i++) {
            if (i < this.listItem.length) {
                this.listItem [i].ShowReward (Global.listDailyReward[i], this, i, false);
            } else {
                let itemTrans = cc.instantiate(this.weeklyItem);
                itemTrans.active = true;
                itemTrans.parent = this.weeklyItem.parent;
                let itemView = itemTrans.getComponent("WeeklyItemView");
                itemView.ShowReward (Global.listDailyReward[i], this, i, false);
                this.listItem[this.listItem.length] = itemView;
            }
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

    FormatTimeRemain (timeRemain) {
        let minute = parseInt(timeRemain / 60);
        let second = parseInt(timeRemain % 60);
        let strMinute = "";
        let strSecond = "";
        if (minute < 10)
            strMinute = "0" + minute;
        else
            strMinute = minute.toString ();
        if (second < 10)
            strSecond = "0" + second;
        else
            strSecond = second.toString ();
        return strMinute + ":" + strSecond;
    },

    Hide() {
        this.node.active = false;
        Global.UIManager.hideMark();
    },

    update(dt) {
        if (Global.NetworkManager.GetTimeRemain () < 0) {
            this.txtShowTime.string = "00:00";
        } else {
            this.txtShowTime.string = this.FormatTimeRemain (Global.NetworkManager.GetTimeRemain ());
        }
    },

    onDestroy(){
		Global.WeeklyRewardPopup = null;
	},
});

