cc.Class({
    extends: require("SlotBonusManager"),

    ctor() {
        this.listEffect = [];
        this.cacheBonusTurn = 0;
    },

    properties: {
        lbTurn : cc.Label,
        lbNotifyTurn : cc.Label,
        bonusTurn : cc.Animation,
        effectChangeTurn : cc.Animation,
        linhvat : cc.Animation,
        effectThaiCuc : cc.Node,
        bgAnim : cc.Animation,
        endPos : cc.Node,
    },

    ShowBonusGame(bonusTurn) {
        this.lbTurn.string = bonusTurn.toString();
        this.lbNotifyTurn.string = bonusTurn + " LƯỢT";
        this.bonusObj.active = true;
        this.toDoList.CreateList();
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.notifyBonus.active = true;
        }, false);
        this.toDoList.Wait(1.5);
        this.toDoList.AddWork(()=>{
            this.notifyBonus.active = false;
            this.bgAnim.play("BgDark");
        }, false);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(bonusTurn, true);
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.linhvat.play("VibrateCa");
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.linhvat.play("Tranform");
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.bonusTurn.play("ShowTurnBonus");
        }, false);
        this.toDoList.Wait(1);
        this.ProceduBonus();
        this.ProceduExtra();
        this.toDoList.AddWork(()=>{
            this.slotView.spinManager.SetColorItemSpin(false);
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    CheckBonus(bonusTurn) {
        this.toDoList.CreateList();
        this.ProceduBonus();
        this.ProceduExtra();
        this.toDoList.AddWork(()=>{
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(bonusTurn, true);
        }, false);
        this.toDoList.Wait(0.4);
        this.toDoList.AddWork(()=>{
            this.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    EndBonus(bonusValue,accountBalance) {
        this.toDoList.CreateList();
        this.ProceduBonus();
        this.ProceduExtra();
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(0, true);
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.linhvat.play("EndBonus");
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.linhvat.play("LinhVatIdle");
            let list = this.slotView.normalManager.listItemBonus;
            for(let i = 0; i < list.length; i++) {
                if(list[i] != null) {
                    let eff = cc.instantiate(this.effectThaiCuc);
                    eff.parent = this.effectThaiCuc.parent;
                    let pos = list[i].node.getPosition()
                    eff.setPosition(pos);
                    eff.active = true;
                    eff.runAction(cc.moveTo(0.5,this.endPos.getPosition()));
                    this.listEffect[this.listEffect.length] = eff;
                }
                
            }
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.slotView.soundControl.PlayBigWin();
            for(let i = 0; i < this.listEffect.length; i++) {
                this.listEffect[i].destroy();
            }
            this.listEffect = [];
            this.VibrateScreen();
            this.slotView.menuView.SetMoneyWin(bonusValue);
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(0, false);
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.slotView.isBonus = false;
            this.slotView.UpdateAccountBalance(accountBalance);
            
        }, false);   
        this.toDoList.AddWork(()=>{
            this.slotView.spinManager.SetColorItemSpin(true);
            this.bgAnim.play("BgLight");
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.Play();

    },

    GetListBonusUnActive() {
        let list = this.slotView.normalManager.listItemBonus;
        cc.log(list);
        return this.GetListUnActive(list);
    },

    GetListExtraUnActive() {
        let list = this.slotView.normalManager.listItemExtra;
        return this.GetListUnActive(list);
    },

    GetListUnActive(list) {
        let rs = [];
        for(let i = 0; i < list.length; i++) {
            if(list[i] != null) {
                if(!list[i].isShowPrize) {
                    rs[rs.length] = list[i];
                }
            }
        }
        return rs;
    },

    ProceduBonus() {
        this.slotView.normalManager.CheckBonus();
        let rs = this.GetListBonusUnActive();
        if(rs.length > 0) {
            this.toDoList.AddWork(()=>{
                this.linhvat.play("RotateThaiCuc");
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs.length; i++) {
                    let eff = cc.instantiate(this.effectThaiCuc);
                    eff.parent = this.effectThaiCuc.parent;
                    eff.active = true;
                    eff.runAction(cc.moveTo(0.5,rs[i].node.getPosition()));
                    this.listEffect[this.listEffect.length] = eff;
                }
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                this.VibrateScreen();
                for(let i = 0; i < this.listEffect.length; i++) {
                    this.listEffect[i].destroy();
                }
                this.listEffect = [];
                for(let i = 0; i < rs.length; i++) {
                    rs[i].boomObject.play();
                }
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs.length; i++) {
                    rs[i].bonusObject.active = true;
                    rs[i].SetValueBonus();
                }
            }, false);
        }
    },

    ProceduExtra() {
        let rs = this.GetListExtraUnActive();
        if(rs.length > 0) {
            this.toDoList.Wait(1.5);
            this.toDoList.AddWork(()=>{
                let listItemBonus = this.slotView.normalManager.listItemBonus;
                for(let temp in listItemBonus){
                    let eff = cc.instantiate(this.effectThaiCuc);
                    eff.parent = this.effectThaiCuc.parent;
                    eff.active = true;
                    eff.setPosition(listItemBonus[temp].node.getPosition());
                    eff.runAction(cc.moveTo(0.5,rs[0].node.getPosition()));
                    this.listEffect[this.listEffect.length] = eff;
                }
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                this.VibrateScreen();
                for(let i = 0; i < this.listEffect.length; i++) {
                    this.listEffect[i].destroy();
                }
                this.listEffect = [];
                for(let i = 0; i < rs.length; i++) {
                    rs[i].boomObject.play();
                }
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs.length; i++) {
                    rs[i].bonusObject.active = true;
                    rs[i].SetValueBonus();
                }
                for(let temp in this.slotView.normalManager.listItemExtra){
                    this.slotView.normalManager.listItemBonus[temp] = this.slotView.normalManager.listItemExtra[temp];
                }
                // this.slotView.normalManager.listItemExtra = {};
            }, false);
        }
    },

    UpdateBonusTurn(bonusTurn, isActive) {
        if(isActive) {
            if(bonusTurn >= this.cacheBonusTurn)
                this.effectChangeTurn.play();
            this.lbTurn.string = bonusTurn;
        } else {
            this.bonusObj.active = false;
            this.bonusTurn.play("HideTurnBonus");
        }
        this.cacheBonusTurn = bonusTurn;
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
