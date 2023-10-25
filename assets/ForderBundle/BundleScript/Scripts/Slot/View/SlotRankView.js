cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },

    properties: {
        listItemRankSlot : [require("ItemRankSlot")]
    },

    onClickClose() {
        this.node.active = false;
    },

    Show(slotView){
        this.node.active = true;
        this.slotView = slotView;
    },

    ShowDetailTurn(info){

    },
});
