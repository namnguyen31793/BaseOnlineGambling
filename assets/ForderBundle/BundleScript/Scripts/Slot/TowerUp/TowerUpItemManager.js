

cc.Class({
    extends: require("ItemManager"),

    SetImage(id, item, index) {
        this._super(id, item);
        //item.SetImage(this.itemDBAsset[id-1], this.itemDBAtlasAsset[id-1], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true);  
    },
    
});
