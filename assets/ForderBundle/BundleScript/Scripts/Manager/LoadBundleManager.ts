
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadBundleManager extends cc.Component {


    _cacheBundle:any={}
    start () {
        Global.LoadBundleManager = this;
    }

    loadBundle(pNameBundle, version){
        return new Promise<any>((resolve, reject)=> {
            //let pathBUndleGame = Global.domainUrl+ version+"/"+ pNameBundle;
            let pathBUndleGame = "https://bundle.sieuca.net/bundlesieuca/vn/"+ version+"/"+ pNameBundle;
            //let pathBUndleGame = "https://bundle.banca.city/bundlebcct/vn/"+ version+"/"+ pNameBundle;
            // let pathBUndleGame = "https://bundle.lendinh.live/bundlebcct"+ version+"/"+ pNameBundle;//https://bundle.lendinh.live/bundlebcct
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

    async LoadPrefab(bName, version, link, event, isLoading = 0){
        let bundle = null;
        if(this._cacheBundle[bName] == undefined || this._cacheBundle[bName] == 0 )
        {
            bundle = await this.loadBundle(bName, version);
        }
        else
        {
            bundle = cc.assetManager.getBundle(bName);
        }
       
        if(bundle) {
            bundle.load(link, function(count, total) {
            }, function (err, prefab) {
                if(err != null) {
                    if(isLoading == 2)
                        Global.UIManager.hideMiniLoading();
                    else if(isLoading == 1) {
                        console.log(err.toString());
                        if(Global.UIManager != null && Global.UIManager.loading != null)
                            Global.UIManager.loading.onBack();
                    }
                    return;
                }
                event(prefab);
            }.bind(this));
        }
    }

    async LoadAssest(bName, version, type, link, event, isLoading = 0){
        let bundle = null;
        console.log(this._cacheBundle[bName]);
        if(this._cacheBundle[bName] == undefined || this._cacheBundle[bName] == 0 )
        {
            bundle = await this.loadBundle(bName, version);
        }
        else
        {
            console.log("-------------------LoadAssest-----------------");
            bundle = cc.assetManager.getBundle(bName);
        }
       
        if(bundle) {
            bundle.load(link, type, function(count, total) {
            }, function (err, prefab) {
                event(prefab);
            }.bind(this));
        }
    }

    async LoadScene(bName, version, link, event, isLoading = 0){
        let bundle = null;
        console.log(this._cacheBundle[bName]);
        if(this._cacheBundle[bName] == undefined || this._cacheBundle[bName] == 0 )
        {
            bundle = await this.loadBundle(bName, version);
        }
        else
        {
            console.log("-------------------LoadScene-----------------");
            bundle = cc.assetManager.getBundle(bName);
        }
       
        if(bundle) {
            bundle.loadScene(link, function(count, total) {
            }, function (err, scene) {
                // if(err != null) {
                //     console.log(err.toString());
                //     if(Global.UIManager.loading != null)
                //         Global.UIManager.loading.onBack();
                //     Global.DownloadManager.SendTrackingEnd(link, version,false);
                //     return;
                // }
                event(scene);
            }.bind(this));
        }
    }

    // update (dt) {}
}
