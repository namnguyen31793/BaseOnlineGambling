var ScreenManager = require("ScreenManager");

cc.Class({
    extends: cc.Component,
	ctor() {
		this.levelUnlock = [0,3,5,8,10,12,15];
		this.cacheReward = 0;
	},

    properties: {
		lbValue:cc.Label,
		anim : cc.Animation,
		lbLevel : cc.Label,
		lbContent : cc.RichText,
		btnGet : cc.Button,
		startNode : cc.Node,
		endNode : [cc.Node],
		posMoney : [cc.Node],
		listCoin : [cc.Node],
		animUnLock : cc.Animation,
		listNameFunc : [cc.SpriteFrame],
		imgNameFunc : cc.Sprite,
    },

    onClickClose(){
		console.log("on click close");
		this.node.active = false;
		Global.UIManager.hideMark();
		if(this.action != null) {
			this.action();
			this.action = null;
		}
	},
	
	show(reward, level, action){
		if(this.action == null)
			this.action = action;
		Global.UIManager.hideMiniLoading();
		this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
		this.lbLevel.string = this.GetTextLevel(level);
		this.anim.play();
		this.lbValue.string = "+"+Global.Helper.formatNumber(reward);
		this.reward = reward;
		// this.btnGet.interactable = true;
		let timeWait = 1;
		this.animUnLock.play("NotUnlockGun");
		this.scheduleOnce(()=>{
			let check = false;
			// if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
				// for(let i = 7; i < 11; i++) {
				// 	if(level == i) {
				// 		check = true;
				// 		Global.indexUnLock.push(level-6);
				// 		timeWait = 3;
				// 		this.animUnLock.play("UnlockGun");
				// 		this.imgNameFunc.spriteFrame = this.listNameFunc[level-6];
				// 		// this.lbContent.string = Global.Helper.formatString(Global.MyLocalization.GetText("UNLOCK_FEATURE"),[Global.MyLocalization.GetText("FEATURE_"+level)]);
				// 		break;
				// 	} 
				// }
			// } else if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
			// 	for(let i = 0; i < this.levelUnlock.length; i++) {
			// 		if(level == this.levelUnlock[i]) {
			// 			check = true;
			// 			timeWait = 3;
			// 			this.animUnLock.play("UnlockGun");
			// 			this.lbContent.string = Global.Helper.formatString(Global.MyLocalization.GetText("UNLOCK_GUN"),[Global.Helper.formatNumber(Global.gunConfigModelRoom1 [i].BulletPrice)]);
			// 			break;
			// 		} 
			// 	}
			// } 
			
			
			if(!check)
				this.animUnLock.play("NotUnlockGun");
			this.scheduleOnce(()=>{
				this.ClickGetReward();
				// this.btnSkip.active = true;
			} , timeWait);
		} , 0.5);
	},

    ClickGetReward() {
		// this.btnGet.interactable = false;
		require("SendRequest").getIns().MST_Client_Event_Level_System_Take_Reward();
		Global.LevelManager.OnGetReward();
	},

	ShowEffect(reward, accountBalance) {
		let endNode = this.endNode[0];
		let posMoney = this.posMoney[0];
		if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
			endNode = this.endNode[1];
			posMoney = this.posMoney[1];
		} else if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
			endNode = this.endNode[8];
			posMoney = this.posMoney[8];
			Global.GameLogic.mainActor.maxBalance = accountBalance;
		} 
		if(Global.ContentMoneyView) {
            Global.ContentMoneyView.node.parent = posMoney;
            Global.ContentMoneyView.node.setPosition(cc.v2(0,0));
        }
        let countItem = 0;
        for(let i = 0; i < 10; i++) {
            this.scheduleOnce(()=>{
                let p1 = cc.v2(this.startNode.x,this.startNode.y);
				let p3 = cc.v2(endNode.x, endNode.y);
				let p2  = cc.v2(0,0);
				p2.x = p1.x + 500;
				p2.y = p1.y + 150;
                var bezier = [p1,p2,p3];
				var bezierTo = cc.bezierTo(0.8, bezier);
                this.listCoin[i].active = true;
				this.listCoin[i].setPosition(this.startNode.getPosition());
                let action = cc.callFunc(()=>{this.listCoin[i].active = false});
                this.listCoin[i].runAction(cc.sequence(bezierTo, action ));
            } , 0.1 * countItem);
            countItem += 1;
        }
        this.scheduleOnce(()=>{
            if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.LOBBY || 
				ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.CITY) {
					require("WalletController").getIns().UpdateWallet (accountBalance);
			} else {
				if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS) {
					Global.GameLogic.UpdateBalane (Global.MainPlayerInfo.accountId, accountBalance,this.reward);
				} else if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT) {
					require("WalletController").getIns().UpdateWallet (accountBalance);
				}
			}
			if(Global.ContentMoneyView) {
				let lbMoneyContent = Global.ContentMoneyView.node.getComponentInChildren(cc.Label);
				if(lbMoneyContent != null) {
					lbMoneyContent.node.scale = 2;
					lbMoneyContent.node.runAction(cc.scaleTo(0.3, 1));
				}
			}
        } ,2);
		this.scheduleOnce(()=>{
			if(Global.ContentMoneyView) {
            	Global.ContentMoneyView.BackToParent();
			}
			this.onClickClose();
        } ,2.5);
	},

	GetTextLevel(level) {
		if(level < 10)
			return "0" + level;
		else return level.toString();
	},
	
	onDestroy(){
		Global.LevelPopup = null;
	},

    // update (dt) {},
});
