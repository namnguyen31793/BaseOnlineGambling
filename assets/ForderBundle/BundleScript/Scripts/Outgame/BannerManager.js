cc.Class({
    extends: cc.Component,
    ctor() {
        this.index = 0;
        this.indexBanner = 0;
    },

    properties: {
        imgBanner: [cc.SpriteFrame],
        banner : [cc.Sprite],
        anim : cc.Animation,
    },

    start () {
        for(let i = 0; i < this.banner.length; i++) {
            this.banner[i].node.opacity = 0;
        }
        this.banner[this.index].node.opacity = 255;
        this.scheduleOnce(()=>{
            this.ChangeBanner();
        } , 5);  
    },

    ChangeBanner() {
        this.banner[1-this.index].node.setSiblingIndex(this.node.children.length-1);
        this.anim.play("ShowBanner"+(2-this.index));
        this.index = 1 - this.index;
        this.indexBanner += 1;
        if(this.indexBanner >= this.imgBanner.length) 
            this.indexBanner = 0;
        this.banner[this.index].spriteFrame = this.imgBanner[this.indexBanner];
        this.scheduleOnce(()=>{
            this.ChangeBanner();
        } , 5);
    },

});
