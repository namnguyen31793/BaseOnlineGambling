cc.Class({
    extends: cc.Component,

    properties: {
        listImgQuest : [cc.SpriteFrame],
        icon : cc.Sprite,
        progress : cc.Label,
        target : cc.Label,
    },

    InitQuestBean(index, current, target) {
        this.node.active = true;
        this.icon.spriteFrame = this.listImgQuest[index];
        this.target.string = Global.Helper.formatNumber(target);
        if(current > target)
            current = target;
        this.progress.string = parseInt(current/target*100)+"%";
    },

    InitConfigQuest(index, target) {
        this.node.active = true;
        this.icon.spriteFrame = this.listImgQuest[index];
        this.target.string = Global.Helper.formatNumber(target);
    },

    
});
