cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    ResetUI(){
        if(this.prize.node.active)
            this.prize.string = "";
        this.prize.node.active = false;
    },

    ShowExtra(value){
        let acSetText = cc.callFunc(() => {
            this.prize.node.active = true;
            this.prize.string = "+"+value;
        });
        this.node.runAction(cc.sequence(cc.scaleTo(0.5, 0), acSetText, cc.sequence(cc.scaleTo(0.5, 1.1), cc.scaleTo(0.1, 1))));
    },
});
