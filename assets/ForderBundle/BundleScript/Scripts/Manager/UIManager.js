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

	showConfirmAdsPopup(message, yesEvent, noEvent = null) {
		if (Global.ConfirmAdsPopup == null && !this.listPopup["ConfirmAdsPopup"]) {
			this.listPopup["ConfirmAdsPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("CommandPopup","ConfirmAdsPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("ConfirmAdsPopup");
				Global.ConfirmAdsPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(message, yesEvent, noEvent);
			},2)
		} else {
			if(Global.ConfirmAdsPopup != null && !Global.ConfirmAdsPopup.node.active) {
				Global.UIManager.showMark();
				Global.ConfirmAdsPopup.show(message, yesEvent, noEvent);
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

	ShowGratefulBillingPopup(){
		if (Global.GratefulBilling == null && !this.listPopup["GratefulBillingPopup"]) {
			this.listPopup["GratefulBillingPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("GratefulBillingPopup","GratefulBillingPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("GratefulBillingPopup");
				Global.GratefulBilling = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2);
		} else {
			Global.UIManager.showMark();
			Global.GratefulBilling.show();
		}
	},

	showShopPopup(isShop = true) {
		if (Global.ShopPopup == null && !this.listPopup["ShopPopup"]) {
			this.listPopup["ShopPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("ShopPopup","ShopPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("ShopPopup");
				Global.ShopPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(isShop);
			},2);
		} else {
			if(Global.ShopPopup != null && !Global.ShopPopup.node.active) {
				Global.UIManager.showMark();
				Global.ShopPopup.show(isShop);
			}
		}
	},

	showPopupCardIn(nspType, cardMoney, yesEvent) {
		if (Global.PopupCardIn == null && !this.listPopup["PopupCardIn"]) {
			this.listPopup["PopupCardIn"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("PopupCardIn","PopupCardIn", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("PopupCardIn");
				Global.PopupCardIn = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(nspType, cardMoney, yesEvent);
			},2)
		} else {
			if(Global.PopupCardIn != null && !Global.PopupCardIn.node.active) {
				Global.UIManager.showMark();
				Global.PopupCardIn.show(nspType, cardMoney, yesEvent);
			}
		}
	},

	showSalePopup() {
		if (Global.SalePopup == null && !this.listPopup["SalePopup"]) {
			this.listPopup["SalePopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("SalePopup","SalePopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				let item = cc.instantiate(prefab).getComponent("SalePopup");
				Global.SalePopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.SalePopup != null && !Global.SalePopup.node.active) {
				Global.SalePopup.show();
			}
		}
	},

	showMailPopup() {
		if (Global.MailPopup == null && !this.listPopup["MailPopup"]) {
			this.listPopup["MailPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("MailPopup","MailPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("MailPopup");
				Global.MailPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.MailPopup != null && !Global.MailPopup.node.active) {
				Global.UIManager.showMark();
				Global.MailPopup.show();
			}
		}
	},

	showGacha() {
		if (Global.Gacha == null && !this.listPopup["Gacha"]) {
			this.listPopup["Gacha"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("GachaPopup","GachaUI", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("GachaUi");
				Global.Gacha = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.Show(1);
			},2)
		} else {
			if(Global.Gacha != null && !Global.Gacha.node.active) {
				Global.UIManager.showMark();
				Global.Gacha.Show(1);
			}
		}
	},

	showGachaEvent(roomId = 0) {
		if (Global.GachaEvent == null && !this.listPopup["GachaEvent"]) {
			this.listPopup["GachaEvent"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("GachaEvent","GachaUI", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("GachaEvent");
				Global.GachaEvent = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.Show(roomId);
			},2)
		} else {
			if(Global.GachaEvent != null && !Global.GachaEvent.node.active) {
				Global.UIManager.showMark();
				Global.GachaEvent.Show(roomId);
			}
		}
	},

	SetInfoGacha(listInfo){
		if (Global.Gacha == null && !this.listPopup["Gacha"]) {
			this.listPopup["Gacha"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("GachaPopup","GachaUI", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("GachaUi");
				Global.Gacha = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.SetListInfo(listInfo);
			},2)
		} else {
			if(Global.Gacha != null) {
				Global.UIManager.showMark();
				Global.Gacha.SetListInfo(listInfo);
			}
		}
	},

	showBag() {
		if (Global.BagPopup == null && !this.listPopup["BagPopup"]) {
			this.listPopup["BagPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("BagPopup","BagUI", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("BagPopup");
				Global.BagPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.BagPopup != null && !Global.BagPopup.node.active) {
				Global.UIManager.showMark();
				Global.BagPopup.show();
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

	showHelpPopup() {
		if(CONFIG.MERCHANT == 3 || CONFIG.MERCHANT == 1){
			this.showNewHelpPopup();
			return;
		}
		if (Global.HelpPopup == null && !this.listPopup["HelpPopup"]) {
			this.listPopup["HelpPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("Fish","PopupHelp", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("HelpPopup");
				Global.HelpPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.HelpPopup != null && !Global.HelpPopup.node.active) {
				Global.UIManager.showMark();
				Global.HelpPopup.show();
			}
		}
	},

	showNewHelpPopup(){
		let index = 1;
		if(CONFIG.MULTI_PLAYER)
			index = 3;
		if (Global.HelpFishNew == null && !this.listPopup["HelpFishNew"]) {
			this.listPopup["HelpFishNew"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("HelpFishPopup","HelpFishPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("HelpFishPopup");
				Global.HelpFishNew = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(index);
			},2)
		} else {
			if(Global.HelpFishNew != null && !Global.HelpFishNew.node.active) {
				Global.UIManager.showMark();
				Global.HelpPopup.show(index);
			}
		}
	},

	showPigBankPopup(value) {
		if (Global.PigBankPopup == null && !this.listPopup["PigBankPopup"]) {
			this.listPopup["PigBankPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("PigBankPopup","PigBankPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("PigBankPopup");
				Global.PigBankPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(value);
			},2)
		} else {
			if(Global.PigBankPopup != null && !Global.PigBankPopup.node.active) {
				Global.UIManager.showMark();
				Global.PigBankPopup.show(value);
			}
		}
	},

	showLevelPopup(value, level, event) {
		if (Global.LevelPopup == null && !this.listPopup["LevelPopup"]) {
			this.listPopup["LevelPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("LevelPopup","LevelPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				if(Global.LevelPopup == null || Global.LevelPopup.node == null) {
					let item = cc.instantiate(prefab).getComponent("LevelPopup");
					Global.LevelPopup = item;
					Global.UIManager.parentPopup.addChild(item.node);
					item.show(value, level, event);
				}
			},2)
		} else {
			if(Global.LevelPopup != null && !Global.LevelPopup.node.active) {
				Global.UIManager.showMark();
				Global.LevelPopup.show(value, level, event);
			}
		}
		this.showMark();
	},

	showCollectionPopup() {
		if (Global.CollectionPopup == null && !this.listPopup["CollectionPopup"]) {
			this.listPopup["CollectionPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("Collection","CollectionPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("CollectionPopup");
				Global.CollectionPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.CollectionPopup != null && !Global.CollectionPopup.node.active) {
				Global.UIManager.showMark();
				Global.CollectionPopup.show();
			}
		}
	},

	showLuckyCardPopup() {
		if (Global.LuckyCardPopup == null && !this.listPopup["LuckyCardPopup"]) {
			this.listPopup["LuckyCardPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("LuckyCard","LuckyCardPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("LuckyCardPopup");
				Global.LuckyCardPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.LuckyCardPopup != null && !Global.LuckyCardPopup.node.active) {
				Global.UIManager.showMark();
				Global.LuckyCardPopup.show();
			}
		}
	},

	showLoginGiftAdsPopup() {
		if (Global.LoginGiftAdsPopup == null && !this.listPopup["LoginGiftAdsPopup"]) {
			this.listPopup["LoginGiftAdsPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("LoginGiftAdsPopup","LoginGiftAdsPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("LoginGiftAdsPopup");
				Global.LoginGiftAdsPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.LoginGiftAdsPopup != null && !Global.LoginGiftAdsPopup.node.active) {
				Global.UIManager.showMark();
				Global.LoginGiftAdsPopup.show();
			}
		}
	},

	showRandomMissionPopup() {
		if (Global.RandomMissionPopup == null && !this.listPopup["RandomMissionPopup"]) {
			this.listPopup["RandomMissionPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("RandomMissionPopup","RandomMissionPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("RandomMissionPopup");
				Global.RandomMissionPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.RandomMissionPopup != null && !Global.RandomMissionPopup.node.active) {
				Global.UIManager.showMark();
				Global.RandomMissionPopup.show();
			}
		}
	},

	showTutorialPopup(isNextQuest = false, gameId = 0, missionGroup = 0) {
		if (Global.TutorialPopup == null && !this.listPopup["TutorialPopup"]) {
			this.listPopup["TutorialPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("TutorialPopup","PopupTutorial", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("TutorialPopup");
				Global.TutorialPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(isNextQuest, gameId, missionGroup);
			},2)
		} else {
			if(Global.TutorialPopup != null && !Global.TutorialPopup.node.active) {
				Global.UIManager.showMark();
				Global.TutorialPopup.show(isNextQuest, gameId, missionGroup);
			}
		}
	},

	showPopupLily(text, action, action2, showClose = false) {
		if (Global.PopupLily == null && !this.listPopup["PopupLily"]) {
			this.listPopup["PopupLily"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("TutorialPopup","PopupLily", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				let item = cc.instantiate(prefab).getComponent("PopupLily");
				Global.PopupLily = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(text, action,action2, showClose);
			},2)
		} else {
			if(Global.PopupLily != null && !Global.PopupLily.node.active) {
				Global.PopupLily.show(text, action,action2, showClose);
			}
		}
	},

	showSuccessTutorialPopup(event, gameId) {
		if (Global.SuccessTutorialPopup == null && !this.listPopup["SuccessTutorialPopup"]) {
			this.listPopup["SuccessTutorialPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("TutorialPopup","PopupSuccess", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("SuccessTutorialPopup");
				Global.SuccessTutorialPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(event, gameId);
			},2)
		} else {
			if(Global.SuccessTutorialPopup != null && !Global.SuccessTutorialPopup.node.active) {
				Global.UIManager.showMark();
				Global.SuccessTutorialPopup.show(event, gameId);
			}
		}
	},

	showBattlePopup(id) {
		if (Global.BattlePopup == null && !this.listPopup["BattlePopup"]) {
			this.listPopup["BattlePopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("Battle","BattlePopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("BattlePopup");
				Global.BattlePopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(id);
			},2)
		} else {
			if(Global.BattlePopup != null && !Global.BattlePopup.node.active) {
				Global.UIManager.showMark();
				Global.BattlePopup.show(id);
			}
		}
	},

	showEndBattlePopup(battleManager, status, reward, accountBalance) {
		if (Global.EndBattlePopup == null && !this.listPopup["EndBattlePopup"]) {
			this.listPopup["EndBattlePopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("Battle","EndBattlePopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("EndBattlePopup");
				Global.EndBattlePopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(battleManager, status, reward, accountBalance);
			},2)
		} else {
			if(Global.EndBattlePopup != null && !Global.EndBattlePopup.node.active) {
				Global.UIManager.showMark();
				Global.EndBattlePopup.show(battleManager, status, reward, accountBalance);
			}
		}
	},

	showEndRpgPopup(battleManager, status, reward, accountBalance) {
		if (Global.EndRpgPopup == null && !this.listPopup["EndRpgPopup"]) {
			this.listPopup["EndRpgPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("27","EndRpgPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("EndRpgPopup");
				Global.EndRpgPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(battleManager, status, reward, accountBalance);
			},2)
		} else {
			if(Global.EndRpgPopup != null && !Global.EndRpgPopup.node.active) {
				Global.UIManager.showMark();
				Global.EndRpgPopup.show(battleManager, status, reward, accountBalance);
			}
		}
	},

	showCreateRoomBatlePopup() {
		if (Global.CreateRoomBatlePopup == null && !this.listPopup["CreateRoomBatlePopup"]) {
			this.listPopup["CreateRoomBatlePopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("Battle","CreateRoomBatlePopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("CreateRoomBatlePopup");
				Global.CreateRoomBatlePopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.CreateRoomBatlePopup != null && !Global.CreateRoomBatlePopup.node.active) {
				Global.UIManager.showMark();
				Global.CreateRoomBatlePopup.show();
			}
		}
	},

	HideShopPopup() {
		if(Global.ShopPopup != null && Global.ShopPopup.node.active == true)
			Global.ShopPopup.onClickClose();
	},

	showLoginGiftPopup(continuousLogin_Reward_List, login_Reward_List, beforeBonueValueBalance, continuousLoginRewardValue, afterAcceptContinuousLoginRewardBalance, loginRewardValue, afterAcceptLoginRewardBalance, LoginDayCounter, ContinuousLoginDayCounter, bonusMoneyValue, vipBonusModel, EventGame_VipBonusConfig){
        if (Global.LoginGiftPopup == null && !this.listPopup["LoginGiftPopup"]) {
			this.listPopup["LoginGiftPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("7LoginPopup","7LoginPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
                let item = cc.instantiate(prefab).getComponent("LoginGiftPopup");
                Global.LoginGiftPopup = item;
                Global.UIManager.parentPopup.addChild(item.node);
                item.show(continuousLogin_Reward_List, login_Reward_List, beforeBonueValueBalance, continuousLoginRewardValue, afterAcceptContinuousLoginRewardBalance, loginRewardValue, afterAcceptLoginRewardBalance, LoginDayCounter, ContinuousLoginDayCounter, bonusMoneyValue, vipBonusModel, EventGame_VipBonusConfig);
            },2)
        } else {
			if(Global.LoginGiftPopup != null && !Global.LoginGiftPopup.node.active) {
				Global.UIManager.showMark();
				Global.LoginGiftPopup.show(continuousLogin_Reward_List, login_Reward_List, beforeBonueValueBalance, continuousLoginRewardValue, afterAcceptContinuousLoginRewardBalance, loginRewardValue, afterAcceptLoginRewardBalance, LoginDayCounter, ContinuousLoginDayCounter, bonusMoneyValue, vipBonusModel, EventGame_VipBonusConfig);
			}
        }
    },

	ShowBeanStackPopup(isFirst = false) {
		if (Global.BeanStackPopup == null && !this.listPopup["BeanStackPopup"]) {
			this.listPopup["BeanStackPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("Bean","BeanStackPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				let item = cc.instantiate(prefab).getComponent("BeanStackPopup");
				Global.BeanStackPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.Show(isFirst);
			},2)
		} else {
			if(Global.BeanStackPopup != null && !Global.BeanStackPopup.node.active) {
				Global.BeanStackPopup.Show(isFirst);
			}
		}
	},

	ShowGetMoneyPopup() {
	},

	ShowAdsPopup() {
	},

	ShowListInviteUser(userInRoom) {
		if (Global.PopupInviteSlot == null && !this.listPopup["BeanStPopupInviteSlotackPopup"]) {
			this.listPopup["PopupInviteSlot"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("Invite","PopupInvite", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("PopupInviteSlot");
				Global.PopupInviteSlot = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(userInRoom);
			},2)
		} else {
			if(Global.PopupInviteSlot != null && !Global.PopupInviteSlot.node.active) {
				Global.UIManager.showMark();
				Global.PopupInviteSlot.show(userInRoom);
			}
		}
	},

	ShowShareMoney(gameId = -1) {
		if (Global.ShareMoney == null && !this.listPopup["ShareMoney"]) {
			this.listPopup["ShareMoney"] = "1";
			Global.DownloadManager.LoadPrefab("ShareMoney","ShareMoney", (prefab)=>{
                let node = cc.instantiate(prefab);
                Global.ShareMoney = node.getComponent("ShareMoneySlot");
                Global.UIManager.parentMiniGame.addChild(node);
                Global.ShareMoney.show(gameId);
            });
        } else {
			if(Global.ShareMoney != null && !Global.ShareMoney.node.active) {
				Global.UIManager.showMark();
				Global.ShareMoney.show(gameId);
			}
        }
	},

	ShowFreeSpinAdsSlot() {
		if (Global.PopupFreeSpinAdsSlot == null && !this.listPopup["PopupFreeSpinAdsSlot"]) {
			this.listPopup["PopupFreeSpinAdsSlot"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("FreeSpinAds","PopupFreeSpinAdsSlot", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("PopupFreeSpinAdsSlot");
				Global.PopupFreeSpinAdsSlot = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.PopupFreeSpinAdsSlot != null && !Global.PopupFreeSpinAdsSlot.node.active) {
				Global.UIManager.showMark();
				Global.PopupFreeSpinAdsSlot.show();
			}
		}
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

	ShowLuckyMoney(luckyMoney, accountBalance) {
		if (Global.LuckyMoney == null && !this.listPopup["LuckyMoney"]) {
			this.listPopup["LuckyMoney"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("LuckyMoney","LuckyMoney", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("LuckyMoney");
				Global.LuckyMoney = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(luckyMoney, accountBalance);
			},2)
		} else {
			if(Global.LuckyMoney != null && !Global.LuckyMoney.node.active) {
				Global.UIManager.showMark();
				Global.LuckyMoney.show(luckyMoney, accountBalance);
			}
		}
	},

	showProfilePopup() {
		if (Global.ProfilePopup == null && !this.listPopup["ProfilePopup"]) {
			this.listPopup["ProfilePopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("ProfilePopup","ProfilePopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("ProfilePopup");
				Global.ProfilePopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.ProfilePopup != null && !Global.ProfilePopup.node.active) {
				Global.UIManager.showMark();
				Global.ProfilePopup.show();
			}
		}
	},

	showReferencePopup(m_friendId,m_referenceId,m_triAnTuanReward,m_referenceReward,m_takeTime){
		if(Global.ReferencePopup == null && !this.listPopup["ReferencePopup"])
		{
			cc.log("Global.ReferencePopup == null ");
			this.listPopup["ReferencePopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("ProfilePopup","ReferencePopup",(prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("ReferencePopup");
				Global.ReferencePopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(m_friendId,m_referenceId,m_triAnTuanReward,m_referenceReward,m_takeTime);
			},2)
		}
		else
		{
			if(Global.ReferencePopup != null && !Global.ReferencePopup.node.active)
			{
				Global.UIManager.showMark();
				Global.ReferencePopup.show();
			}
		}
	},

	ShowMissionDailyPopup(gameId, listReward) {
		if (Global.MissionDailyPopup == null && !this.listPopup["MissionDailyPopup"]) {
			this.listPopup["MissionDailyPopup"] = "1";
			Global.DownloadManager.LoadPrefab("MissionDailyPopup","MissionDailyPopup", (prefab)=>{
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("MissionDailyPopup");
				Global.PopupFreeSpinAdsSlot = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(gameId, listReward);
			},2)
		} else {
			if(Global.MissionDailyPopup != null && !Global.MissionDailyPopup.node.active) {
				Global.UIManager.showMark();
				Global.MissionDailyPopup.show(gameId, listReward);
			}
		}
	},

	ShowFreeBonusPopup(privateKey, config) {
		if (Global.FreeBonusPopup == null && !this.listPopup["FreeBonusPopup"]) {
			this.listPopup["FreeBonusPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("FreeBonusPopup","FreeBonusPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("FreeBonusPopup");
				Global.FreeBonusPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show(privateKey, config);
			},2)
		} else {
			if(Global.FreeBonusPopup != null && !Global.FreeBonusPopup.node.active) {
				Global.UIManager.showMark();
				Global.FreeBonusPopup.show(privateKey, config);
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

	ShowNewsPopup() {
		if (Global.NewsPopup == null && !this.listPopup["NewsPopup"]) {
			this.listPopup["NewsPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("NewsPopup","NewsPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("NewsPopup");
				Global.NewsPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.NewsPopup != null && !Global.NewsPopup.node.active) {
				Global.UIManager.showMark();
				Global.NewsPopup.show();
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

	ShowTutorialHelpPopup() {
		if (Global.TutorialHelp == null && !this.listPopup["TutorialHelp"]) {
			this.listPopup["TutorialHelp"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("TutorialHelp","TutorialHelp", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("TutorialHelpPopup");
				Global.TutorialHelp = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.TutorialHelp != null && !Global.TutorialHelp.node.active) {
				Global.TutorialHelp.show();
			}
		}
	},

	ShowTournamentFishIcon(time, tourId) {
		if (Global.TournamentFishIcon == null && !this.listPopup["TournamentFishIcon"]) {
			this.listPopup["TournamentFishIcon"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("PopupFish","TournamentFishIcon", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				let item = cc.instantiate(prefab).getComponent("TournamentFishIcon");
				Global.TournamentFishIcon = item;
				Global.UIManager.parentMiniGame.addChild(item.node);
				item.Show(time, tourId);
			},2)
		} else {
			if(Global.TournamentFishIcon != null && !Global.TournamentFishIcon.node.active) {
				Global.TournamentFishIcon.Show(time, tourId);
			}
		}
	},

	ShowTournamentFishPopup() {
		if (Global.TournamentFishPopup == null && !this.listPopup["TournamentFishPopup"]) {
			this.listPopup["TournamentFishPopup"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("PopupFish","TournamentFishPopup", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("TournamentFishPopup");
				Global.TournamentFishPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.show();
			},2)
		} else {
			if(Global.TournamentFishPopup != null && !Global.TournamentFishPopup.node.active) {
				Global.UIManager.showMark();
				Global.TournamentFishPopup.show();
			}
		}
	},

	showMiniMiner() {
		cc.log(Global.MiniMiner);
		cc.log(this.listPopup["MiniMiner"]);
		if (Global.MiniMiner == null && !this.listPopup["MiniMiner"]) {
			this.listPopup["MiniMiner"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("MiniMiner","MiniMiner", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				// Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("MiniMinerView");
				Global.MiniMiner = item;
				Global.UIManager.parentMiniGame.addChild(item.node);
				item.startGame();
			},2)
		} else {
			cc.log(Global.MiniMiner.node.active);
			if(Global.MiniMiner != null && !Global.MiniMiner.node.active) {
				// Global.UIManager.showMark();
				Global.MiniMiner.startGame();
			}
		}
	},

	showMiniPoker() {
		if (Global.MiniPoker == null && !this.listPopup["MiniPoker"]) {
			this.listPopup["MiniPoker"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("MiniPoker","MiniPoker", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				// Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("MiniPokerView");
				Global.MiniPoker = item;
				Global.UIManager.parentMiniGame.addChild(item.node);
				item.startGame();
			},2)
		} else {
			cc.log(Global.MiniPoker.node.active);
			if(Global.MiniPoker != null && !Global.MiniPoker.node.active) {
				// Global.UIManager.showMark();
				Global.MiniPoker.startGame();
			}
		}
	},

	showMiniSlot() {
		if (Global.MiniSlot == null && !this.listPopup["MiniSlot"]) {
			this.listPopup["MiniSlot"] = "1";
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("MiniSlot","MiniSlotView", (prefab)=>{
				Global.UIManager.hideMiniLoading();
				// Global.UIManager.showMark();
				let item = cc.instantiate(prefab).getComponent("MiniSlotView");
				Global.MiniSlot = item;
				Global.UIManager.parentMiniGame.addChild(item.node);
				// item.startGame();
			},2)
		} else {
			if(Global.MiniSlot != null && !Global.MiniSlot.node.active) {
				// Global.UIManager.showMark();
				Global.MiniSlot.node.active = true;
			}
		}
	},

	showButtonMiniGame() {
		if(CONFIG.MERCHANT == "3") {
			cc.log("-----------------showButtonMiniGame");
			if (Global.BtnMiniGame == null && !this.listPopup["ButtonMiniGame"]) {
				this.listPopup["ButtonMiniGame"] = "1";
				Global.DownloadManager.LoadPrefab("ButtonMiniGame","ButtonMiniGame", (prefab)=>{
					let item = cc.instantiate(prefab).getComponent("ButtonMiniGame");
					Global.BtnMiniGame = item;
					Global.UIManager.parentMiniGame.addChild(item.node);
					item.Init();
				},2)
			} else {
				if(Global.BtnMiniGame != null && !Global.BtnMiniGame.node.active) {
					Global.BtnMiniGame.Init();
				}
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
		this.showButtonMiniGame();
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

	checkShowMiniGame(cp, isResetPosition) {
		let length = this.parentMiniGame.childrenCount;
		let isReturn = false;
		for (let i = 0; i < length; i++) {
			if (this.parentMiniGame.children[i] == cp) {
				isReturn = true;
			} else {
				if(this.parentMiniGame.children[i].getComponent("DragMiniGame"))
					this.parentMiniGame.children[i].scale = 0.7;
			}
		}

		if (cp.parent != null) {
			cp.setSiblingIndex(length - 1);
			cp.scale = 1;
		}


		if (isResetPosition) cp.position = cc.v2(0, 0);
		return isReturn;
	},

	//rpg
	showFindRoomRpgPopup(data) {
		if (Global.FindRoomRpgPopup == null) {
			this.showMiniLoading();
			Global.DownloadManager.LoadPrefab("27","FindGameRpgPopup", (prefab)=>{
				let item = cc.instantiate(prefab).getComponent("SlotRpg_RoomPopup");
				Global.FindRoomRpgPopup = item;
				Global.UIManager.parentPopup.addChild(item.node);
				item.Show(data);
			})
		} else {
			Global.FindRoomRpgPopup.Show(data);
		}
		this.showMark();
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
