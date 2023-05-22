var NUMBER_COLUM_MATRIX = 5;
var LENGTH_MATRIX = 15;

cc.Class({
    extends: require("ItemManager"),

    ctor(){
        this.countItemAnimFree = 0;
        this.totalItemAnimFree = 0;
        this.numberRandom = 10;
        this.ID_WILD = 1;
        this.ID_WILD_STAY = 2;
        this.ID_WILD_EXTEND = 3;
    },

    RandomImage(item, isActiveAnim)
    {
        let r = Global.RandomNumber(1,this.numberRandom)+3;
        this.SetImage(r, item);
    },

    SetImageColor(id, item, index, isShowMask) {
        //let isShowMask = false;
        if(this.useSpine){
            item.SetImageSpine(id, this.itemSpineData[id-1], this.waitAnimationName, true);  
        }
        else{
            let listSpr = this.GetSprite(id);
            item.SetImage(id, this.itemDBAsset[id-1], this.itemDBAtlasAsset[id-1], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true);  
        }
        this.SetColorActive(item, isShowMask)
    },


    ActiveColorButtonNormalGame(){
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listItem.length; i++){
            this.SetColorActive(listItem[i], true);
        }
    },
    
});
