cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
        multi : cc.Label,
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    SetValueWild(value){
        this.multi.node.active = true;
        this.multi.string = value;
    },

    HideValueWild(){
        this.multi.node.active = false;
        this.multi.string = "";
    },
});
