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
        effectEnd : cc.Node,
    },

    ShowBonusGame(bonusTurn) {
        this.lbTurn.string = bonusTurn.toString();
        this.lbNotifyTurn.string = bonusTurn.toString();
        this.bonusObj.active = true;
        this.toDoList.CreateList();
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.notifyBonus.active = true;
            this.notifyBonus.getComponent(cc.Animation).play("ShowBonus");
        }, false);
        this.toDoList.Wait(2);
        this.toDoList.AddWork(()=>{
            this.notifyBonus.getComponent(cc.Animation).play("HideBonus");
        }, false);
        this.toDoList.Wait(0.5);
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
            if(this.linhvat)
                this.linhvat.play("VibrateCa");
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            if(this.linhvat)
                this.linhvat.play("Tranform");
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.bonusTurn.play("ShowTurnBonus");
        }, false);
        this.toDoList.Wait(1);
        this.ShowStart();
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

    EndBonus(bonusValue,accountBalance, isTakeJackpot) {

        let valueJackpot = this.slotView.normalManager.listJackpot;
        let totalJackpot = 0;
        for(let temp in valueJackpot){
            totalJackpot += parseInt(valueJackpot[temp]);
        }

        this.toDoList.CreateList();
        this.ProceduBonus();
        this.ProceduExtra();
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(0, true);
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            if(this.linhvat)
                this.linhvat.play("EndBonus");
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            if(this.linhvat)
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
        }, false);
        this.toDoList.AddWork(()=>{
            let eff = cc.instantiate(this.effectEnd);
            eff.parent = this.effectThaiCuc.parent;
            eff.active = true;
            eff.setPosition(this.endPos.getPosition());
            let bet = this.slotView.GetBetValue();
            if(!isTakeJackpot){
                eff.getChildByName("money").getComponent("LbMonneyChange").setMoney(bonusValue/bet);
                eff.getChildByName("multi").getComponent(cc.Label).string = Global.Helper.formatNumber(bet);
                eff.getChildByName("total").getComponent(cc.Label).string = Global.Helper.formatNumber(bonusValue);
            }else{
                eff.getChildByName("money").getComponent("LbMonneyChange").setMoney(bonusValue/bet - totalJackpot);
                eff.getChildByName("multi").getComponent(cc.Label).string = Global.Helper.formatNumber(bet);
                eff.getChildByName("total").getComponent(cc.Label).string = Global.Helper.formatNumber(bonusValue - totalJackpot*bet);
            }
            eff.getComponent(cc.Animation).play("WinMoneyBonusEnd");
            this.listEffect[0] = eff;
        },false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(0, false);
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.slotView.isBonus = false;
        }, false);   
        this.toDoList.AddWork(()=>{
            this.slotView.spinManager.SetColorItemSpin(true);
            this.bgAnim.play("BgLight");
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            for(let i = 0; i < this.listEffect.length; i++) {
                this.listEffect[i].destroy();
            }
            this.listEffect = [];
            if(!isTakeJackpot){
                this.slotView.PlayBigWin();
                this.slotView.effectManager.ShowBigWin(bonusValue, this.toDoList);
            }else{
                this.slotView.PlayBigWin();
                this.slotView.effectManager.ShowJackpot(bonusValue, this.toDoList);
            }
        }, true);
        this.toDoList.AddWork(()=>{
            this.slotView.menuView.SetMoneyWin(bonusValue);
            this.slotView.UpdateAccountBalance(accountBalance);
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();

    },

    GetListBonusUnActive() {
        let list = this.slotView.normalManager.listItemBonus;
        return this.GetListUnActive(list);
    },

    GetListExtraUnActive() {
        let list1 = this.slotView.normalManager.listItemExtraSilver;
        let listSilver = this.GetListUnActive(list1, true);
        let list2 = this.slotView.normalManager.listItemExtraGold;
        let listGold = this.GetListUnActive(list2, true);
        return this.AddListUnActive(listSilver, listGold);
    },

    GetListUnActive(list, isSort = false) {
        
        let rs = [];
        for(let i = 0; i < list.length; i++) {
            if(list[i] != null) {
                if(!list[i].isShowPrize) {
                    rs[rs.length] = list[i];
                }
            }
        }
        if(isSort) {
            for(let i = 0; i < rs.length-1; i++) {
                for(let j = i+1; j < rs.length; j++) {
                    if(rs[i].prizeValue > rs[j].prizeValue) {
                        let temp = rs[i];
                        rs[i] = rs[j];
                        rs[j] = temp;
                    }
                }
            }
        }
        
        return rs;
    },

    AddListUnActive(list1, list2) {
        for(let i = 0; i < list2.length; i++) {
            list1[list1.length] = list2[i];
        }
        return list1;
    },

    ShowStart() {
        this.slotView.normalManager.CheckBonus();
        let rs = this.GetListBonusUnActive();
        cc.log(rs);
        if(rs.length > 0) {
            this.toDoList.AddWork(()=>{
                if(this.linhvat)
                    this.linhvat.play("RotateThaiCuc");
            }, false);
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
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs.length; i++) {
                    rs[i].bonusObject.active = true;
                    rs[i].SetValueBonus();
                }
            }, false);
        }
        let rs2 = this.GetListExtraUnActive();
        cc.log(rs2);
        if(rs2.length > 0) {
            this.toDoList.AddWork(()=>{
                if(this.linhvat)
                    this.linhvat.play("RotateThaiCuc");
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs2.length; i++) {
                    this.slotView.normalManager.listItemBonus[rs2[i].index] = rs2[i];
                    let eff = cc.instantiate(this.effectThaiCuc);
                    eff.parent = this.effectThaiCuc.parent;
                    eff.active = true;
                    eff.runAction(cc.moveTo(0.5,rs2[i].node.getPosition()));
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
                for(let i = 0; i < rs2.length; i++) {
                    rs2[i].boomObject.play();
                }
            }, false);
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs2.length; i++) {
                    rs2[i].bonusObject.active = true;
                    rs2[i].SetValueBonus2();
                }
            }, false);
        }
    },

    ProceduBonus() {
        this.slotView.normalManager.CheckBonus();
        let rs = this.GetListBonusUnActive();
        if(rs.length > 0) {
            this.toDoList.AddWork(()=>{
                if(this.linhvat)
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
            this.toDoList.Wait(0.5);
            let listEffect = [];
            let listPrize = [];
            let countEffect = [];
            let listbonus = [];
            let index = 0;
            for(let i = 0; i < rs.length; i++) {
                let listItemBonus = this.slotView.normalManager.listItemBonus;
                listbonus[i] = [];
                countEffect[i] = 0;
                for(let temp in listItemBonus){
                    listbonus[i][temp] = listItemBonus[temp]
                    if(rs[i].level == 2){
                        if(listItemBonus[temp].level < rs[i].level) {
                            countEffect[i] += 1;
                        }
                    }else{
                        if(listItemBonus[temp].level <= rs[i].level) {
                            countEffect[i] += 1;
                        }
                    }
                }
                this.slotView.normalManager.listItemBonus[rs[i].index] = rs[i];
                this.toDoList.Wait(1);
                this.toDoList.AddWork(()=>{
                    listEffect = [];
                    listPrize = [];
                    for(let temp in listbonus[index]){
                        if(rs[index].level == 2){
                            if(listbonus[index][temp].level < rs[index].level) {
                                let eff = cc.instantiate(this.effectThaiCuc);
                                eff.parent = this.effectThaiCuc.parent;
                                eff.active = false;
                                eff.setPosition(listbonus[index][temp].node.getPosition());
                                listEffect[listEffect.length] = eff;
                                listPrize[listPrize.length] = listbonus[index][temp].prizeValue;
                            }
                        }else{ 
                            if(listbonus[index][temp].level <= rs[index].level) {
                                let eff = cc.instantiate(this.effectThaiCuc);
                                eff.parent = this.effectThaiCuc.parent;
                                eff.active = false;
                                eff.setPosition(listbonus[index][temp].node.getPosition());
                                listEffect[listEffect.length] = eff;
                                listPrize[listPrize.length] = listbonus[index][temp].prizeValue;
                            }
                        }
                    }
                    for(let j = 0; j < listEffect.length; j++) {
                        listEffect[j].active = true;
                    }
                }, false);

                // this.toDoList.Wait(0.5);
                for(let j = 0; j < countEffect[i]; j++) {
                    this.toDoList.Wait(0.25);
                    this.toDoList.AddWork(()=>{
                        listEffect[j].runAction(cc.moveTo(0.25,rs[index].node.getPosition()));
                        this.scheduleOnce(()=>{
                            listEffect[j].active = false;
                        rs[index].AddPrizeValue(listPrize[j]);
                        } , 0.25);
                    }, false);
                }
                this.toDoList.Wait(0.5);
                this.toDoList.AddWork(()=>{
                    this.VibrateScreen();
                    for(let j = 0; j < listEffect.length; j++) {
                        listEffect[j].destroy();
                    }
                    listEffect = [];
                    rs[index].boomObject.play();
                }, false);
                this.toDoList.Wait(0.5);
                this.toDoList.AddWork(()=>{
                    rs[index].bonusObject.active = true;
                    rs[index].SetValueBonus2();
                    index += 1;
                }, false);
            }
            this.toDoList.AddWork(()=>{
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
    },

    
    
});
