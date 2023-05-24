cc.Class({
	extends: cc.Component,

	ctor() {
		this.listEventEnter = [];
		this.listEditBoxCurret = [];
		this.currentIndexEdb = 0;
		this.currentIndexBanner = 0;
		this.countTimeOut = 0;
		this.isCountTime = false;
		this.listPopup = {};
	},

	properties: {
		parentMiniGame: cc.Node,
		parentPopup: cc.Node,
		mark: cc.Node,
		miniLoading: require("MiniLoading"),
		loading: require("LoadingPopup"),
		animAlert : cc.Animation,
		_listCpNeedTime: [],
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	preLoadPopupInRes(funNext) {
		this.preLoadFolder("Popup", funNext);
	},

	preLoadPrefab(url) {
		// Global.Bundle.preload(url, cc.Prefab);
	},

	preLoadFolder(url, funNext) {
	// 	console.log("checkk preload:"+Global.Bundle);
	// 	Global.Bundle.preload(url,
	// 	(count, total) => {
	// 		// this.progressLoading(count / total);
	// 	}, (err, listAset) => {
	// 		cc.log("chay vao load xong roi")
	// 		funNext();
	// 	})
	funNext();
	},

	showCommandPopup(message, event) {
		if (Global.CommandPopup == null && !this.listPopup["CommandPopup"]) {
			this.listPopup["CommandPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("CommandPopup","CommandPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("CommandPopup");
				Global.CommandPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(message, event);
			},2);
		} else {
			if(Global.CommandPopup != null && !Global.CommandPopup.node.active) {
				Global.UIManager.showMark();
				Global.CommandPopup.show(message, event);
			}
		}
		
	},

	showNotifyPopup(gameId, event) {
		if (Global.NotifyPopup == null && !this.listPopup["NotifyPopup"]) {
			this.listPopup["NotifyPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("NotifyPopup","NotifyPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("NotifyPopup");
				Global.NotifyPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(gameId, event);
			},2)
		} else {
			if(Global.NotifyPopup != null && !Global.NotifyPopup.node.active) {
				Global.UIManager.showMark();
				Global.NotifyPopup.show(gameId, event);
			}
		}
	},

	showConfirmPopup(message, yesEvent, noEvent = null) {
		if (Global.ConfirmPopup == null && !this.listPopup["ConfirmPopup"]) {
			this.listPopup["ConfirmPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("CommandPopup","ConfirmPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("ConfirmPopup");
				Global.ConfirmPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(message, yesEvent, noEvent);
			},2)
		} else {
			if(Global.ConfirmPopup != null && !Global.ConfirmPopup.node.active) {
				Global.UIManager.showMark();
				Global.ConfirmPopup.show(message, yesEvent, noEvent);
			}
		}
	},

	
	showTimeConfirmPopup(message, time, gameId, yesEvent, noEvent = null) {
		if (Global.ConfirmPopup == null && !this.listPopup["ConfirmPopup"]) {
			this.listPopup["ConfirmPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("CommandPopup","ConfirmPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("ConfirmPopup");
				Global.ConfirmPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.showTime(message, time, gameId, yesEvent, noEvent);
			},2)
		} else {
			if(Global.ConfirmPopup != null && !Global.ConfirmPopup.node.active) {
				Global.UIManager.showMark();
				Global.ConfirmPopup.showTime(message, time, gameId, yesEvent, noEvent);
			}
		}
	},

	

	showNotifyRewardPopup(money, rewardDescription, currentAccountBalance) {
		if (Global.NotifyRewardPopup == null && !this.listPopup["NotifyRewardPopup"]) {
			this.listPopup["NotifyRewardPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("7LoginPopup","PopupNotifyReward", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("NotifyRewardPopup");
				Global.NotifyRewardPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.Show(money, rewardDescription, currentAccountBalance);
			},2)
		} else {
			if(Global.NotifyRewardPopup != null && !Global.NotifyRewardPopup.node.active) {
				Global.UIManager.showMark();
				Global.NotifyRewardPopup.Show(money, rewardDescription, currentAccountBalance);
			}
		}
	},


	HideShopPopup() {
		if(Global.ShopPopup != null && Global.ShopPopup.node.active == true)
			Global.ShopPopup.onClickClose();
	},

	


	ShowSupportPopup() {
		if (Global.SupportPopup == null && !this.listPopup["SupportPopup"]) {
			this.listPopup["SupportPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("SupportPopup","SupportPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("SupportPopup");
				Global.SupportPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.SupportPopup != null && !Global.SupportPopup.node.active) {
				Global.UIManager.showMark();
				Global.SupportPopup.show();
			}
		}
	},

	





	ShowSetNamePopup(name, event) {
		if (Global.SetNamePopup == null && !this.listPopup["SetNamePopup"]) {
			this.listPopup["SetNamePopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("SetNamePopup","SetNamePopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("SetNamePopup");
				Global.SetNamePopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(name, event);
			},2)
		} else {
			if(Global.SetNamePopup != null && !Global.SetNamePopup.node.active) {
				Global.UIManager.showMark();
				Global.SetNamePopup.show(name, event);
			}
		}
	},

	ShowGratefulPopup() {
		if (Global.GratefulPopup == null && !this.listPopup["GratefulPopup"]) {
			this.listPopup["GratefulPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("GratefulPopup","GratefulPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("GratefulPopup");
				Global.GratefulPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.GratefulPopup != null && !Global.GratefulPopup.node.active) {
				Global.UIManager.showMark();
				Global.GratefulPopup.show();
			}
		}
	},



	showToast(message) {
		if (!Global.Toast) {
			Global.Bundle.load("Popup/Toast", cc.Prefab, (err, prefab) => {
				let item = cc.instantiate(prefab).getComponent("ToastUI");
				Global.Toast = item;
				Global.UIManager.node.addChild(item.node);
				item.show(message);
			})
		} else {
			Global.Toast.show(message);
		}
	},

	showMiniLoading() {
		this.isCountTime = true;
		this.countTimeOut = 0;
		this.miniLoading.node.active = true;
	},

	hideMiniLoading() {
		this.isCountTime = false;
		this.miniLoading.node.active = false;
	},

	showLoading() {
		this.isCountTime = true;
		this.countTimeOut = 0;
		this.loading.node.active = true;
		cc.log("show loading");
	},

	hideLoading() {
		this.isCountTime = false;
		this.loading.node.active = false;
		cc.log("hide loading");
	},

	showAlertMini(text) {
		this.animAlert.getComponentInChildren(cc.Label).string = text;
		this.animAlert.play();
	},

	showMark() {
		this.mark.active = true;
	},

	hideMark() {
		for (var i = 0; i < this.parentPopup.children.length; i++) {
			if (this.parentPopup.children[i].active == true) {
				return;
			}
		}
		this.mark.active = false;
	},

	ShowTogetherConfirmMessenge(content, confirmCode) {
		//0-NONE, 1-SHOW_SHOP, 2-DEFAULT, 3-CLOSE_SHOP, 4-OUT_GAME, 5-SHOW_MAIL
		if (confirmCode == 5) {
			if (Global.GameConfig.FeatureConfig.MailFeature != Global.Enum.EFeatureStatus.Open)
				return;
		}
		let actionCall = null;
		let actionCancle = null;
		let isShowConfirm = false;
		switch (confirmCode) {
		case 1://show shop
			actionCall = () => {this.showShopPopup()};
			actionCancle = this.CallLeave;
			isShowConfirm = true;
			break;
		case 0://none
			actionCall = this.CallLeave;
			isShowConfirm = false;
			break;
		case 2://default
			actionCall = null;
			isShowConfirm = false;
			break;
		case 3://close shop
			actionCall = this.HideShopPopup;
			isShowConfirm = false;
			break;
		case 4://out game
			actionCall = this.OutGame;
			isShowConfirm = false;
			break;
		case 5://show mail
			actionCall = this.showMailPopup;
			isShowConfirm = true;
			break;
		default:
			actionCall = null;
			break;
		}
		if (isShowConfirm) {
			this.showConfirmPopup (Global.MyLocalization.GetText(content), actionCall, actionCancle);
		} else {
			this.showCommandPopup (Global.MyLocalization.GetText(content), actionCall);
		}
	},

	CallLeave() {
		if(require("ScreenManager").getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS && Global.isConnect) {
			require("SendRequest").getIns().MST_Client_LeaveRoom();
		} else {
			require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
		}
	},

	OutGame() {
		if (Global.isConnect) {
			Global.NetworkManager.OnDisconnect ();
		}
		require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
	},

	start() { 
		this.parentMiniGame.setSiblingIndex(0);
		
	},

	addEventHideTime(component) {
		if (this._listCpNeedTime.indexOf(component) === -1) {
			this._listCpNeedTime.push(component);
		}
	},
	removeEventHideTime(component) {
		let index = this._listCpNeedTime.indexOf(component);
		if (index > -1) {  
			this._listCpNeedTime.splice(index, 1);
		}
	},

	onEventEnter(fun) {
		this.listEventEnter.unshift(fun);
	},
	offEventEnter(fun) {
		let index = this.listEventEnter.indexOf(fun);
		if (index != -1)
			this.listEventEnter.splice(index, 1);
	},

	
	onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.enter:
				cc.log("enter");
                if (this.listEventEnter.length > 0)
                    this.listEventEnter[0].call();
                break;
            default:
                break;
        }
        
    },

	onLoad() {
		Global.UIManager = this;
		cc.game.setFrameRate(100);
		cc.game.on(cc.game.EVENT_HIDE, ()=>{
			cc.game.setFrameRate(10);
            const step = () => {
                cc.game.step();
                setTimeout(step, 1000);
            }
            this.eventHide = setTimeout(step, 1000);
        })
        
        cc.game.on(cc.game.EVENT_SHOW, ()=>{
            clearTimeout(this.eventHide);
			cc.game.setFrameRate(100);
        })
		if (cc.sys.isBrowser && !cc.sys.isMobile) {
            document.addEventListener('keydown', (e) => {
                Global.UIManager.onKeyDown(e);
            });
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
	},

	onDestroy() {
		Global.UIManager = null;
	},

	 update (dt) {
		if(this.isCountTime) {
			this.countTimeOut += dt;
			if(this.countTimeOut >= 15) {
				this.countTimeOut = 0;
				this.hideMiniLoading();
				this.hideLoading();
				this.showCommandPopup(Global.MyLocalization.GetText("NOT_LOAD_INFO"), null);
			}
		}
	 },
});
