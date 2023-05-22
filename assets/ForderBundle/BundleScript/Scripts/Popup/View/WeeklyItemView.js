

cc.Class({
    extends: cc.Component,
    ctor(){
        this.listItem = [];
    },

    properties: {
        title : cc.Label,
        receivedBtn : cc.Node,
        item : cc.Node,
    },

    Init() {
        if(this.isInit)
        {
            return;
        }
        this.isInit = true;
        this.listItem[this.listItem.length] = this.item.getComponent("RewardItemView");
    },

    ShowReward(reward, store, index, isOnline) {
        this.Init();
        this.node.active = true;
        if (!isOnline)
            this.title.string = Global.Helper.formatString (Global.MyLocalization.GetText ("TITLE_DAILY_BONUS"), [reward.Time]);
        else {
            let hour = parseInt(reward.Time / 60);
            let minute = parseInt(reward.Time % 60);
            this.title.string = Global.Helper.formatString ("{0}:{1}:00", [this.formatNumber(hour), this.formatNumber(minute)]);
        }
        if (!isOnline) {
            if (reward.Time - 1 <= Global.indexDailyReward) {
                this.receivedBtn.active = true;
            } else {
                this.receivedBtn.active = false;
            }
        } else {
            if (index <= Global.indexOnlineReward) {
                this.receivedBtn.active = true;
            } else {
                this.receivedBtn.active = false;
            }
        }
        for (let i = 0; i < this.listItem.length; i++) {
            this.listItem [i].node.active = false;
        }
        for (let i = 0; i < reward.RewardList.length; i++) {
            if (i < this.listItem.length) {
                this.listItem [i].FillInfo (reward.RewardList [i].RewardType, reward.RewardList [i].ItemType, reward.RewardList [i].Amount, store);
            } else {
                let itemTrans = cc.instantiate(this.item);
                itemTrans.active = true;
                itemTrans.parent = this.item.parent;
                let itemView = itemTrans.getComponent("RewardItemView");
                this.listItem[this.listItem.length] = itemView;
                itemView.FillInfo (reward.RewardList [i].RewardType, reward.RewardList [i].ItemType, reward.RewardList [i].Amount, store);
            }
        }
    },

    formatNumber(numb) {
        if(numb < 10)
            return "0"+numb;
        return numb.toString();
    },
});
