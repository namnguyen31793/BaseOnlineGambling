cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    ShowEffectWin() {
        this.SetColorActive(cc.Color.WHITE, true);
    },

    HideEffectWin() {   
        this.SetColorActive(cc.Color.GRAY, true);
    },

    SetSkin(id){
        if(id == 0){
            this.skeleton.setSkin('laplai');
        }else if(id == 1){
            this.skeleton.setSkin('1');
        }else if(id == 2){
            this.skeleton.setSkin('2');
        }else{
            this.skeleton.setSkin('default');
        }
        this.toDoList.CreateList();
        this.toDoList.AddWork(()=>{
            this.skeleton.setAnimation(0, "active", false);
        }, false);
        this.toDoList.Wait(1.1);
        this.toDoList.AddWork(()=>{
            this.skeleton.setAnimation(0, "active-waiting", false);
        }, false);
        this.toDoList.Play();
    },

    SetSkinExpading(){
        this.toDoList.CreateList();
        this.toDoList.AddWork(()=>{
            this.skeleton.setAnimation(0, "active", false);
        }, false);
        this.toDoList.Wait(1.3);
        this.toDoList.AddWork(()=>{
            this.skeleton.setAnimation(0, "active-waiting", false);
        }, false);
        this.toDoList.Play();
    },
});
