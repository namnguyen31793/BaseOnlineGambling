const DailyGameManager = require("../DailyGameManager");
cc.Class({
    extends: require("DailyGameView"),

    ctor() {
        this.winMoney = 0;
        this.accountBalance = 0;
    },

    properties: {
        iconItem : [cc.Sprite],
        spinItemObj : [cc.Node],
        iconMulti : [cc.Sprite],
        spinMultiObj : [cc.Node],
        frameItem : [cc.SpriteFrame],
        frameMulti : [cc.SpriteFrame],
        btnPlay : cc.Node,
        btnReceive : cc.Button,
        description : cc.Label,
        nodeStart : cc.Node,
        nodeEnd : cc.Node,
        posMoney : cc.Node,
        listCoin : [cc.Node],
    },

    SetData(winMoney, accountBalance, data) {
        this.winMoney = winMoney;
        this.accountBalance = accountBalance;
        this.btnPlay.active = false;
        this.btnReceive.interactable = false;
        let list = data.split(",");
        let rs = [];
        for(let i = 0; i < list.length; i++) {
            rs[i] = parseInt(list[i]);
        }
        for(let i = 0; i < this.iconItem.length; i++) {
            this.scheduleOnce(()=>{
                this.iconItem[i].node.active = false;
                this.iconItem[i].spriteFrame = this.frameItem[rs[2*i]-1];
                this.spinItemObj[i].active = true;
            } , i*0.2)
        }
        for(let i = 0; i < this.iconMulti.length; i++) {
            this.scheduleOnce(()=>{
                this.iconMulti[i].node.active = false;
                this.iconMulti[i].spriteFrame = this.frameMulti[rs[2*i+1]-10];
                this.spinMultiObj[i].active = true;
            } , this.iconItem.length * 0.2 + i*0.2)
        }
        let delayTimeSpin = this.iconItem.length * 0.2 + this.iconMulti.length * 0.2+1;
        for(let i = 0; i < this.iconItem.length; i++) {
            this.scheduleOnce(()=>{
                this.iconItem[i].node.active = true;
                this.iconItem[i].node.getComponent(cc.Animation).play();
                this.spinItemObj[i].active = false;
            } , delayTimeSpin + i*0.2)
        }
        for(let i = 0; i < this.iconMulti.length; i++) {
            this.scheduleOnce(()=>{
                this.iconMulti[i].node.active = true;
                this.iconMulti[i].node.parent.getComponent(cc.Animation).play();
                this.spinMultiObj[i].active = false;
            } , delayTimeSpin + this.iconItem.length * 0.2 + i*0.2)
        }
        let totalDelayTime = delayTimeSpin + this.iconItem.length * 0.2 + this.iconMulti.length * 0.2+0.5;
        this.scheduleOnce(()=>{
            this.btnReceive.interactable = true;
            let str = "(";
            for(let i = 0; i < rs.length; i++) {
                if(i == 3)
                    str += ")";
                str += this.ParseString(rs[i]);
            }
            str += "=";
            str += Global.Helper.formatNumber(winMoney);
            this.description.string = str;
        } , totalDelayTime )
    },

    ParseString(str) {
        if(str == 1)
            return "100";
        if(str == 2)
            return "50";
        if(str == 3)
            return "10";
        if(str == 10)
            return "+";
        if(str == 11)
            return "x";   
    },

    ClickPlay() {
        Global.Helper.LogAction("Click play Dao Vang");
        let data = {};
        this.type = 2;
		data[1] = this.type;
        data[40] = this.type;
        require("SendRequest").getIns().MST_Client_Play_Daily_Login_Game(data);
    },
    
    ClickReceive() {
        Global.Helper.LogAction("Click nhan thuong Dao Vang");
        let nodeEnd = this.nodeEnd.getPosition();
        if(Global.ContentMoneyView) {
            Global.changeParent(Global.ContentMoneyView.node, this.posMoney);
            nodeEnd = Global.ContentMoneyView.node.children[0].getPosition().add(Global.ContentMoneyView.node.getPosition());
        }
        this.btnReceive.interactable = false;
        let sPos = this.nodeStart;
        let countItem = 0;
        for(let i = 0; i < 10; i++) {
            this.scheduleOnce(()=>{
                let p1 = cc.v2(sPos.x, sPos.y);
                let p3 = cc.v2(nodeEnd.x, nodeEnd.y);
                let p2  = cc.v2(0,0);
                p2.x = p1.x + 200;
                p2.y = p1.y + 100;
                var bezier = [p1,p2,p3];
                var bezierTo = cc.bezierTo(1, bezier);
                this.listCoin[i].active = true;
                this.listCoin[i].setPosition(this.nodeStart.getPosition());
                let action = cc.callFunc(()=>{this.listCoin[i].active = false});
                this.listCoin[i].runAction(cc.sequence(bezierTo, action ));
            } , 0.15 * countItem);
            countItem += 1;
        }
        this.scheduleOnce(()=>{
            require("WalletController").getIns().UpdateWallet (this.accountBalance);
            let lbMoneyContent = Global.ContentMoneyView.node.getComponentInChildren(cc.Label);
            if(lbMoneyContent != null) {
                lbMoneyContent.node.scale = 2;
                lbMoneyContent.node.runAction(cc.scaleTo(0.3, 1));
            }
        } ,2.5);
        this.scheduleOnce(()=>{
            Global.ContentMoneyView.BackToParent();
            // this.btnClose.active = true;
            this.ClickClose();
        } ,3);
        
    },

    

    ClickClose() {
        let data = {};
        if(DailyGameManager.getIns().configFree) {
            data[1] = DailyGameManager.getIns().configFree.GameID;
            Global.UIManager.showNotifyPopup(DailyGameManager.getIns().configFree.GameID, ()=>{
                require("SendRequest").getIns().MST_Client_Reward_Spin_Take_Reward(data);
                require("ScreenManager").getIns().roomType = DailyGameManager.getIns().configFree.GameID;
		        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
            });
        }
        Global.LobbyView.showStartGame.Action();
		DailyGameManager.getIns().openGame = false;
        DailyGameManager.getIns().dailyGame = null;
        this.node.destroy();
    }
});
