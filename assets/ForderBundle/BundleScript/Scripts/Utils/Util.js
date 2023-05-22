var GET_ANDROID_ID = "1";
var GET_BUNDLE_ID = "2";
var GET_VERSION_ID = "3";
var LOGIN_FACEBOOK = "4";
var VEYRY_PHONE = "6";
var CHAT_ADMIN = "7";
var DEVICE_VERSION = "8";
var BUY_IAP = "11";
var OPEN_FANPAGE = "14";
var OPEN_GROUP = "15";
var CHECK_NETWORK = "16";
var CARRIER_NAME = "19";//for IOS
var CHECK1SIM = "20";//for Android
var CHECK2SIM = "21";
var HIDESPLASH = "22";
var CALL_PHONE = "24";
var COPPY_TO_CLIP = "27";
cc.NativeCallJS = function (evt, params) {
    cc.log('iNativeCallJS------------------------>   DEMO ' + evt + "     " + params);
    switch (evt) {
        case GET_ANDROID_ID:
            require('GameManager').getIns().deviceId = params;
            cc.sys.localStorage.setItem("GEN_DEVICEID", params);
            break;
        case GET_BUNDLE_ID:
            require('GameManager').getIns().bundleID = params;
            cc.sys.localStorage.setItem("GEN_BUNDLEID", params);
            break;
        case GET_VERSION_ID:
            require('GameManager').getIns().versionGame = params;
            cc.sys.localStorage.setItem("GEN_VERSIONGAME", params);
            cc.log('gia tri versionGame la===' + params);
            break;
        case LOGIN_FACEBOOK:
            cc.log('tra ve token la===' + params);
            require('GameManager').getIns().access_token = params;
            cc.sys.localStorage.setItem('Token', params);
            require('NetworkManager').getIns().loginFB(params);
            break;
        case VEYRY_PHONE:
            let phone = params;
            cc.log('Goi Ham Verify phone trong util!!');
            require('NetworkManager').getIns().sendVeryfyPhone(phone)
            require('GameManager').getIns().number_verify = phone;
            Global.MissionView.onClose();
            break;
        case DEVICE_VERSION:
            require('GameManager').getIns().deviceVersion = params;
            break;
        case CHECK_NETWORK:
            if (params === "-1") {
                cc.log("Chuc mung ban da duoc ra dao!!!");
            }
            break;
        case CARRIER_NAME:
            cc.log("mcc la: " + params);
            require('GameManager').getIns().mccsim1 = parseInt(params);
            break;
        case CHECK1SIM:
            cc.log("===D: check 1 sim", params);
            require('GameManager').getIns().mccsim1 = parseInt(params);
            break;
        case CHECK2SIM:
            cc.log("===D: check 2 sim", params);
            if (params.indexOf("_") !== -1) {//co 2 sim tren may
                var listCountrycode = params.split("_");
                cc.log("listCountrycode", listCountrycode);
                for (var i = 0; listCountrycode.length; i++) {
                    if (i == 0) require('GameManager').getIns().mccsim1 = parseInt(listCountrycode[0]);
                    if (i == 1) require('GameManager').getIns().mccsim2 = parseInt(listCountrycode[1]);
                }
            } else {//chi co 1 sim tren may
                require('GameManager').getIns().mccsim1 = parseInt(params);
            }
            break;
    }
};

cc.NativeCallIAP = function (evt, params) {
    cc.log('iapobj------------------------>' + evt + params);
    switch (evt) {
        case "100":
            cc.log("iaploggggsigndata:=====" + params);
            require('GameManager').getIns().signdata = params;
            break;
        case "101":
            cc.log("iaploggggsignature:=====" + params);
            require('GameManager').getIns().signature = params;

            let _Signdata = require('GameManager').getIns().signdata;
            let _Signature = require('GameManager').getIns().signature;

            cc.log("iaploggggsigndata:" + _Signdata);
            cc.log("iaploggggsignature:" + _Signature);

            if (_Signdata == null || _Signdata == '' || _Signature == null || _Signature == '') {
                cc.log("iaploggggko sendIAPResult");
            } else {
                cc.log("iaploggggco sendIAPResult");
                require('NetworkManager').instance.sendIAPResult(_Signdata, _Signature);
            }
            break;
    }
};

