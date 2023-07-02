cc.Class({
    extends: cc.Component,

    properties: {
        img : cc.Node,
    },

    ctor() {
        this.countTime = 0;
        this.currentIndex = 0;
        this.list = [];
        this.isRun = false;
    },

    start() {
        let current = this;
        /*
        var data = {
			version: CONFIG.VERSION,
			os: require("ReceiveResponse").getIns().GetPlatFrom(),
			merchantid: CONFIG.MERCHANT,
		}
		Global.BaseNetwork.requestGet(CONFIG.BASE_API_LINK+"v1/Services-config/GetBannerInfoLink", data, (response)=>{
            let dataJson = JSON.parse(response);
            let data = JSON.parse(dataJson);
            console.log(data);
            current.data = data;
            if(data.length > 1)
                current.isRun = true;
            current.SetInfo();
        });
        */
    },

    onLoad() {
        Global.BannerLobby = this;
    },

    onDestroy(){
		Global.BannerLobby = null;
	},

    SetInfo() {
        for(let i = 0; i < this.data.length; i++) {
            var node = cc.instantiate(this.img);
            node.getComponent(cc.Button).clickEvents[0].customEventData = i;
            node.parent = this.node;
            node.setPosition(cc.v2(i*249,0));
            node.active = true;
            this.list.push(node);
            cc.assetManager.loadRemote(this.data[i].ImageUrl, {ext: '.png'}, function (err, texture) {
                if(err != null)
                    return;
                    Global.BannerLobby.list[i].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },

    ClickBanner(event, index) {
        if(this.data != null) {
            cc.sys.openURL(this.data[parseInt(index)].BannerUrl);
        }
    },

    update(dt) {
        if(this.isRun) {
            this.countTime += dt;
            if(this.countTime >= 5) {
                this.isRun = false;
                let nextIndex = this.NextIndex(this.currentIndex);
                let acMove1 = cc.callFunc(() => {
                    this.list[this.currentIndex].runAction(cc.moveTo(0.5, cc.v2(-249,0)));
                });
                let acMove2 = cc.callFunc(() => {
                    this.list[this.currentIndex].setPosition(cc.v2(-249*this.data.length-1), 0);
                    this.currentIndex = nextIndex;
                    this.isRun = true;
                    this.countTime = 0;
                });
                this.list[this.currentIndex].runAction(cc.sequence(acMove1, cc.delayTime(0.5), acMove2));

                this.list[nextIndex].setPosition(cc.v2(249,0));
                this.list[nextIndex].runAction(cc.moveTo(0.5, cc.v2(0,0)));
            }
        }
    },

    NextIndex(index) {
        index += 1;
        if(index == this.data.length)
            index = 0;
        return index;
    },
    
});
