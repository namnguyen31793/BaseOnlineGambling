
cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },

    properties: {
        listSpr_Help: [cc.SpriteFrame],
        listSpr_Help_Eng: [cc.SpriteFrame],
        // listSpr_Title: [cc.SpriteFrame],
        sprHelp: cc.Sprite,
        // sprTitle: cc.Sprite,
        lbCurrent:cc.Label,
    },

    Init(slotView) {
        this.slotView = slotView;
    },

    onLoad() {
        this.indexHelp = 0;
        this.lbCurrent.string = (this.indexHelp +1)  + "/"+this.listSpr_Help.length;
        this.ChangeImage();
    },
    start() {
        Global.UIManager.hideMiniLoading();
    },

    onClickNext() {
        this.slotView.PlayClick();
        this.indexHelp++;
        if (this.indexHelp === this.listSpr_Help.length)
            this.indexHelp = 0;
        this.ChangeImage();
        this.lbCurrent.string = (this.indexHelp +1)  + "/"+this.listSpr_Help.length;
    },
    onClickBack() {
        this.slotView.PlayClick();
        this.indexHelp--;
        if (this.indexHelp < 0)
            this.indexHelp = this.listSpr_Help.length - 1;
        this.ChangeImage();
        this.lbCurrent.string = (this.indexHelp +1)  + "/"+this.listSpr_Help.length;
    },

    ChangeImage(){
        if(Global.language == "vi") {
            this.sprHelp.spriteFrame = this.listSpr_Help[this.indexHelp];
        }else{
            this.sprHelp.spriteFrame = this.listSpr_Help_Eng[this.indexHelp];
        }
    },
    onClose() {
        this.slotView.PlayClick();
        // actionEffectClose(this.node, () => {
        //     this.node.destroy();
        // })
        this.node.active = false;
    },
});
