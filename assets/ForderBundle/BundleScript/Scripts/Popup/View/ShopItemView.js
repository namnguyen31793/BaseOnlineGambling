cc.Class({
    extends: cc.Component,

    properties: {
        contentUp : cc.Node,
        contentDown : cc.Node,
        itemSale : cc.Node,
        itemNormal : cc.Node,
        
    },

    Init(item1, item2, i) {
        let nodeUp = null;
        if(item1.RewardBonusDescription.length == 0) {
            nodeUp = cc.instantiate(this.itemNormal);
        } else {
            nodeUp = cc.instantiate(this.itemSale);
        }
        nodeUp.parent = this.contentUp;
        nodeUp.active = true;
        nodeUp.setPosition(cc.v2(0,0));
        nodeUp.getComponent("ShopItemNormalView").Init(item1.ProductId, item1.UsdCost, item1.GoldReward, item1.RewardBonusDescription, item1.BonusPecent, i);
        let nodeDown = null;
        if(item2 != null) {
            if(item2.RewardBonusDescription.length == 0) {
                nodeDown = cc.instantiate(this.itemNormal);
            } else {
                nodeDown = cc.instantiate(this.itemSale);
            }
            nodeDown.parent = this.contentDown;
            nodeDown.active = true;
            nodeDown.setPosition(cc.v2(0,0));
            nodeDown.getComponent("ShopItemNormalView").Init(item2.ProductId, item2.UsdCost, item2.GoldReward, item2.RewardBonusDescription, item2.BonusPecent, i);
        } 
        
    },
    
});
