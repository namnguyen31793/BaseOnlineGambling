
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
        this.toDoList = null;
        this.isShowBigWin = false;
        this.isShowCurtain = false;
    },

    properties: {
        isBattle : {
            default: false,
        },
        SpineShowFree : sp.Skeleton,
        SpineShowNotify : sp.Skeleton,
    },
    

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    ShowWinMoney(winMoney) {
        this._super(winMoney);
        if(this.isShowCurtain)
            return;
        this.isShowBigWin = true;
        if(!this.isBattle) {
        } else {
            this.isShowBigWin = false;
        }
    },

    ShowNotifyFree(freeSpinTurn) {
        this.freeObj.active = true;
        this.SpineShowFree.setAnimation(0, 'free', false);  
        //this.lbFree.string = freeSpinTurn;
    },

    ShowNotifyWinFree(num) {
        // this.freeObj.active = true;
        // this.lbFree.string = "+" + Global.Helper.formatNumber(num);
        this.toDoList.CreateList();
        this.toDoList.AddWork(()=>{
            this.notifyObj.active = true;
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.lbNotify.string =  "+" + Global.Helper.formatNumber(num);
        }, false);
        this.toDoList.Play();
    },

    HideNotifyWinFree(){
        this.freeObj.active = false;
        this.notifyObj.active = false;
        this.lbNotify.string = "";
    },

    AnimShowNotifyWinPot(nameSkin) {
    },

    SetValueWinPot(num){
    },

    AnimHideNNotifyWinPot(){  
    },

    HideNotifyWinPot(){
    },

    ShowNotify(winValue, act) {
        this.SpineShowNotify.setAnimation(0, 'waiting', true);  
        this._super(winValue, act);
    },

});
