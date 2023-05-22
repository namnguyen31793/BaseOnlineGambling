
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
        objTextFree : cc.Node,
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
        // this.objTextFree.active = true;
    },

    ShowNotifyWinFree(num) {
        this.freeObj.active = true;
        this.lbFree.string = "+" + Global.Helper.formatNumber(num);
        // this.objTextFree.active = false;
    },

    HideNotifyWinFree(){
        this.freeObj.active = false;
    },
});
