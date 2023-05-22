var NUMBER_COLUM_MATRIX = 5;
var LENGTH_MATRIX = 15;

cc.Class({
    extends: require("ItemManager"),

    ctor(){
        this.countItemAnimFree = 0;
        this.totalItemAnimFree = 0;
        this.numberRandom = 10;
    },

    RandomImage(item, isActiveAnim)
    {
        let r = Global.RandomNumber(1,this.numberRandom);
        this.SetImage(r, item);
    },

    SetImage(id, item, index) {
        let isShowMask = true;
        if(this.useSpine){
            item.SetImageSpine(id, this.itemSpineData[id-1], this.waitAnimationName, true);  
        }
        else{
            let listSpr = this.GetSprite(id);
            item.SetImage(id, this.itemDBAsset[id-1], this.itemDBAtlasAsset[id-1], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true); 
        } 
        this.SetColorActive(item, isShowMask);
    },

    SetAnimChangeItemFree(id, item, index) {
        this.countItemAnimFree = 0;
        let listSpr = this.GetSprite(id);
        /*Check cac item lon*/
        if(id > 20 ){
            if(!this.useSpine)
                item.ShowAnimChangeItem(4, this.itemDBAsset[3], this.itemDBAtlasAsset[3], listSpr[0], listSpr[1], listSpr[2], this.waitAnimationName, true);  
            else
                item.ShowAnimChangeItemSpine(4, this.itemSpineData[3], this.waitAnimationName, true);
        }
        this.SetColorActive(item, true);
    },

    CountItemDoneAnimFree(){
        this.countItemAnimFree += 1;
        if(this.countItemAnimFree >= this.totalItemAnimFree){
            this.slotView.freeManager.toDoList.DoWork();
            this.totalItemAnimFree = 0;
        }
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

    ActiveColorButtonNormalGame(){
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listItem.length; i++){
            this.SetColorActive(listItem[i], true);
        }
    },
    
});
