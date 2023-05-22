var NUMBER_COLUM_MATRIX = 8;
var LENGTH_MATRIX = 24;

cc.Class({
    extends: require("ItemManager"),

    ctor(){
        this.countItemAnimFree = 0;
        this.totalItemAnimFree = 0;
        this.numberRandom = 7;
        this.ID_EXTRA = 9;
        this.ID_WILD = 1;
        this.ID_ADD_FREE = 3;
    },

    RandomImage(item, isActiveAnim)
    {
        let r = Global.RandomNumber(1,this.numberRandom)+3;
        this.SetImage(r, item);
    },

    SetImage(id, item, index) {
        let isShowMask = true;
        if(this.slotView.isFree){
            if(id != this.slotView.normalManager.idItemCheckFree && id != this.ID_WILD && id != this.ID_ADD_FREE)
                isShowMask = false;
        }
        this._super(id, item);
        if(!this.slotView.normalManager.isNewColum)
            this.SetColorActive(item, isShowMask)
    },
    
    ShowExtra(id, item,value){
        this.SetImage(id, item);
        item.ShowExtra(value);
    },
    
    ActiveColorButtonNormalGame(isActive){
        let listItem = this.slotView.spinManager.listItem;
        for(let i = 0; i < listItem.length; i++){
            this.SetColorActive(listItem[i], isActive);
        }
    },
});
