cc.Class({
    extends: cc.Component,
    ctor() {
        this.listName = ["Lobby","7LoginPopup","BagPopup","CommandPopup","MailPopup","ShopPopup","SupportPopup","ShareMoney","ProfilePopup","NewsPopup","SetNamePopup","FreeBonusPopup","PopupCardIn","Config"];
        this.listName3 = ["Lobby","SupportPopup","MailPopup","CommandPopup","BagPopup","ShopPopup","PopupCardIn","NewsPopup","Config","SetNamePopup","ProfilePopup","7LoginPopup","ShareMoney","GratefulBillingPopup","InGameFishUI","TutorialHelp","HelpFishPopup"];
    },


    properties: {

    },

    LoadPrefab(bName, link, event, isLoading = 0) {
        if (!cc.sys.isNative) {
            cc.assetManager.loadBundle(this.GetNameByMerchant(bName), (err, bundle) => {
                bundle.load(link, function (count, total) {
                    if(isLoading > 0)
                        Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
                }, function (err, prefab) {
                    event(prefab);
                }.bind(this));
            });
		} else {
            Global.LoadBundleManager.LoadPrefab(this.GetNameByMerchant(bName), this.GetVersion(this.GetNameByMerchant(bName)), link, event, isLoading);
        }
    },

    LoadScene(bName, link, event, isLoading = 0) {
        if (!cc.sys.isNative) {
            cc.assetManager.loadBundle(this.GetNameByMerchant(bName), (err, bundle) => {
                bundle.loadScene(link, function (count, total) {
                    if(isLoading > 0)
                        Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
                }, function (err, scene) {
                    event(scene);
                }.bind(this));
            });
		} else {
            Global.LoadBundleManager.LoadScene(this.GetNameByMerchant(bName), this.GetVersion(this.GetNameByMerchant(bName)), link, event, isLoading);
        }
    },

    LoadAssest(bName, type, link, event, isLoading = 0) {
        if (!cc.sys.isNative) {
            cc.assetManager.loadBundle(this.GetNameByMerchant(bName), (err, bundle) => {
                bundle.load(link, type, function (count, total) {
                    if(isLoading > 0)
                        Global.DownloadManager.UpdatePercentLoad(count/total, isLoading);
                }, function (err, prefab) {
                    event(prefab);
                }.bind(this));
            });
		} else {
            Global.LoadBundleManager.LoadAssest(this.GetNameByMerchant(bName), this.GetVersion(this.GetNameByMerchant(bName)), type, link, event, isLoading);
        }
    },

    UpdatePercentLoad(percent, isLoading) {
        if(Global.UIManager)
            Global.UIManager.isCountTime = false;
        if(isLoading == 1) {
            Global.UIManager.loading.UpdateProgress(percent);
        } else if(isLoading == 2) {
            Global.UIManager.miniLoading.UpdateProgress(percent);
        } else if(isLoading == 3) {
            Global.ConfigScene.UpdateProgress(percent);
        }
    },

    SendTrackingStart(bundleName, version) {
        return;
        let dataSaveString = cc.sys.localStorage.getItem("LOAD_BUNDLE_"+bundleName) || "";
        if(dataSaveString.length > 0) {
            Global.Helper.LogAction("download bundle start:"+bundleName);
            return;
        } else {
            Global.Helper.LogAction("load object start:"+bundleName);
        }
        let currentTime = require("SyncTimeControl").getIns().GetCurrentTimeServer();
        if(currentTime < 1000000)
            currentTime = new Date().getTime();
        var data = {
            KeyFind : Global.MainPlayerInfo.accountId+"_"+bundleName+"_"+version,
            AccountId : Global.MainPlayerInfo.accountId,
            BundleName : bundleName,
            TypeSuccessed : false,
            ActionTime : currentTime*10000,
            Country : Global.language
        }
        Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"v1/Services-tracking/TrackingDownloadStart", data, (response)=>{
            // console.log(response);
        });
    },

    SendTrackingEnd(bundleName, version, typeSuccess) {
        return;
        let dataSaveString = cc.sys.localStorage.getItem("LOAD_BUNDLE_"+bundleName) || "";
        if(dataSaveString.length > 0) {
            Global.Helper.LogAction("load object end:"+bundleName);
            return;
        } else {
            if(typeSuccess) {
                Global.Helper.LogAction("download bundle end:"+bundleName);
                cc.sys.localStorage.setItem("LOAD_BUNDLE_"+bundleName , bundleName);
            }
            else {
                Global.Helper.LogAction("download bundle fail:"+bundleName);
            }
        }
        let currentTime = require("SyncTimeControl").getIns().GetCurrentTimeServer();
        if(currentTime < 1000000)
            currentTime = new Date().getTime();
        console.log("current time:"+currentTime);
        var data = {
            KeyFind : Global.MainPlayerInfo.accountId+"_"+bundleName+"_"+version,
            AccountId : Global.MainPlayerInfo.accountId,
            BundleName : bundleName,
            TypeSuccessed : typeSuccess,
            ActionTime : currentTime*10000,
            Country : Global.language
        }
        Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"v1/Services-tracking/TrackingDownloadEnd", data, (response)=>{
            // console.log(response);
        });
    },

    GetNameByMerchant(name) {
        if(CONFIG.MERCHANT == 2) {
            for(let i = 0; i < this.listName.length; i++) {
                if(this.listName[i] == name) {
                    return name + CONFIG.MERCHANT;
                }
            }
        } else if(CONFIG.MERCHANT == 3) {
            for(let i = 0; i < this.listName3.length; i++) {
                if(this.listName3[i] == name) {
                    return name + CONFIG.MERCHANT;
                }
            }
        }
        
        return name;
    },

    GetVersion(bName) {
        for(let i = 0; i < Global.listDictionary.length; i++) {
            if(bName == Global.listDictionary[i].n) {
                return Global.listDictionary[i].v;
            }
        }
        return Global.versionBundle;
    },

    onLoad() {
        Global.DownloadManager = this;
    },

    onDestroy() {
        Global.DownloadManager = null;
    },
});
