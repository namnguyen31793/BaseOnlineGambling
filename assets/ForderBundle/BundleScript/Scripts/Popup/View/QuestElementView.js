cc.Class({
    extends: cc.Component,
    ctor() {
        this.missionId = 0;
        this.id = 0;
        this.gameType = 0;
        this.isSuccess = false;
    },

    properties: {
        lbDescription : cc.Label,
        lbMoney : cc.Label,
        btnMax : cc.Node,
        anim : cc.Animation,
        icon : cc.Sprite,
        btnReceive : cc.Button,
        btnPlay : cc.Node,
    },

    UpdateInfo(info) {
        this.missionId = info.MissionId;
        this.id = info.Id;
        this.isSuccess = false;
        this.gameType = info.GameType;
        cc.resources.load("Img/Icon"+info.GameType , cc.SpriteFrame , (err , pre)=>{ 
            this.icon.spriteFrame = pre;
        });
        this.lbMoney.string = Global.Helper.formatNumber(info.RewardMoney);
        this.lbDescription.string = info.MissionName;
        this.btnMax.active = false;
        this.btnReceive.interactable = true;
        this.btnReceive.node.active = false;
        this.btnPlay.active = true;
        if(this.id != null) {
            this.isSuccess = true;
            this.btnPlay.active = false;
            this.btnReceive.node.active = true;
        } 

    },

    ClickReceive() {
        if(Global.QuestPopup.isPlayEffect)
            return;
        this.btnReceive.interactable = false;
        Global.QuestPopup.isPlayEffect = true;

        if(this.isSuccess) {
            let data = {};
            data[1] = this.id;
    
            require("SendRequest").getIns().MST_Client_Event_Mission_Daily_Get_Take_Account_Reward(data);
            // require("SendRequest").getIns().MST_Client_Event_Mission_Daily_Get_List_Reward_Account();
            Global.QuestPopup.cacheView = this;
        }
    },

    ClickPlay() {
        require("ScreenManager").getIns().roomType = this.gameType;
        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
        Global.QuestPopup.Hide();
    },

    ShowEffect(accountBalance) {
        let questPopup = Global.QuestPopup;
        if(Global.ContentMoneyView) {
            Global.ContentMoneyView.node.parent = questPopup.posMoney;
            Global.ContentMoneyView.node.setPosition(cc.v2(0,0));
        }
        
        questPopup.scroll.enabled = false;
        let sPos = this.ParsePosition(this.btnMax, 4);
        let countItem = 0;
        for(let i = 0; i < 5; i++) {
            this.scheduleOnce(()=>{
                let p1 = cc.v2(sPos.x,sPos.y);
                let p3 = cc.v2(questPopup.nodeEnd.x, questPopup.nodeEnd.y);
                let p2  = cc.v2(0,0);
                p2.x = p1.x + 200;
                p2.y = p1.y + 100;

                var bezier = [p1,p2,p3];
                var bezierTo = cc.bezierTo(1, bezier);
                questPopup.listCoin[i].active = true;
                questPopup.listCoin[i].setPosition(sPos);
                let action = cc.callFunc(()=>{questPopup.listCoin[i].active = false});
                questPopup.listCoin[i].runAction(cc.sequence(bezierTo, action ));
            } , 0.15 * countItem);
            countItem += 1;
        }
        this.scheduleOnce(()=>{
            
            require("WalletController").getIns().UpdateWallet (accountBalance);
            let lbMoneyContent = Global.ContentMoneyView.node.getComponentInChildren(cc.Label);
            if(lbMoneyContent != null) {
                lbMoneyContent.node.scale = 2;
                lbMoneyContent.node.runAction(cc.scaleTo(0.3, 1));
            }
            this.anim.node.runAction(cc.moveTo(0.5, cc.v2(-770,0)));
        } ,2.5);
        
        this.scheduleOnce(()=>{
            let index = 0;
            Global.ContentMoneyView.BackToParent();
            for(let i = 0; i < questPopup.listQuestView.length; i++) {
                if(questPopup.listQuestView[i].missionId == this.missionId) {
                    
                    index = i;
                    break;
                }
            }
            for(let i = index+1; i < questPopup.listQuestView.length; i++) {
                questPopup.listQuestView[i].anim.node.runAction(cc.moveTo(0.2, cc.v2(questPopup.listQuestView[i].anim.node.x, 113)));
            }
            this.scheduleOnce(()=>{
                for(let i = index; i < questPopup.listQuestView.length-1; i++) {
                    questPopup.listQuestView[i] = questPopup.listQuestView[i+1];
                }
                questPopup.listQuestView.length -= 1;
                this.node.destroy();
                for(let i = index; i < questPopup.listQuestView.length; i++) {
                    questPopup.listQuestView[i].anim.node.y = 0;
                }
                questPopup.scroll.enabled = true;
                Global.QuestPopup.isPlayEffect = false;
                
            } ,0.2);
        } ,3);
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
