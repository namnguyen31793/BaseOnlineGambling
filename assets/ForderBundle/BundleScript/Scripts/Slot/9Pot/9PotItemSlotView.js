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
        this._super(id, ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim, isShowMask);
        this.ResetUI();
    },

    SetImageSpine(id, data, animationName, isActiveAnim = true) {
        this._super(id, data, animationName, isActiveAnim);
        this.ResetUI();
    },

    ShowAnimChangeItem(id, ske2, tex2, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true)
    {
        this.ResetUI();
        this.PlayAnimChangeItem();
        this.SetImage(id, ske2, tex2, sprBig, sprSmall, sprMask, animationName, isActiveAnim);
    },

    ShowAnimChangeItemSpine(id, data, animationName, isActiveAnim = true)
    {
        this.ResetUI();
        this.PlayAnimChangeItem();
        this.SetImageSpine(id, data, animationName, isActiveAnim);
    },

    ShowAnimQueen(itemManager, ske, tex, ske2, tex2, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true){
        this.toDoList.CreateList();
        this.ResetUI();
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.PlayAnimQueen();
            this.SetImage(ske2, tex2, sprBig, sprSmall, sprMask, animationName, isActiveAnim);
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>itemManager.CountItemDoneAnimFree(),false);
        this.toDoList.Play();
    },

    ShowAnimQueenSpine(itemManager,data, animationName, isActiveAnim = true) {
        this.toDoList.CreateList();
        this.ResetUI();
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            //this.PlayAnimQueen();
            this.skeleton.setAnimation(0, 'change', false);
            //this.SetImageSpine(data, animationName, isActiveAnim);
        }, false);
        this.toDoList.Wait(1.5);
        this.toDoList.AddWork(()=>{
            this.SetImageSpine(4, data, animationName, isActiveAnim);
        }, false);
        this.toDoList.AddWork(()=>itemManager.CountItemDoneAnimFree(),false);
        this.toDoList.Play();
    },

    PlayAnimQueen(){
        cc.log("PlayAnimQueen");
        // this.animQueenGold.play("PlayGoldQueen");
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
        // this.animQueenGold.stop();
        // this.animQueenGold.getComponent(cc.Sprite).spriteFrame = null;
        // this.animChangeItem.stop();
        // this.animChangeItem.getComponent(cc.Sprite).spriteFrame = null;
        this.HideValueWild();
    },
});
