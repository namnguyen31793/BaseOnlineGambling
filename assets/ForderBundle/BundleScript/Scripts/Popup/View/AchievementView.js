cc.Class({
    extends: cc.Component,
    ctor() {
        this.missionId = 0;
        this.id = 0;
    },

    properties: {
        lbDescription : cc.Label,
        lbMoney : cc.Label,
        btnReceive : cc.Node,
        btnReceived : cc.Node,
        btnNoReceive : cc.Node,
        btnMax : cc.Node,
        bgComplete : cc.Node,
    },

    UpdateInfo(info) {
        this.missionId = info.MissionId;
        this.lbMoney.string = Global.Helper.formatNumber(info.RewardMoney);
        this.lbDescription.string = info.MissionName;
        this.btnMax.active = false;
        this.btnReceive.active = false;
        this.btnReceived.active = false;
        this.btnNoReceive.active = true;
        this.bgComplete.active = false;
    },

    SetStateWin(info) {
        this.id = info.Id;
        if(info.IsReaded) {
            this.bgComplete.active = true;
            this.btnReceive.active = false;
            this.btnReceived.active = true;
            this.btnNoReceive.active = false;
        } else {
            this.btnReceive.active = true;
            this.btnReceived.active = false;
            this.btnNoReceive.active = false;
            this.bgComplete.active = false;
        }
    },

    ClickReceive() {
        let data = {};
		data[1] = this.id;

        require("SendRequest").getIns().MST_Client_Event_Mission_Get_Take_Account_Reward(data);
        require("SendRequest").getIns().MST_Client_Event_Mission_Get_List_Reward_Account();
        Global.AchievementPopup.cacheView = this;
    },

    ShowEffect(accountBalance) {
        let sPos = this.ParsePosition(this.btnMax, 4);
        let countItem = 0;
        for(let j = 0; j < 3; j++) {
            this.scheduleOnce(()=>{
                cc.resources.load("Key" , cc.Prefab , (err , pre)=>{
                    let node = cc.instantiate(pre);
                    node.parent = Global.AchievementPopup.startNode;
                    node.setPosition(sPos);
                    node.getComponent("ItemRewardView").ItemRewardView_SetImage(Global.Enum.REWARD_TYPE.INGAME_BALANCE, 0);
                    
                    let action1 = cc.moveTo(0.1 , cc.v2(sPos.x,sPos.y-30));
                    let action2 = cc.repeat( cc.sequence(cc.moveBy(0.13 , 0,30),cc.moveBy(0.13 , 0,-30)) , 4);
                    let action3 = cc.moveTo(0.3 , cc.v2(Global.AchievementPopup.endNode.x,Global.AchievementPopup.endNode.y));
                    let action4 = cc.callFunc(()=>{ node.destroy()});
                    node.runAction(cc.sequence(action1 , action2, action3, action4 ));
                });
            } , 0.5 * countItem);
            countItem += 1;
        }
        this.scheduleOnce(()=>{
            require("WalletController").getIns().UpdateWallet (accountBalance);
        } ,2.5);
    },

    ParsePosition(node, level) {
        let nPos = node.getPosition();
        let cParent = node;
        for(let i = 0; i < level; i++) {
            cParent = cParent.parent;
            nPos.x += cParent.x;
            nPos.y += cParent.y;
        }
        return nPos;
    },
});
