cc.Class({
    extends: require("SlotFreeManager"),
    ctor() {
        this.listFireBall = [];
    },

    properties: {
        freeTurn : cc.Animation,
        effectChangeTurn : cc.Animation,
        animFree : cc.Animation,
        animDragon : dragonBones.ArmatureDisplay,
        posFireBall : cc.Node,
        fireBall : cc.Node,
        wildColumn : cc.Animation,
        animNotifyEnd : cc.Animation,
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
                this.notifyFree.getComponent(cc.Animation).play("ShowFree");
            }, false);
            this.toDoList.Wait(2.5);
            this.toDoList.AddWork(()=>{
                this.notifyFree.getComponent(cc.Animation).play("HideFree");
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
        }
        if(numberFree > 0 && !this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                if(this.animFree)
                    this.animFree.play("HoaRong");
            }, false);
            this.toDoList.Wait(2);
            this.toDoList.AddWork(()=>{
                this.GetTotalWinCache();
                this.SetTextFree();
                this.slotView.isFree = true;
                this.freeTurn.play("ShowTurnFree");
            }, false);
        }
        if(numberFree > 0 || this.slotView.isFree) {
            let listWildSingle = this.slotView.normalManager.listWildSingle;
            if(listWildSingle.length > 0) {
               this.PhunLua(listWildSingle); 
            }
            let listWildColumn = this.slotView.normalManager.listWildColumn;
            if(listWildColumn.length > 0) {
                this.PhunLua(listWildColumn); 
                this.toDoList.Wait(0.5);
                this.toDoList.AddWork(()=>{
                    this.wildColumn.node.x = this.slotView.spinManager.listItem[listWildColumn[0]].node.x;
                    this.wildColumn.node.active = true;
                    this.wildColumn.play();
                }, false);
                this.toDoList.Wait(1);
                this.toDoList.AddWork(()=>{
                    for(let i = 0; i < listWildColumn.length; i++) {
                        this.slotView.spinManager.listItem[listWildColumn[i]].node.active = false;
                    }
                }, false);
            }
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
            this.toDoList.Wait(1);
            //show money win
        }
        if(numberFree == 0 && this.slotView.isFree) {
            this.toDoList.AddWork(()=>{
                this.slotView.isFree = false;
                this.animNotifyEnd.node.active = true;
                this.animNotifyEnd.play("ShowEndFree");
                this.lbTotalWin.string = Global.Helper.formatNumber(this.totalWin);
            }, false);
            this.toDoList.Wait(2.5);
            this.toDoList.AddWork(()=>{
                this.animNotifyEnd.play("HideEndFree");
                this.totalWin = 0;
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                this.animNotifyEnd.node.active = false;
                if(this.animFree)
                    this.animFree.play("HoaCa");
            }, false);
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                this.slotView.normalManager.EndFree();
                this.freeTurn.play("HideTurnBonus");
                this.ShowTotalWin(this.toDoList);
            }, true);
        }
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    PhunLua(listWild) {
        let listHaveWild =  this.slotView.normalManager.listItemWildFree;
        this.toDoList.AddWork(()=>{
            if(this.animDragon)
                this.animDragon.playAnimation("active", 0);
        }, false);
        this.toDoList.Wait(0.6);
        this.toDoList.AddWork(()=>{
            for(let i = 0; i < listWild.length; i++) {
                if(listHaveWild[listWild[i]] == null){
                    if(i >= this.listFireBall.length) {
                        let ball = cc.instantiate(this.fireBall);
                        ball.parent = this.posFireBall.parent;
                        this.listFireBall[this.listFireBall.length] = ball;
                    }
                    this.listFireBall[i].active = true;
                    this.listFireBall[i].setPosition(this.posFireBall.getPosition());
                    let target = this.slotView.spinManager.listItem[listWild[i]].node;
                    let direction = cc.v2(target.x - this.listFireBall[i].x , target.y - this.listFireBall[i].y);
                    this.listFireBall[i].angle = Math.atan2(direction.x , direction.y) * -180 /   Math.PI;
                    this.listFireBall[i].runAction(cc.moveTo(1,target.getPosition()));
                }
            }
        }, false);
        this.toDoList.Wait(0.8);
        this.toDoList.AddWork(()=>{
            if(this.animDragon)
                this.animDragon.playAnimation("waiting", 0);
        }, false);
        this.toDoList.Wait(0.2);
        this.toDoList.AddWork(()=>{
            for(let i = 0; i < this.listFireBall.length; i++) {
                this.listFireBall[i].active = false;
            }
            for(let i = 0; i < listWild.length; i++) {
                if(listHaveWild[listWild[i]] == null){
                    this.slotView.spinManager.listItem[listWild[i]].boomObject.play();
                }
            }
        }, false);
        this.toDoList.Wait(0.6);
        this.toDoList.AddWork(()=>{
            for(let i = 0; i < listWild.length; i++) {
                this.slotView.itemManager.SetImage(2, this.slotView.spinManager.listItem[listWild[i]]);
            }
            this.slotView.normalManager.CheckFreeWild();
        }, false);
    },

    CheckItemWild() {

    },

    

});
