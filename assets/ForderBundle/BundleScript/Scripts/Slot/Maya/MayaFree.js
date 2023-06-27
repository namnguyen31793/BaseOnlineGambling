cc.Class({
    extends: require("CaChepFree"),

    properties: {      
        XuanHienFree_Sound : cc.AudioClip,
        StartFreeNotifi_Sound: cc.AudioClip,
    },

    ShowFree(numberFree, isNotify, lineWin, winNormalValue, totalWin) {
        this.toDoList.CreateList();
        this.numberFreeSpin = numberFree;
        if(isNotify && numberFree > 0 && !this.slotView.isFree) {
            //new
            this.ClearTotalWinCache();
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.lbNotifyTurn.string = numberFree.toString();
                this.notifyFree.active = true;
                this.notifyFree.getComponent(cc.Animation).play("NotifyBonus");
                cc.audioEngine.playEffect(this.StartFreeNotifi_Sound, false);       
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                let children = this.notifyFree.children[1].children;
                for(let i = 0; i < children.length; i++) {
                    children[i].getComponent(cc.Animation).play();
                }
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.notifyFree.getComponent(cc.Animation).play("HideNotifyBonus");
            }, false);
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
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                if(this.animDragon)
                    this.animDragon.playAnimation("stampingpeople", 0);
            }, false);
            this.toDoList.Wait(0.54);
            this.toDoList.AddWork(()=>{
                this.animFree.play("GateStart");
                cc.audioEngine.playEffect(this.XuanHienFree_Sound, false);       
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                if(this.animDragon)
                    this.animDragon.playAnimation("waitingpeople", 0);
            }, false);
            this.toDoList.AddWork(()=>{
                this.VibrateScreen();
            }, false);
            this.toDoList.Wait(1.5);
            
            this.toDoList.AddWork(()=>{
                this.SetTextFree();
                this.slotView.isFree = true;
                this.slotView.spinManager.isFree = true;
                this.freeTurn.play("StartFree");
            }, false);
        }
        if(numberFree == 0 && this.slotView.isFree) {
            
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                if(this.animDragon)
                    this.animDragon.playAnimation("stampingpeople", 0);
            }, false);
            this.toDoList.Wait(0.54);
            this.toDoList.AddWork(()=>{
                this.VibrateScreen();
                this.animFree.play("GateEnd");
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                if(this.animDragon)
                    this.animDragon.playAnimation("waitingpeople", 0);
            }, false);
            this.toDoList.Wait(1);
            this.toDoList.AddWork(()=>{
                this.freeTurn.play("HideNotifyTurn");
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                this.animNotifyEnd.play("ShowEndFree");
                this.lbTotalWin.string = Global.Helper.formatNumber(this.totalWin);
            }, false);
            this.toDoList.Wait(2.5);
            this.toDoList.AddWork(()=>{
                this.ShowTotalWin(this.toDoList);
                this.animNotifyEnd.play("HideEndFree");
                this.slotView.isFree = false;
            }, true);
            this.toDoList.Wait(0.5);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    AnimOpenDoor(){
        this.animFree.play("GateOpenDoor");
    },

    AnimCloseDoor(){
        this.animFree.play("GateCloseDoor");
    },

    HideFree(){

    },

    VibrateScreen() {
        this.isShake = true;
        this.scheduleOnce(()=>{
            this.isShake = false;
            this.slotView.node.setPosition(0,0);
        }, 0.2)
    },

    update (dt) {
        if(this.isShake ){
            this.slotView.node.x = (Global.RandomNumber(-5 , 6));
            this.slotView.node.y = (Global.RandomNumber(-5 , 6));
        }
    }
});
