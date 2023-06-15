cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.listEffect = [];
        this.listTodoListEffect = [];
    },

    properties: {
        freeTurn : cc.Animation,
        //effectChangeTurn : cc.Animation,
        animFree : cc.Animation,
    },

    ShowFree(numberFree, extendMatrix, isNotify, lineWin, winNormalValue = 0) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        cc.log(isNotify);
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            this.ClearTotalWinCache();
            this.toDoList.Wait(1.2);
            this.toDoList.AddWork(()=>{
                this.slotView.effectManager.ShowWheelFree(numberFree, this.toDoList);
            }, true);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.slotView.effectManager.ShowNotifyFree(numberFree);
            }, false);
            this.toDoList.Wait(3);
            this.toDoList.AddWork(()=>{
                this.notifyFree.active = false;
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                //this.effectChangeTurn.play();
            }, false);
            if(winNormalValue > 0){
                this.toDoList.AddWork(()=>this.slotView.UpdateLineWinData(lineWin),false);
                this.toDoList.AddWork(()=>this.slotView.normalManager.ShowPotsWin(extendMatrix, winNormalValue, this.toDoList),true);
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, this.toDoList, true),true);
            }
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < this.listEffect.length; i++) {
                    this.listEffect[i].destroy();
                }
                this.listEffect = [];
            }, false);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimShowFree(true);
            }, false);
            this.toDoList.Wait(1);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.slotView.ShowNotifyWinFree(this.totalWin);
            }, false);
            this.toDoList.Wait(3);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.SetToTalWinValue(0);
                this.playAnimShowFree(false);
            }, false);
            this.toDoList.Wait(0.25);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    playAnimShowFree(isStart){
        if(!isStart){
            this.freeTurn.play("EffectHideFree");
        }else{
            this.freeTurn.play("EffectShowFree");
        }
    },

});
