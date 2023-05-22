cc.Class({
    extends: cc.Component,
    ctor() {
        this.range = 0;
        this.count = 0;
        this.load = 0;
        this.listItem = [];
        this.listTotal = [];
        this.isShow = false;
        this.dem = 0;
        this.total = 0;
    },

    properties: {
        load : cc.Sprite,
        txt : cc.Label,
    },

    start() {
        // cc.game.addPersistRootNode(this.node);
        this.RandomHint();
    },

    RandomHint() {
        if(Global.language == "vi") {
            this.txt.string = Global.hintVN[Global.RandomNumber(0,Global.hintVN.length)];
        } else {
            this.txt.string = Global.hintENG[Global.RandomNumber(0,Global.hintVN.length)];
        }
        
        this.scheduleOnce(()=>{
            this.RandomHint();
        } , Global.RandomNumber(3,6));
    },

    onLoad() {
        this.load.node.width = cc.winSize.width;
        Global.ShowLoad = this;
        this.Load();
    },

    SetProgress(nameBundle, index, count, total) {
        this.listItem[index] = count;
        this.listTotal[index] = total;
        let dataItem = this.CountList(this.listItem);
        let dataTotal = this.CountList(this.listTotal);
        // Global.ShowLoad.txt.string = Global.ShowLoad.dem+"/"+dataItem.count;
        console.log("check count:"+nameBundle+"    "+Global.ShowLoad.dem+"    "+dataItem.count+"    "+dataItem.total+"    "+dataTotal.total);
        Global.ShowLoad.SetRange(dataItem.total/dataTotal.total, Global.ShowLoad.dem, this.total);
    },

    LoadSuccess(nameBundle) {
        console.log("load success:"+nameBundle);
        this.dem += 1;
        if(this.dem >= this.total) {
            this.Run();
        }
    },

    CountList(list) {
        let count = 0;
        let total = 0;
        for(let i = 0; i < list.length; i++) {
            if(list[i] != null) {
                total += list[i];
                count += 1;
            }
        }
        let data = {
            count : count,
            total : total,
        }
        return data;
    },

    Load() {
        this.StartLoad();
        let bundle = null;
        // if(Global.language == "vi") {
        //     bundle = cc.assetManager.getBundle('bundle');
        // } else {
        //     bundle = cc.assetManager.getBundle('bundleEng');
        // }

        bundle = cc.assetManager.getBundle('bundle');
    },

    onDestroy() {
        console.log("----------destroy");
    },

    Run() {
        console.log("run game");

        cc.sys.localStorage.setItem("VersionScene" , Global.versionScene);
        cc.sys.localStorage.setItem("VersionList" , Global.versionList);

        let bundle = null;
        // if(Global.language == "vi") {
        //     bundle = cc.assetManager.getBundle('bundle');
        // } else {
        //     bundle = cc.assetManager.getBundle('bundleEng');
        // }

        bundle = cc.assetManager.getBundle('bundle');

        var sceneName = 'ConfigScene';
        bundle.loadScene(sceneName, function (err, scene) {
            this.load = null;
            this.txt = null;
            console.log(err);
            cc.sys.localStorage.setItem("LoadBundleSuccess2" , Global.versionBundle);
            cc.director.runScene(scene);
        }.bind(this))
    },

    StartLoad() {
        this.isShow = true;
        this.node.parent.active = true;
    },

    SetRange(f, current, total) {
        // if(f >= 0 && f <= 1) {
            this.load.fillRange = f/total + current/total;
        // }
            
    },

   

});