var Util = cc.Class({
    statics: {
        onCallNative(evt, params) {
            if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", evt, params);
            } else if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
                jsb.reflection.callStaticMethod("AppController", "onCallFromJavaScript:andParams:", evt, params);
            }
        },
        getGetDeviceId() {
            Util.onCallNative(GET_ANDROID_ID, "");
        },
        getBundleId() {
            Util.onCallNative(GET_BUNDLE_ID, "");
        },
        getVersionId() {
            Util.onCallNative(GET_VERSION_ID, "");
        },
        onLoginFb(reLogin = "0") {
            Util.onCallNative(LOGIN_FACEBOOK, "" + reLogin);
        },
        onVeryPhone() {
            Util.onCallNative(VEYRY_PHONE, "");
        },
        onChatAdmin() {
            let data = {
                pageID: require('GameManager').getIns().fanpageID,
                pageUrl: require('GameManager').getIns().fanpageURL
            };
            cc.log('pageID la===' + require('GameManager').getIns().fanpageID)
            cc.log('pageURL la===' + require('GameManager').getIns().fanpageURL)
            let str = JSON.stringify(data);
            Util.onCallNative(CHAT_ADMIN, str);
            // cc.sys.openURL(require("GameManager").getIns().u_chat_fb);
        },
        getDeviceVersion() {
            Util.onCallNative(DEVICE_VERSION, "");
        },
        onBuyIap(itemID) {
            Util.onCallNative(BUY_IAP, itemID);
        },
        // sendTagOneSignal(key, value) {
        //     let data = {
        //         key: key,
        //         value: value
        //     };
        //     Util.onCallNative(SEND_TAG_ONESIGNAL, JSON.stringify(data));
        //     cc.log("sendTagOneSignal: " + JSON.stringify(data));
        // },

        openFanpage() {
            let data = {
                pageID: require('GameManager').getIns().fanpageId,
                pageUrl: require('GameManager').getIns().fanpage
            };

            Util.onCallNative(OPEN_FANPAGE, JSON.stringify(data));
        },
        openGroup() {
            let data = {
                groupID: require('GameManager').getIns().groupID,
                groupUrl: require('GameManager').getIns().groupURL
            };
            // cc.log('---->  openGroup');
            Util.onCallNative(OPEN_GROUP, JSON.stringify(data));
        },

        checkNetwork() {
            // Util.onCallNative(CHECK_NETWORK, "");
        },

        getCarrierName() {
            Util.onCallNative(CARRIER_NAME, "");
        },

        sendCheck1Sim() {
            cc.log("sendCheck1Sim");
            Util.onCallNative(CHECK1SIM, "");
        },

        sendCheck2Sim() {
            cc.log("sendCheck2Sim");
            Util.onCallNative(CHECK2SIM, "");
        },

        // pushNotiOffline(data) {
        //     cc.log("UtilCocos: Push noti offline!");
        //     Util.onCallNative(PUSH_NOTI_OFFLINE, data);
        // },
        hideSplash() {
            Util.onCallNative(HIDESPLASH, "");
        },
        // getInfoDeviceSML() {
        //     cc.log("Call Android:getInfoDeviceSML");
        //     Util.onCallNative(GET_INFO_DEVICE_SML, "");
        //     let deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
        //     if (deviceId == null) {
        //         require("Util").getGetDeviceId();
        //     }
        // },
        onCallPhone(phoneNumber) {
            Util.onCallNative(CALL_PHONE, phoneNumber);
        },

        onCoppyToClip(str) {
            Util.onCallNative(COPPY_TO_CLIP, str);
        }
    }
});

module.exports = Util;