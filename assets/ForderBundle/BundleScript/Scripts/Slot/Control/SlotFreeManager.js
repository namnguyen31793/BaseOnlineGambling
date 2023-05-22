

cc.Class({
    extends: cc.Component,
    ctor() {
        this.numberFreeSpin = 0;
        this.totalWin = 0;
        this.slotView = null;
        this.toDoList = null;
    },

    properties: {
        freeObj : cc.Node,
        lbFreeTurn : cc.Label,
        lbTotalWin : cc.Label,
        notifyFree : cc.Node,
        lbNotifyTurn : cc.Label,
        startCoinPos : cc.Node,
        endCoinPos : cc.Node,
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },
    
    update(dt) {
        
    },

    Init(slotView) {
        this.slotView = slotView;
    },

    SetFreeSpin(numberFreeSpin) {
        this.numberFreeSpin = numberFreeSpin;
        if(this.numberFreeSpin > 0) {
            this.ShowFreeUI();
        }
        this.SetTextFree();
    },

    ShowFreeUI() {
        this.freeObj.active = true;
        
    },

    CheckHideFreeUI() {
        if(this.numberFreeSpin == 0) {
            this.HideFreeSpin();
        }
    },

    AddTotalWin(winMoney) {
        if(this.slotView.isFree) {
            this.SetToTalWinValue(this.totalWin + winMoney);
        }
    },

    EndFreeGame() {
        this.slotView.ShowNotify(this.totalWin);
    },

    HideFreeSpin() {
        this.freeObj.active = false;
    },

    SetTextFree()
    {
        this.lbFreeTurn.string = this.numberFreeSpin.toString();
    },

    SetToTalWinValue(value) {
        this.totalWin = value;
        cc.sys.localStorage.setItem("Key_Total_Free"+this.slotView.slotType , this.totalWin);
    },

    UpdateMoneyResult(winNormalValue, toDoList, isWaitRunMoneyWin = false) {
        require("WalletController").getIns().TakeBalance(this.slotView.slotType)
        this.AddTotalWin(winNormalValue);
        let isBigWin = this.slotView.CheckBigWin(winNormalValue);
        if(winNormalValue > 0) {
            if(!isBigWin) {
                this.slotView.PlayWinMoney();
                //this.slotView.effectManager.ShowWinMoney(winNormalValue);
                if(isWaitRunMoneyWin) {
                    this.slotView.scheduleOnce(()=>{
                        this.slotView.UpdateWinValue(winNormalValue);
                        toDoList.DoWork();
                    } , 2);  
                }else{
                    this.slotView.UpdateWinValue(winNormalValue);
                    toDoList.DoWork();
                }
            } else {
                this.slotView.PlayBigWin();
                this.slotView.effectManager.ShowBigWin(winNormalValue, toDoList);
            }
        } else {
            this.slotView.UpdateWinValue(winNormalValue);
            toDoList.DoWork();
        }
    },

    ShowTotalWin(toDoList){
        let isBigWin = this.slotView.CheckBigWin(this.totalWin);
        if(this.totalWin > 0) 
            if(isBigWin) {
                this.slotView.menuView.ResetValueCacheWin();
                this.slotView.PlayBigWin();
                this.slotView.effectManager.ShowBigWin(this.totalWin, toDoList);
            }else{
                toDoList.DoWork();
            }
        else
            toDoList.DoWork();
        this.totalWin = 0;
        //new
        this.ClearTotalWinCache();
    },

    GetTotalWinCache(){
        if(Global.SlotNetWork.slotView.battleManager == null) {
            this.totalWin = parseInt(cc.sys.localStorage.getItem("Key_Total_Free"+this.slotView.slotType)) || 0;
            this.slotView.UpdateWinValue(this.totalWin);
            cc.log("HideFreeSpin " +this.totalWin);
        }
        
    },
    
    ClearTotalWinCache(){
        if(Global.SlotNetWork.slotView.battleManager == null) {
            this.totalWin = 0;
            this.lbTotalWin.string = "0";
            cc.sys.localStorage.setItem("Key_Total_Free"+this.slotView.slotType , this.totalWin);
        }
    },
});
