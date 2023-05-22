cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
        multi : cc.Label,
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    SetImageFree(ske, tex, ske2, tex2, isShowAnimQueen, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true, isHaveGoldQueen)
    {
        this.toDoList.CreateList();
        this.toDoList.AddWork(()=>{
            this.SetImage(ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim);
        }, false);

        if(!isShowAnimQueen){
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.SetImage(ske2, tex2, sprBig, sprSmall, sprMask, animationName, isActiveAnim);
            }, false);
        }
        this.toDoList.Play();
    },

    SetValueWild(value){
        this.multi.node.active = true;
        this.multi.string = value;
    },

    HideValueWild(){
        this.multi.node.active = false;
        this.multi.string = "";
    },
});
