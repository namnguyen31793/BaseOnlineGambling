var globalGameCustomManifest = JSON.stringify({
    "packageUrl": "https://banca.city/bundle/bancacity/remote-assets/",
    "remoteManifestUrl": "https://banca.city/bundle/bancacity/remote-assets/project.manifest",
    "remoteVersionUrl": "https://banca.city/bundle/bancacity/remote-assets/version.manifest",
    "version": "1.1",
    "assets": {},
    "searchPaths": []
});

cc.Class({
    extends: cc.Component,

    properties: {
        load : cc.Sprite,
        txt : cc.Label,
        loadObj : cc.Node,
    },

    onLoad() {
        if(CONFIG.MERCHANT == "2") {
            this.load.node.width = cc.winSize.width;
        } else if(CONFIG.MERCHANT == "3") {

        }
        Global.ConfigScene = this;
        this.node.getChildByName("bg").setContentSize(cc.winSize);
        Global.startAppTime = new Date();
        this.InitOneSignal();
        
    },

    start() {
        var data = {
            version: CONFIG.VERSION,
            os: require("ReceiveResponse").getIns().GetPlatFrom(),
            merchantid: CONFIG.MERCHANT,
        }
        //Global.BaseNetwork.request(CONFIG.CONFIG_LINK, data, this.reviceConfig);
        this.GetDeviceId();
        //new
        Global.ConfigScene.loadObj.active = true;
        if (cc.sys.isNative)
            Global.Helper.RandomHint(Global.ConfigScene.txt);
            if(Global.language == "vi") {
                Global.DownloadManager.LoadScene("Lobby","LobbyScene", (scene)=>{
                    cc.director.runScene(scene);
                },3)
            } else {
                Global.DownloadManager.LoadScene("LobbyEng","LobbyScene", (scene)=>{
                    cc.director.runScene(scene);
                },3)
            }
    },

    GetDeviceId() {
        if (!cc.sys.isNative) {
			Global.deviceId = this.FakeDeviceId();
		} else {
			Global.deviceId = cc.sys.localStorage.getItem(CONFIG.KEY_DEVICE_ID) || "";
            if(Global.deviceId.length < 3)
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let className = "org/cocos2dx/javascript/AppActivity";
                let methodName = "GetDeviceId";
                let methodSignature = "()V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppController",
                    "GetDeviceId:", "loginFB");
            }
		}
    },

    FakeDeviceId () {
        let deviceId = cc.sys.localStorage.getItem(CONFIG.KEY_DEVICE_ID) || "";
        if(deviceId.length > 3) {
            return deviceId;
        }
        var chars = '0123456789abcdef'.split('');
        var uuid = [], rnd = Math.random, r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (var i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | rnd() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
            }
        }
        deviceId = uuid.join('');
        cc.sys.localStorage.setItem(CONFIG.KEY_DEVICE_ID , deviceId);
        return deviceId;
    },

    InitOneSignal() {
         if (!cc.sys.isNative) {
            return;
         }
         console.log("checkk init bundle");
         Global.Bundle = null;
        // if(Global.language == "vi") {
        //     Global.Bundle = cc.assetManager.getBundle('bundle');
        // } else {
        //     Global.Bundle = cc.assetManager.getBundle('bundleEng');
        // }
        Global.Bundle = cc.assetManager.getBundle('bundle');
    },


    reviceConfig(response) {
        Global.ConfigScene.reviceConfigResponse = response;
        console.log("GGGG check native:"+cc.sys.isNative);
        let dataJson = JSON.parse(response);
        Global.ConfigLogin = dataJson.d;
        Global.ConfigScene.loadObj.active = true;
        if (cc.sys.isNative)
            Global.Helper.RandomHint(Global.ConfigScene.txt);
            if(Global.language == "vi") {
                Global.DownloadManager.LoadScene("Lobby","LobbyScene", (scene)=>{
                    cc.director.runScene(scene);
                },3)
            } else {
                Global.DownloadManager.LoadScene("LobbyEng","LobbyScene", (scene)=>{
                    cc.director.runScene(scene);
                },3)
            }

    },

    UpdateProgress(percent) {
        if(percent > this.load.fillRange) {
            this.load.fillRange = percent;
        }
    },

    

});
