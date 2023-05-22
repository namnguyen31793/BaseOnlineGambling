cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.listEffect = [];
        this.cacheNumQueen = 0;
        this.listTodoListEffect = [];
        this.cacheTotalSpin = 0;
    },

    properties: {
        freeTurn : cc.Animation,
        effectChangeTurn : cc.Animation,
        //effectChangeBgFree : cc.Animation,
        skeleton : sp.Skeleton,
    },

    ShowFree(numberFree, isNotify, lineWin, winNormalValue = 0, totalWin = 0, idCheckFree) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        cc.log(isNotify);
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            //save số lượt
            cc.sys.localStorage.setItem("Key_Free_Dragon" , numberFree);
            this.cacheTotalSpin = numberFree;
            this.toDoList.AddWork(()=>{
                this.slotView.PlayFreeSpin();
            }, false);
            this.toDoList.Wait(0.1);
            this.toDoList.AddWork(()=>{
                this.slotView.effectManager.ShowNotifyFree(numberFree);
                this.slotView.ClearWildEndFree();
                this.notifyFree.getComponent(cc.Animation).play("ShowFreeAnim");
            }, false);
            this.toDoList.Wait(1);
            //anim free
            for(let i = 6; i >= 0; i--){
                this.toDoList.AddWork(()=>{
                    let index = Global.RandomNumber(4,9)
                    if(i == 0){
                        if(index = idCheckFree)
                            index = 10;
                    }
                    this.ChangeItemShowFreeByID(index);
                },false);
                this.toDoList.Wait(i*0.01+0.1);
            }
            this.toDoList.AddWork(()=>{
                this.ChangeItemShowFreeByID(idCheckFree);

            },false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.notifyFree.active = false;
            }, false);
        }
        if(this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                this.effectChangeTurn.play();
            }, false);
            
            if(winNormalValue > 0){
                this.toDoList.AddWork(()=>this.slotView.UpdateLineWinData(lineWin),false);
                if(winNormalValue != totalWin)
                    this.toDoList.AddWork(()=>this.playWinMoneyLine(winNormalValue, this.toDoList),true);
                else
                    this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, this.toDoList, true),true);
                if(winNormalValue != totalWin)
                    this.toDoList.AddWork(()=>this.UpdateMoneyResult(totalWin, this.toDoList, true),true);
            }else{
                if(totalWin > 0)
                    this.toDoList.AddWork(()=>this.UpdateMoneyResult(totalWin, this.toDoList, true),true);
            }
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < this.listEffect.length; i++) {
                    this.listEffect[i].destroy();
                }
                this.listEffect = [];
            }, false);
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            if(numberFree == 8)//fake tru turn dau nhan duoc
                cc.sys.localStorage.setItem("Key_Free_Dragon" , numberFree);
            this.cacheTotalSpin = parseInt(cc.sys.localStorage.getItem("Key_Free_Dragon")) || this.numberFreeSpin;

            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                this.slotView.isFree = true;
                this.playAnimShowFree(true);
            }, false);
            this.toDoList.Wait(0.5);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.slotView.ShowNotifyWinFree(this.totalWin);
                this.notifyFree.getComponent(cc.Animation).play("ShowFreeAnim");
                this.slotView.PlayFreeEnd();
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.slotView.HideNotifyWinFree();
                this.SetToTalWinValue(0);
                this.playAnimShowFree(false);
                //clear length colum
                this.slotView.ResetFree();
            }, false);
            this.toDoList.Wait(0.5);
        }
        this.toDoList.AddWork(()=>{
            cc.log("end free");
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    ChangeItemShowFreeByID(id){
        let data = this.slotView.itemManager.itemSpineData[id-1];

        this.skeleton.skeletonData = data;
        this.skeleton.setAnimation(0, 'active', false);
    },

    playAnimShowFree(isStart){
        if(!isStart){
            this.freeTurn.play("EffectHideFree");
            this.slotView.ClearWildEndFree();
            this.slotView.drawLineManager.StopDraw();
            //this.effectChangeBgFree.play("EffectHideBgFree");
        }else{
            this.freeTurn.play("EffectShowFree");
            //this.effectChangeBgFree.play("EffectShowBgFree");
        }
    },

    playWinMoneyLine(winNormalValue, toDoList){
        if(winNormalValue > 0){
            this.slotView.PlayWinMoney();
            //this.slotView.effectManager.ShowWinMoney(winNormalValue);
            this.slotView.menuView.UpdateWinValue(winNormalValue);
            this.slotView.scheduleOnce(()=>{
                toDoList.DoWork();
            } , 2);  
        }
    },
    
    UpdateNumberFree(num){
        cc.log("UpdateNumberFree "+num+"   numberFreeSpin: "+this.numberFreeSpin+"  cacheTotalSpin: "+this.cacheTotalSpin);
        this.numberFreeSpin += parseInt(num);
        this.cacheTotalSpin += parseInt(num);
        cc.sys.localStorage.setItem("Key_Free_Dragon" , this.cacheTotalSpin);

        this.lbFreeTurn.string = this.numberFreeSpin.toString()+"/"+this.cacheTotalSpin.toString();
        this.effectChangeTurn.play();
    },

    SetTextFree()
    {
        this.lbFreeTurn.string = this.numberFreeSpin.toString()+"/"+this.cacheTotalSpin.toString();
    },

});
