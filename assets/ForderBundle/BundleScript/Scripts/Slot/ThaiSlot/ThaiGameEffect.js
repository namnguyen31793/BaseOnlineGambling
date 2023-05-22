
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
        EffectLaBay: sp.Skeleton,
        EffectHoaBay:  sp.Skeleton,
    },
    

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    PlayAnimPullCurtain(){
    },

    SetTypeJackpot(type){
        //this.imagejackpot.spriteFrame = this.listImagejackpot[type];
    },

    ShowNotifyFree(freeSpinTurn) {
        this.freeObj.active = true;
        this.lbFree.string = freeSpinTurn + "Lượt";
    },

    ShowNotifyWinFree(num) {
        this.freeObj.active = true;
        this.lbFree.string = "+" + Global.Helper.formatNumber(num);
    },

    HideNotifyWinFree(){
        this.freeObj.active = false;
    },

    PlayAnimLaBay(){
        let random = Global.RandomNumber(0, 100);
        if(random > 40)
            this.EffectLaBay.setAnimation(0, 'animation', false);
    },

    PlayAnimHoaBay(){
        this.EffectHoaBay.setAnimation(0, 'animation', false);
    },
});
