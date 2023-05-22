cc.Class({
    extends: cc.Component,

    properties: {
        lbProgress : cc.Label,
        imgProgress : cc.Sprite,
        progressContent : cc.Node,
        bundleName : "",
        btnPlay : cc.Button,
    },

    onLoad() {
        if (!cc.sys.isNative) {
            this.node.active = false;
        } else {
            for(let i = 0; i < Global.listBundle.length; i++) {
                if(Global.listBundle[i] == this.bundleName) {
                    this.node.active = false;
                }
            }
        }
       
    },

    ClickDown(event, index) {
        let bundle = null;
        // if(Global.language == "vi") {
        //     bundle = cc.assetManager.getBundle('bundle');
        // } else {
        //     bundle = cc.assetManager.getBundle('bundleEng');
        // }
        bundle = cc.assetManager.getBundle('bundle');
        let current = this;
        this.node.getComponent(cc.Button).interactable = false;
        this.btnPlay.interactable = false;
        this.progressContent.active = true;
        bundle.loadDir(this.bundleName, (count, total) => {
			current.imgProgress.fillRange = count/total;
            current.lbProgress.string = parseInt(count/total*100)+"%";
		},function (err, assets) {
            console.log("load success");
            Global.listBundle[Global.listBundle.length] = current.bundleName;
            current.node.active = false;
            current.btnPlay.interactable = true;
            cc.sys.localStorage.setItem("LIST_BUNDLE", JSON.stringify(Global.listBundle));
        }.bind(this));
    },

    
});
