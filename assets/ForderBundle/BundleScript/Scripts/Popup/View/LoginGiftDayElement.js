
cc.Class({
    extends: cc.Component,

    ctor(){
        this.listItem = [];
    },

    properties: {
        bg : cc.Node,
        item : cc.Node,
        iconDone : cc.Node,
    },

    Setup(money, bonus, isActive = false){
        this.listItem[0] = this.item;
        this.Reset();
        if(money > 0){
            this.item.active = true;
            this.item.getChildByName("label").getComponent(cc.Label).string = Global.Helper.formatNumber(money);
        }else{
            this.item.active = false;
        }
        if(bonus != null){
            for(let i = 0; i < bonus.length; i++){
                if((i+1) >= this.listItem.length){
                    let eff = cc.instantiate(this.item);
                    eff.parent = this.item.parent;
                    eff.active = true;
                    eff.scale = 1;
                    eff.getChildByName("label").getComponent(cc.Label).string = "x"+Global.Helper.formatNumber(bonus[i].Amount);
                    //thay anh
                    Global.Helper.GetIconGame(eff.getChildByName("icon").getComponent(cc.Sprite), bonus[i].GameID);
                    this.listItem[this.listItem.length] = eff;
                }else{
                    this.listItem[i+1].getChildByName("label").getComponent(cc.Label).string = "x"+Global.Helper.formatNumber(bonus[i].Amount);
                    Global.Helper.GetIconGame(this.listItem[i+1].getChildByName("icon").getComponent(cc.Sprite), bonus[i].GameID);
                }
            }
        }
        this.iconDone.active = isActive;
        if(!isActive){
            this.bg.color = cc.Color.WHITE;
        }else{
            this.bg.color = cc.Color.GRAY;
        }
    },

    Reset(){
        for(let i = 0; i < this.listItem.length; i++){
            if(i > 0)
                this.listItem[i].active = false;
        }
    },
});
