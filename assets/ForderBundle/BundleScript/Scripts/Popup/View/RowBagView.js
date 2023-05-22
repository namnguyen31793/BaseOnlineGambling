
cc.Class({
    extends: cc.Component,

    properties: {
        listItem : {
            default : [],
            type: require("ItemBagView"),
        },
    },

    initItem(info){
        for(let i = 0; i < this.listItem.length; i++){
            if(i < info.length){
                this.listItem[i].Setup(info[i]);
            }else{
                this.listItem[i].Reset();
            }
        }
    },
});
