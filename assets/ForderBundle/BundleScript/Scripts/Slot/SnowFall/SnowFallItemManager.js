

cc.Class({
    extends: require("ItemManager"),


    SetImage(id, item, index) {

        let listSpr = this.GetSprite(id);
        let isShowGem = false;
        
        this._super(id, item);
    },
    
    SetImageFree(id, item, index, isHaveGoldQueen) {
        this.SetImage(id, item);

    },

    GetSprite(type) {
        let list = [null, null, null];
        if(type > 5 && type < 9) {
            list = [this.itemContentBigSprite[0], this.itemContentSmallSprite[0], this.itemMaskSprite[0]];
        } else if(type >= 9  && type < 12) {
            list = [this.itemContentBigSprite[1], this.itemContentSmallSprite[1], this.itemMaskSprite[1]];
        } else if(type >= 12 && type < 16) {
            list = [this.itemContentBigSprite[2], this.itemContentSmallSprite[2], this.itemMaskSprite[2]];
        }
        return list;
    },
    
});
