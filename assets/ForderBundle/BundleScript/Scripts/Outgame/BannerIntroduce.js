cc.Class({
    extends: cc.Component,
    ctor() {
        this.count = 0;
        this.listIntroduce = [];
        this.isPlay = false;
        this.countTime = 0;
        this.indexIntroduce = 0;
    },

    properties: {
       animation : cc.Animation,
       spKhung : cc.Sprite,
       spImg : cc.Sprite,
    },

    onLoad() {
        let data = {};
        Global.BaseNetwork.requestGet(CONFIG.BASE_API_LINK+"v1/Services-config/GetBannerIntroduce", data, (response)=> {
            let dataJson = JSON.parse(response);
            let d = JSON.parse(dataJson);
            let list = d.list;
            if(list.length > 0) {
                this.DownImage("khung", (pre)=>{
                    this.spKhung.spriteFrame = pre;
                    for(let i = 0; i < list.length; i++) {
                        let index = i;
                        this.DownImage(list[index], (pre)=> {
                            this.listIntroduce[index] = pre;
                            this.OnCheck(list.length);
                        })
                    }
                })
            }
        });
    },

    OnCheck(total) {
        this.count += 1;
        if(this.count == total) {
            this.isPlay = true;
            this.indexIntroduce = 0;
            this.PlayAnimation();
        }
    },

    PlayAnimation() {
        this.countTime = 0;
        this.spImg.spriteFrame = this.listIntroduce[this.indexIntroduce];
        this.animation.play();
    },

    update(dt) {
        if(this.isPlay) {
            this.countTime += dt;
            if(this.countTime >= 14) {
                this.indexIntroduce += 1;
                if(this.indexIntroduce >= this.listIntroduce.length) {
                    this.indexIntroduce = 0;
                }
                this.PlayAnimation();
            }
        }
    },

    DownImage(nameImg, action) {
        Global.DownloadManager.LoadAssest("Introduce",cc.SpriteFrame,nameImg, (pre)=>{
            action(pre);
        });
    },

});
