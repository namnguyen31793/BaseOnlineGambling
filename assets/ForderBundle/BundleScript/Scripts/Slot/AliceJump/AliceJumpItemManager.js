var NUMBER_COLUM_MATRIX = 5;
var LENGTH_MATRIX = 15;

cc.Class({
    extends: require("ItemManager"),

    ctor(){
        this.countItemAnimFree = 0;
        this.totalItemAnimFree = 0;
        this.numberRandom = 10;
        this.ID_WILD_JUMP = 3;
        this.ID_WILD = 33;
        this.ID_WILD_ALICE = 34;
    },

    RandomImage(item, isActiveAnim)
    {
        let r = Global.RandomNumber(1,this.numberRandom)+3;
        this.SetImage(r, item);
    },

    SetImage(id, item, index) {
        let isShowMask = true;
        if(this.slotView.isFree){
            if(id != this.ID_WILD_JUMP && id!= this.ID_WILD_ALICE && id != this.ID_WILD)
                isShowMask = false;
        }
        //this._super(id, item);
        if(id == this.ID_WILD)
            id = 14;// id wild dung im
        if(id == this.ID_WILD_ALICE)
            id = 3;
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
