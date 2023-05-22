cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.listFireBall = [];
    },

    properties: {
        freeTurn : cc.Animation,
        animFree : cc.Animation,
        animDragon : dragonBones.ArmatureDisplay,
        posFireBall : cc.Node,
        fireBall : cc.Node,
        wildColumn : cc.Animation,
        animNotifyEnd : sp.Skeleton,
        txtImgFreeEnd : cc.Node,
    },

    ShowFree(numberFree, isNotify, lineWin, winNormalValue, totalWin) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.PlayFreeSpin();
                this.ClearTotalWinCache();
            }, false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.lbNotifyTurn.string = numberFree.toString();
                this.notifyFree.active = true;
                this.animNotifyEnd.node.active = true;
                this.animNotifyEnd.setAnimation(0, 'xuat hien', false);
                this.txtImgFreeEnd.active = true;
                this.slotView.ShowMultiFree();
            }, false);
            this.toDoList.Wait(1.0);
            this.toDoList.AddWork(()=>{
                this.lbTotalWin.string = this.numberFreeSpin.toString();
                this.animNotifyEnd.setAnimation(0, 'waiting', false);
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.lbTotalWin.string = "";
                this.txtImgFreeEnd.active = false;
                this.animNotifyEnd.setAnimation(0, 'bien mat', false);
            }, false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.animNotifyEnd.node.active = false;
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
            }, false);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                //this.freeTurn.play("ShowTurnFree");
            }, false);
        }
        if(numberFree > 0 || this.slotView.isFree) {
            if(totalWin > 0){
                this.toDoList.AddWork(()=>this.slotView.UpdateLineWinData(lineWin),false);
                if(this.slotView.MultiSave > 1 && totalWin > 0){
                    this.toDoList.AddWork(()=>this.slotView.ShowMoneyMultiResult(totalWin, this.slotView.MultiSave));
                    this.toDoList.Wait(1.8);
                    this.toDoList.AddWork(()=>this.slotView.HideMoneyMultiResult())
                }
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(totalWin, this.toDoList, true),true);
            }
            this.toDoList.Wait(0.2);
            //show money win
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.animNotifyEnd.node.active = true;
                this.animNotifyEnd.setAnimation(0, 'xuat hien', false);
                this.lbTotalWin.string = Global.Helper.formatNumber(this.totalWin);
            }, false);
            this.toDoList.Wait(1.0);
            this.toDoList.AddWork(()=>{
                this.animNotifyEnd.setAnimation(0, 'waiting', false);
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.lbTotalWin.string = "";
                this.animNotifyEnd.setAnimation(0, 'bien mat', false);
                this.totalWin = 0;
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.notifyFree.active = false;
                this.animNotifyEnd.node.active = false;
                this.slotView.normalManager.EndFree();
                //this.freeTurn.play("HideTurnBonus");
                this.ShowTotalWin(this.toDoList);
            }, true);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    SetTextFree()
    {
        this.notifyFree.active = true;
        this.lbFreeTurn.string = this.numberFreeSpin.toString();
    },

    CheckItemWild() {

    },

    EndFreeGame() {
        this.slotView.ResetEndFree();
        this._super();
    },
    
    ClearTotalWinCache(){
        if(Global.SlotNetWork.slotView.battleManager == null) {
            this.totalWin = 0;
            this.lbTotalWin.string = "";
            cc.sys.localStorage.setItem("Key_Total_Free"+this.slotView.slotType , this.totalWin);
        }
    },
    

});
