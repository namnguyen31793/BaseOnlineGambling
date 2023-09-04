

cc.Class({
    extends: require("ItemManager"),

    SetImageFree(id, item, index, isHaveGoldQueen) {
        this.SetImage(id, item);
    },

    SetImage(id, item, index, multi) {
        item.SetImage(id, multi, null, null, null/*spriteBig*/, this.GetSprite(id-1), null, this.waitAnimationName, true);  
        
    },

    GetSprite(type) {
        return this.itemContentSmallSprite[type];
    },


    ActiveItem(item, active, useColor = false) {
        if(active) {
            item.PlayAnimation(this.playAnimationName, cc.Color.WHITE, 1);
        } else {
            if(useColor)
                item.PlayAnimation(this.waitAnimationName, cc.Color.GRAY, 0);
            else
                item.PlayAnimation(this.waitAnimationName, cc.Color.WHITE, 0);   
        }
    },
});
