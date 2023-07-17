

cc.Class({
    extends: cc.Component,

    properties: {
        bg : cc.Sprite,
        img : [cc.SpriteFrame],
        loadObj : cc.Node,
        progress : cc.Sprite,
        txt : cc.Label,
    },

    onLoad() {
        
        Global.Helper.GetLoadingGameSlot(require("ScreenManager").getIns().roomType , this.bg);

        this.node.children[0].addComponent(cc.BlockInputEvents);
        let r = Global.RandomNumber(0, this.img.length);
        if(Global.indexBgLoading == null)
            Global.indexBgLoading = r;
    },

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.back:
                this.onBack();
                break;
            default:
                break;
        }
        
    },

    onBack() {
        let currentScreen = require("ScreenManager").getIns().currentScreen;
        if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_SLOT){
            require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
        } else if(currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
            // require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY_FISH);
            require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
        }
    },

    onDisable() {
        this.loadObj.active = false;
        this.txt.string = "Loading..."
    },

    UpdateProgress(percent) {
        if(!this.loadObj.active) {
            this.loadObj.active = true;
            if (cc.sys.isNative)
                Global.Helper.RandomHint(this.txt);
        }
        if(percent > this.progress.fillRange) {
            this.progress.fillRange = percent;
        }
    },

    start () {
        // this.bg.spriteFrame = this.img[Global.indexBgLoading];
        // if(Global.indexBgLoading == 0)
        //     this.bg.node.height = 750;
        // else this.bg.node.height = 583;
        this.progress.node.width = cc.winSize.width;
    },

    // update (dt) {},
});
