cc.Class({
    extends: cc.Component,
    ctor() {
        this.data = null;
    },

    properties: {
        listObj : [cc.Node],
        loading : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
       
        Global.CheckLoad = this;
        // let currentDate = new Date();
        // let newDate = new Date(2021, 8, 16);
        // if(newDate.getTime()-currentDate.getTime() > 0) {

        // } else {
            // var data = {};
            // require("BaseNetwork").request("https://usegift.maxfire3d.com/gameserver/api/config/GetGameVersion", data, (response)=> {
            //     if(response == "1235243") {
            //         for(let i = 0; i < this.listObj.length; i++) {
            //             this.listObj[i].active = false;
            //         }
            //         require("BaseNetwork").request("https://usegift.maxfire3d.com/gameserver/api/config/GetStringBundle", data, (response)=> {
            //             let data = JSON.parse(response);
            //       //      this.loading.getComponent("MainSceneScript").domainUrl = data.d;
            //         Global.domainUrl = data.d;
            //         // cc.director.loadScene("loading");
            //            this.loading.active = true;
            //         });
            //     } else {
                    
            //     }
            // });
        // }
        Global.listBundle = JSON.parse(cc.sys.localStorage.getItem("LIST_BUNDLE") || JSON.stringify([]));
        Global.currentListDictionary = JSON.parse(cc.sys.localStorage.getItem("LIST_DICTIONARY2") || JSON.stringify({}));
        Global.currentListScreen = JSON.parse(cc.sys.localStorage.getItem("LIST_SCREEN2") || JSON.stringify({}));
        Global.language = "vi";
        let data = {};
        if (!cc.sys.isNative) {
            Global.language = "vi";
            cc.assetManager.loadBundle('bundlescrip', (err, bundle) => {
                
            });
            cc.assetManager.loadBundle('bundle', (err, bundle) => {
                cc.log("set bundle web");
                Global.Bundle = bundle;
                cc.director.preloadScene("ConfigScene");
                cc.director.loadScene("ConfigScene");
            });
			
		} else {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                let className = "org/cocos2dx/javascript/AppActivity";
                let methodName = "GetLanguage";
                let methodSignature = "()V";
                jsb.reflection.callStaticMethod(className, methodName, methodSignature);
            } else {
                Global.language = "vi";
            }

            Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"api/config/GetVersionBundle", data, (response)=> {
			// Global.BaseNetwork.request(CONFIG.BASE_API_LINK+"api/config/GetVersionBundle", data, (response)=> {
                console.log(dataJson)
                let dataJson = JSON.parse(response);
                let d = JSON.parse(dataJson);
                Global.CheckLoad.data = d;
                this.OnCheck();
                
            });
		}
    },

    OnCheck() {
        if(Global.language && this.data) {
            Global.listNeedDown = this.data.list;
            Global.listScene = this.data.scene;
            Global.hintVN = this.data.hintVN;
            Global.hintENG = this.data.hintENG;
            Global.listDictionary = this.data.dic;
            Global.listSceneLoad = this.data.screen;

            if(CONFIG.MERCHANT == 3){
                Global.domainUrl = "https://bundle.sieuca.net/bundlesieuca/vn/";
            }else if(CONFIG.MERCHANT == 2){
                Global.domainUrl = "https://bundle.banca.city/bundlebcct/vn/";
            }
            Global.versionBundle = this.data.versionVN;
            // if(Global.language == "vi") {
            //     Global.domainUrl = "https://banca.city/bundle/vn/";
            //     Global.versionBundle = this.data.versionVN;
            // } else {
            //     Global.domainUrl = "https://banca.city/bundle//";
            //     Global.versionBundle = this.data.versionENG;
            // }
            console.log(Global.domainUrl);
            console.log(Global.versionBundle+"    "+this.data.versionVN+"    "+this.data.versionENG);
            this.loading.active = true;
        }
    },

    onDestroy() {
        Global.CheckLoad = null;
    },

    
});
