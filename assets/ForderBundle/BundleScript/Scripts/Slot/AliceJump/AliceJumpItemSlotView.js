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

});
