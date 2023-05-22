window.Global = {
    
    isOffline: false,
    isTutorial: 0,
    isChallenge: 0,
    isHaveQuestNewPlayer : false,
    showInterstitialAds : false,
    
    isConnect: false,
    deviceId : "",

    indexDailyReward: 0,
    indexOnlineReward: 0,
    listDailyReward: [],
    listOnlineReward: [],
    listReward: [],
    currentSpin: 0,
    listPercentBonus:[],
    listNotifyDefault: [],
    isPlayBonus : 0,
    bonusRate : 0,
    //battle
    countRematch:0,
    ItemBagAtlas: [],
    //ads
    indexRewardAds : 0,
    indexInterstitialAds : 0, 

    indexUnLock : [],

    SetDeviceId(id) {
        cc.sys.localStorage.setItem(CONFIG.KEY_DEVICE_ID , id);
        Global.deviceId = id;
        console.log("GGGG device id:"+id);
    },

    SendTrackerLogView(name) {
        if (!cc.sys.isNative) {
            
        } else {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                console.log("call native android");
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "SendTrackerLogView", "(Ljava/lang/String;)V", name);
            } else {
                console.log("call native ios");
            }
        }
    },

    SendTrackerLogAchievement(name) {
        if (!cc.sys.isNative) {
            
        } else {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                console.log("call native android");
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "SendTrackerLogAchievement", "(Ljava/lang/String;)V", name);
                // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "composeSmsMessage", "(Ljava/lang/String;Ljava/lang/String;)V", dataJson.d, info.ServiceNum);
            } else {
                console.log("call native ios");
                // let str = "sms:"+info.ServiceNum+"&body="+dataJson.d;
                // var ret = jsb.reflection.callStaticMethod("AppController",
                //  "callOpenSms:", str);
            }
        }
    },

    RandomNumber(min_value, max_value) {
        let random_number = Math.random() * (max_value - min_value) + min_value;
        return Math.floor(random_number);
    },

    GetRealTimeStartUp() {
        let currentDateTime = new Date();
        let realtimeSinceStartup = (currentDateTime.getTime() - Global.startAppTime.getTime())/1000;
        return realtimeSinceStartup;
    },

    formatTime(str) {
        return require("SyncTimeControl").getIns().convertTimeToString((new Date(str)).getTime());
    },

    GetPositionByCanvas(node) {
        //tra ve toa do khi la con truc tiep cua canvas
        let check = false;
        let pos = node.getPosition();
        while(!check) {
            node = node.parent;
            if(node.getComponent(cc.Canvas)) {
                check = true;
            } else {
                pos.x += node.x;
                pos.y += node.y;
            }
        }
        return pos;
    },

    changeParent : function (node, newParent) {
		if(node.parent == newParent) return;
		var getWorldRotation = function (node) {
			var currNode = node;
			var resultRot = -currNode.angle;
			do {
				currNode = currNode.parent;
				resultRot -= currNode.angle;
			} while(currNode.parent != null);
			resultRot = resultRot % 360;
			return resultRot;
		};

		var oldWorRot = getWorldRotation(node);
		var newParentWorRot = getWorldRotation(newParent);
		var newLocRot = oldWorRot - newParentWorRot;

        var oldWorPos = node.convertToWorldSpaceAR(cc.v2(0,0));
		var newLocPos = newParent.convertToNodeSpaceAR(oldWorPos);

        node.parent = newParent;
        node.position = newLocPos;
		node.angle = newLocRot;
    },

    GetLanguage(lang) {
        Global.language = lang;
        Global.CheckLoad.OnCheck();
    },
    
    
}