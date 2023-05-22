cc.Class({
    extends: cc.Component,

    ctor(){
        this.itemInfo = null;
    },

    properties: {
        icon : cc.Sprite,
        iconGame : cc.Sprite,
        boxNumber : cc.Node,
        lbNumber : cc.Label,
    },

    Setup(itemInfo){
        this.itemInfo = itemInfo;
        if(itemInfo == null){
            this.Reset();
            return;
        }
        cc.log(this.itemInfo);
        if(this.itemInfo.ItemId != null) { 
            Global.Helper.GetIconBagByType(this.icon, this.itemInfo.ItemId);
            this.iconGame.spriteFrame = null;
        } else if(this.itemInfo.GameID != null) {
            Global.Helper.GetIconBagByType(this.icon, 99);
            Global.Helper.GetIconGame(this.iconGame, this.itemInfo.GameID);
        }
        
        this.boxNumber.active = true;
        this.lbNumber.string = 'X'+this.itemInfo.Amount;
    },

    ClickSelectItem(){
        if(this.itemInfo == null){
            Global.BagPopup.ResetUiViewItem();
            return;
        }
        Global.BagPopup.ShowItemByInfo(this.itemInfo);
    },

    Reset(){
        this.itemInfo = null;
        this.icon.spriteFrame = null;
        this.iconGame.spriteFrame = null;
        this.boxNumber.active = false;
        this.lbNumber.string = '';
    },
});
