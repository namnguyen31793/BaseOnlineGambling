

cc.Class({
    extends: require("ItemManager"),

    SetImage(id, item, index) {
        let listSpr = this.GetSprite(id);
        if(id == 1) {
            let valueJackpot = this.slotView.normalManager.listJackpot[index];
            // cc.log("value:"+valueJackpot);
            if(valueJackpot == 5000)
                id = 1;
            else if(valueJackpot == 2500) 
                id = 18;
            else if(valueJackpot == 1250)
                id = 19;
            else id = 20;
        }
        else if(id == 55) {
            id = 21;
        } 
        this._super(id, item);
        //item.SetImage(this.itemDBAsset[id-1], this.itemDBAtlasAsset[id-1], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true);  
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
