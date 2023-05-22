

cc.Class({
    extends: require("ItemManager"),
    properties: {
        itemBigDBAsset: {
            default: [],
            type: dragonBones.DragonBonesAsset,
        },

        itemBigDBAtlasAsset: {
            default: [],
            type: dragonBones.DragonBonesAtlasAsset,
        },
        imgBonus : cc.SpriteFrame,
        imgMajor : cc.SpriteFrame,
        imgMinor : cc.SpriteFrame,
        imgMini : cc.SpriteFrame,
    },

    SetImage(id, item, index) {
        let listSpr = this.GetSprite(id);
        if(id == 1) {
            let valueJackpot = this.slotView.normalManager.listJackpot[index];
            if(valueJackpot == 1000)    
                item.SetSpecial(true, this.imgMajor, id);
            else if(valueJackpot == 500) 
                item.SetSpecial(true, this.imgMinor, id);
            else if(valueJackpot == 250)
                item.SetSpecial(true, this.imgMini, id);
            else item.SetSpecial(true, this.imgMini, id);
        } else if(id == 3){
            item.SetSpecial(true, this.imgBonus, id);
        } else  {
            item.SetSpecial(false, null, id);
        }
        this._super(id, item);
        //item.SetImage(this.itemDBAsset[id-1], this.itemDBAtlasAsset[id-1], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true, id);  
    },

    RandomImageBig(item, isActiveAnim)
    {
        let r = Global.RandomNumber(this.minRandom,this.maxRandom);
        let listSpr = this.GetSprite(r+1);
        item.SetImage(r+1, this.itemBigDBAsset[r], this.itemBigDBAtlasAsset[r], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, isActiveAnim);
    },

    SetImageBig(id, item) {
        let listSpr = this.GetSprite(id);
        item.SetImage(id, this.itemBigDBAsset[id-1], this.itemBigDBAtlasAsset[id-1], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true);  
    },

    GetSprite(type) {
        let list = [null, null, null];
        return list;
    },
    
});
