
cc.Class({
    extends: cc.Component,

    properties: {
        icon : cc.Sprite,
        numb : cc.Label,
        description : cc.Label,
    },

    FillInfo(rewardType, itemType, prizeValue, store, des) {
        this.node.active = true;
        store.SetIconItem(this.icon, rewardType, itemType);
        this.numb.string = "X"+prizeValue;
        if(this.description)
            this.description.string = des;
    },

    // update (dt) {},
});
