
cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotController = null;
    },

    properties: {
        listSpr_Help: [cc.SpriteFrame],
        listSpr_Help_Eng: [cc.SpriteFrame],
        listSpr_Title: [cc.SpriteFrame],
        sprHelp: cc.Sprite,
        sprTitle: cc.Sprite,
        lbCurrent:cc.Label,
    },

    Init(slotController) {
        this.slotController = slotController;
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
        this.slotController.PlayClick();
        this.indexHelp++;
        if (this.indexHelp === this.listSpr_Help.length)
            this.indexHelp = 0;
        this.ChangeImage();
        this.lbCurrent.string = (this.indexHelp +1)  + "/"+this.listSpr_Help.length;
    },
    onClickBack() {
        this.slotController.PlayClick();
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
        if(this.sprTitle)
            this.sprTitle.spriteFrame = this.listSpr_Title[this.indexHelp];
    },

    onClose() {
        this.slotController.PlayClick();
        this.node.active = false;
    },
});
