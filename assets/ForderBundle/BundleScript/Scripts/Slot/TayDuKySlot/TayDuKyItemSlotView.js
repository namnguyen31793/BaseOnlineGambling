cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
        // animQueenGold : cc.Animation,
        animChangeItem : cc.Animation,
        multi : cc.Label,
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    SetImage(id, ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true) {
        animationName = this.GetNameSpine(id);
        this._super(id, ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim, isShowMask);
        this.ResetUI();
    },

    SetImageSpine(id, data, animationName, isActiveAnim = true) {
        animationName = this.GetNameSpine(id);
        this._super(id, data, animationName, isActiveAnim);
        this.ResetUI();
    },

    ShowAnimChangeItem(id, ske2, tex2, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true)
    {
        this.ResetUI();
        this.PlayAnimChangeItem();
        animationName = this.GetNameSpine(id);
        this.SetImage(id, ske2, tex2, sprBig, sprSmall, sprMask, animationName, isActiveAnim);
    },

    ShowAnimChangeItemSpine(id, data, animationName, isActiveAnim = true)
    {
        this.ResetUI();
        this.PlayAnimChangeItem();
        animationName = this.GetNameSpine(id);
        this.SetImageSpine(id, data, animationName, isActiveAnim);
    },

    PlayAnimChangeItem(){
        //this.animChangeItem.play("BoomBonus");
    },

    SetValueWild(value){
        this.multi.node.active = true;
        this.multi.string = value;
    },

    HideValueWild(){
        this.multi.node.active = false;
        this.multi.string = "";
    },

    ResetUI(){
        this.HideValueWild();
    },

    GetNameSpine(id){
        let animationName = "";
        switch(id){
            case 1:
                animationName = "Jackpot";
                break;
            case 2:
                animationName = "wildmokey";
                break;
            case 3:
                animationName = "bonus";
                break;
            case 4:
                animationName = "Free";
                break;
            case 5:
                animationName = "vongkimco";
                break;
            case 6:
                animationName = "batgioi";
                break;
            case 7:
                animationName = "satang";
                break;
            case 8:
                animationName = "quadao";
                break;
            case 9:
                animationName = "lotus";
                break;
            case 10:
                animationName = "itemAtayduky";
                break;
            case 11:
                animationName = "itemKtayduky";
                break;
            case 12:
                animationName = "itemQtayduky";
                break;
            case 13:
                animationName = "itemJtayduky";
                break;
            case 14:
                animationName = "item10tayduky";
                break;
        }
        return animationName;
    },
    
});
