cc.Class({
    extends: cc.Component,
    ctor() {
        this.isRunTime = false;
        this.countTime = 0;
        this.shareRewardId = 0;
        this.gameId = 0;
        this.startPos = null;
        this.endPos = null;
    },

    properties: {
        lbNameGame : cc.Label,
        lbNameUser : cc.Label,
        lbMoney : cc.Label,
        lbTime : cc.Label,
        ava : cc.Sprite,
        nation : cc.Sprite,
        btnReceive : cc.Button,

        startNode : cc.Node,
		posMoney : cc.Node,
		listCoin : [cc.Node],
    },

    onLoad() {
        this.startPos = cc.v2(cc.winSize.width/2+this.node.width/2+90, cc.winSize.height/2-this.node.height/2-30)
        this.endPos = cc.v2(cc.winSize.width/2-this.node.width/2-30, cc.winSize.height/2-this.node.height/2-30)
    },

    ClickReceive() {
        let data = {};
		data[1] = this.shareRewardId;
		require("SendRequest").getIns().MST_Client_Share_Money_Take_Reward(data);
        this.isRunTime = false;
    },

    show(gameId = -1) {
        cc.log("show share:"+gameId);
        this.gameId = gameId
        this.btnReceive.interactable = false;
        this.node.setPosition(this.startPos);
        if(Global.isChallenge == 0 && Global.dataBattle == null && Global.RpgConfig == null) {
            require("SendRequest").getIns().MST_Client_Share_Money_Get_Reward();
        } else {
            this.node.active = false;
        }
       
    },

    GetReward(shareRewardId, gameId, shareMoney) {
        if(this.gameId != -1)
            gameId = this.gameId;
        Global.Helper.LogAction("click share money:"+gameId+"   "+this.gameId);
        this.shareRewardId = shareRewardId;
        this.gameId = gameId;
        this.lbNameGame.string = Global.MyLocalization.GetText("SLOT_"+gameId);
        this.lbMoney.string = Global.Helper.formatNumber(shareMoney);
        let user = this.GetUser();
        this.lbNameUser.string = user.Nickname;
        Global.Helper.GetAvataOtherById(this.ava, user.AccountId);
        Global.Helper.GetNationRandom(this.nation, user.AccountId);
        this.node.runAction(cc.moveTo(0.4, this.endPos));
        
        this.scheduleOnce(()=>{
            this.btnReceive.interactable = true;
            this.countTime = 15;
            this.isRunTime = true;
        } , 0.4);
    },

    GetUser() {
        let check = true;
        let user = null;
        if(Global.infoLoginCollecsion != null && Global.infoLoginCollecsion.length > 20) {
            while(check) {
                user = Global.infoLoginCollecsion[Global.RandomNumber(0,Global.infoLoginCollecsion.length)];
                if(user.AccountId != Global.MainPlayerInfo.accountId) {
                    check = false;
                }
            }
        } else {
            let indexUser = Global.RandomNumber(1000,100000);
            let check2 = false;
            let nameBot = "";
            while(!check2) {
                let r = Global.RandomNumber(0,100);
                if(r < 0) {
                    if(Global.listDataBigWinLive != null && Global.listDataBigWinLive.length > 0) {
                        let data = Global.listDataBigWinLive[Global.RandomNumber(0, Global.listDataBigWinLive.length)];
                        nameBot = data.Nickname;
                    }
                } else {
                    nameBot = Global.Helper.GetNameNation(indexUser) +"_User"+indexUser;
                }
                if(nameBot != Global.MainPlayerInfo.nickName) {
                    check2 = true;
                }
            }
            user = {
                AccountId : indexUser,
                Nickname : nameBot,
            };
        }
        return user;
    },

    hide() {
        this.btnReceive.interactable = false;
        this.node.runAction(cc.moveTo(0.4, this.startPos));
        this.scheduleOnce(()=>{
            this.gameId = -1;
        } , 0.4);
    },

    ShowEffect(accountBalance) {
        let nodeEnd = this.startNode;
        if(Global.ContentMoneyView) {
            Global.changeParent(Global.ContentMoneyView.node, this.posMoney);
            nodeEnd = Global.ContentMoneyView.node.children[0].getPosition().add(Global.ContentMoneyView.node.getPosition());
        }
        this.btnReceive.interactable = false;
        let sPos = this.startNode;
        let countItem = 0;
        for(let i = 0; i < 10; i++) {
            this.scheduleOnce(()=>{
                let p1 = cc.v2(sPos.x, sPos.y);
                let p3 = cc.v2(nodeEnd.x+100, nodeEnd.y-50);
                let p2  = cc.v2(0,0);
                p2.x = p1.x - 700;
                p2.y = p1.y - 100;
                var bezier = [p1,p2,p3];
                var bezierTo = cc.bezierTo(1, bezier);
                this.listCoin[i].active = true;
                this.listCoin[i].setPosition(this.startNode.getPosition());
                let action = cc.callFunc(()=>{this.listCoin[i].active = false});
                this.listCoin[i].runAction(cc.sequence(bezierTo, action ));
            } , 0.15 * countItem);
            countItem += 1;
        }
        this.scheduleOnce(()=>{
            require("WalletController").getIns().UpdateWallet (accountBalance);
            if(Global.ContentMoneyView) {
				let lbMoneyContent = Global.ContentMoneyView.node.getComponentInChildren(cc.Label);
				if(lbMoneyContent != null) {
					lbMoneyContent.node.scale = 2;
					lbMoneyContent.node.runAction(cc.scaleTo(0.3, 1));
				}
			}
        } ,2.5);
        this.scheduleOnce(()=>{
            Global.ContentMoneyView.BackToParent();
            if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
                if(this.gameId == Global.SlotNetWork.slotView.slotType) {
                    this.hide();
                    return;
                }
            }
            require("ScreenManager").getIns().roomType = this.gameId;
            this.node.active = false;
            require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.INGAME_SLOT);
        } ,3);
    },

    update(dt) {
        if(this.isRunTime) {
            this.countTime -= dt;
            if(this.countTime <= 0) {
                this.countTime = 0;
                this.isRunTime = false;
                this.hide();
                let timeWait = 99999;
                if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
                    timeWait = Global.RandomNumber(80,180);
                } else if (require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY) {
                    timeWait = Global.RandomNumber(10,21);
                }
                this.scheduleOnce(()=>{
                    Global.UIManager.ShowShareMoney();
                } , timeWait);
            }
            this.lbTime.string = parseInt(this.countTime)+"s";
        }
    },

    onDestroy() {
        Global.ShareMoney = null;
    },
});
