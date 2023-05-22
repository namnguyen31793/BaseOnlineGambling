
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
        effectSpinManager : require("9PotSpinFree"),
        notifyPotObj : cc.Node,
        lbNotifyPot : cc.Label,
        SpineShowPot : sp.Skeleton,
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

    PlayAnimPullCurtain(){
    },

    SetTypeJackpot(type){
        
    },
    
    ShowWheelFree(numberFree, todolistCall){
        this.effectSpinManager.node.active = true;
        this.effectSpinManager.ShowSpinFree(numberFree, todolistCall);
    },

    ShowNotifyFree(freeSpinTurn) {
        this.freeObj.active = true;
        this.SpineShowFree.setAnimation(0, 'thong bao freespin', false);  
        this.lbFree.string = freeSpinTurn;
        
        this.effectSpinManager.node.active = false;
    },

    ShowNotifyWinFree(num) {
        // this.freeObj.active = true;
        // this.lbFree.string = "+" + Global.Helper.formatNumber(num);
        this.toDoList.CreateList();
        this.toDoList.AddWork(()=>{
            this.notifyObj.active = true;
            this.SpineShowNotify.setAnimation(0, 'xuat hien', false);  
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.lbNotify.string =  "+" + Global.Helper.formatNumber(num);
        }, false);
        this.toDoList.Wait(0.2);
        this.toDoList.AddWork(()=>{
            this.SpineShowNotify.setAnimation(0, 'waiting', true);  
        }, false);
        this.toDoList.Play();
    },

    HideNotifyWinFree(){
        //this.freeObj.active = false;
        this.notifyObj.active = false;
        this.lbNotify.string = "";
    },

    AnimShowNotifyWinPot(nameSkin) {
        this.SpineShowPot.setSkin(nameSkin);
        this.notifyPotObj.active = true;
        this.SpineShowPot.setAnimation(0, 'xuat hien', false);  
    },

    SetValueWinPot(num){
        this.SpineShowPot.setAnimation(0, 'waiting', true);  
        this.lbNotifyPot.string =  "+" + Global.Helper.formatNumber(num);
    },

    AnimHideNNotifyWinPot(){
        this.SpineShowPot.setAnimation(0, 'bienmat', true);  
    },

    HideNotifyWinPot(){
        this.notifyPotObj.active = false;
        this.lbNotifyPot.string = "";
    },

    ShowNotify(winValue, act) {
        this.SpineShowNotify.setAnimation(0, 'waiting', true);  
        this._super(winValue, act);
    },

});
