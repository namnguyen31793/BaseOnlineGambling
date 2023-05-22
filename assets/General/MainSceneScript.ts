// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainSceneScript extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    domainUrl: string = 'http://remote.servicegateway.bid/';

    @property(cc.Node)
    loadObj : cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    _cacheBundle:any={}
    start () {
        console.log("start load");
        this.domainUrl = Global.domainUrl+Global.versionBundle+"/";
        console.log("domain:"+this.domainUrl);
        if (cc.sys.isNative && (cc.sys.isMobile || cc.sys.os == cc.sys.OS_WINDOWS)) {
            this.DownBundle();
        }
    }

    loadBundle(pNameBundle){

        return new Promise<any>((resolve, reject)=> {

            let pathBUndleGame = this.domainUrl + pNameBundle;
            if(window['customData'] == undefined) window['customData'] = {}
            if(window['customData']['cacheBundle'] == undefined) window['customData']['cacheBundle'] = {}
                cc.assetManager.loadBundle(pathBUndleGame, {version: ''}, function (err, bundle) {
                    if (!err) {
                        window['customData']['cacheBundle'][pNameBundle] = 1
                        resolve(bundle)

                    }
                    else
                    {
                        resolve(0)
                    }
                }.bind(this))
        })
    }

    async DownBundle(){
        console.log("---down bundle");
        let bundle = null;
        console.log(this._cacheBundle['bundle']);
        if(this._cacheBundle['bundle'] == undefined || this._cacheBundle['bundle'] == 0 )
        {
            console.log("load bundle");
            bundle = await this.loadBundle('bundle');
            // if(Global.language == "vi") {
            //     bundle = await this.loadBundle('bundle');
            // } else {
            //     bundle = await this.loadBundle('bundleEng');
            // }
        }else
        {
            console.log("get bundle");
            bundle = cc.assetManager.getBundle('bundle');
            // if(Global.language == "vi") {
            //     bundle = cc.assetManager.getBundle('bundle');
            // } else {
            //     bundle = cc.assetManager.getBundle('bundleEng');
            // }
        }
        let bundle2 = null;
        if(this._cacheBundle['bundlescrip'] == undefined || this._cacheBundle['bundlescrip'] == 0 )
        {
            bundle2 = await this.loadBundle('bundlescrip');
        }else
        {
            bundle2 = cc.assetManager.getBundle('bundlescrip');
        }
        if(bundle) {
            // var check = cc.sys.localStorage.getItem("LoadBundleSuccess2") || 0;
            // console.log("check:"+check);
            // if(check < Global.versionBundle)
            //     this.loadObj.active = true;
            // else  {
            //     var sceneName = 'ConfigScene';
            //     bundle.loadScene(sceneName, function (err, scene) {
            //         console.log(err);
            //     cc.director.runScene(scene);
            //     }.bind(this));
            // }
            var sceneName = 'ConfigScene';
            if(CONFIG.MERCHANT == "3")
                sceneName = 'ConfigScene3';
                bundle.loadScene(sceneName, function (err, scene) {
                    console.log(err);
                cc.director.runScene(scene);
                }.bind(this));
        }
                    
    }

    // update (dt) {}
}
