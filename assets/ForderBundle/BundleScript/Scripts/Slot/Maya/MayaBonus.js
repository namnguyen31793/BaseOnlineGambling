

cc.Class({
    extends: require("CaChepBonus"),
    ctor() {
        this.stateBonus = 0; //0-chua bat dau, 1-show,2-end,3-clear
    },

    properties: {
        character : dragonBones.ArmatureDisplay,
        isBattle : {
            default: false,
        },
        XuanHienBonus_Sound : cc.AudioClip,
        DapKich_Sound : cc.AudioClip,
    },

    Init(slotView) {
        this.slotView = slotView;
    },

    ShowBonusGame(bonusTurn) {
    
        this.stateBonus = 1;
        this.lbTurn.string = bonusTurn.toString();
        this.lbNotifyTurn.string = bonusTurn.toString();
        this.bonusObj.active = true;
        this.toDoList.CreateList();
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
            this.notifyBonus.active = true;
            this.notifyBonus.getComponent(cc.Animation).play("NotifyBonus");
            cc.audioEngine.playEffect(this.XuanHienBonus_Sound, false);       
        }, false);
        this.toDoList.Wait(0.5);
       
        this.toDoList.AddWork(()=>{
            let children = this.notifyBonus.children[1].children;
            for(let i = 0; i < children.length; i++) {
                children[i].getComponent(cc.Animation).play();
            }
        }, false);
        this.toDoList.Wait(2);
        this.toDoList.AddWork(()=>{
            this.notifyBonus.getComponent(cc.Animation).play("HideNotifyBonus");
        }, false);
        this.toDoList.Wait(1);
         this.toDoList.AddWork(()=>{
            this.notifyBonus.active = false;
            if(!this.isBattle) {
                this.character.node.setSiblingIndex(0);
                this.character.playAnimation("backhunter",1);
            }
             
             this.bgAnim.play("BgDark");
         }, false);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(bonusTurn, true);
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            if(!this.isBattle) {
                this.character.playAnimation("hunter",1);
            }
        }, false);
        this.toDoList.Wait(0.3);
        this.toDoList.AddWork(()=>{
            if(!this.isBattle) {
                this.character.node.setSiblingIndex(1);
            }
        }, false);
        this.toDoList.Wait(0.2);
        this.toDoList.AddWork(()=>{
            if(!this.isBattle) {
                this.character.playAnimation("waitinghunter",0);
            }
        }, false);
        this.toDoList.AddWork(()=>{
            this.bonusTurn.play("StartBonus");
        }, false);
        this.toDoList.Wait(1);
        this.ProceduBonus();
        this.toDoList.AddWork(()=>{
            this.slotView.spinManager.SetColorItemSpin(false);
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    CheckBonus(bonusTurn) {
        this.toDoList.CreateList();
        this.ProceduBonus();
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
        this.stateBonus = 2;
        this.toDoList.CreateList();
        this.ProceduBonus();
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(0, true);
        }, false);
        this.toDoList.Wait(1);
        this.toDoList.AddWork(()=>{
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
            this.slotView.PlayBigWin();
            this.slotView.menuView.SetMoneyWin(bonusValue);
            if(!isTakeJackpot)
                this.slotView.effectManager.ShowBigWin(bonusValue, this.toDoList);
            else this.slotView.effectManager.ShowJackpot(bonusValue, this.toDoList);
        }, true);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            this.UpdateBonusTurn(0, false);
        }, false);
        this.toDoList.Wait(0.1);
        this.toDoList.AddWork(()=>{
            this.slotView.isBonus = false;
        }, false);   
        this.toDoList.AddWork(()=>{
            this.slotView.spinManager.SetColorItemSpin(true);
            if(!this.isBattle) {
                this.character.node.setSiblingIndex(0);
                this.character.playAnimation("backpeople",1);
            }
            this.bgAnim.play("BgLight");
        }, false);
        this.toDoList.Wait(0.5);
        this.toDoList.AddWork(()=>{
            if(!this.isBattle) {
                this.character.playAnimation("people",1);
            }
        }, false);
        this.toDoList.Wait(0.3);
        this.toDoList.AddWork(()=>{
            if(!this.isBattle) {
                this.character.node.setSiblingIndex(1);
            }
        }, false);
        this.toDoList.Wait(0.2);
        this.toDoList.AddWork(()=>{
            if(!this.isBattle) {
                this.character.playAnimation("waitingpeople",0);
            }
            
        }, false);
        this.toDoList.AddWork(()=>{
            if(!this.isBattle) {
                this.slotView.UpdateAccountBalance(accountBalance);
            }
            this.slotView.toDoList.DoWork();
        }, false);
        this.toDoList.Play();
    },

    ProceduBonus() {
        this.slotView.normalManager.CheckBonus();
        let rs = this.GetListBonusUnActive();
        if(rs.length > 0) {
            this.toDoList.Wait(0.5);
            this.toDoList.AddWork(()=>{
                if(!this.isBattle) {
                    this.character.playAnimation("stampinghunter", 0);
                  //  cc.audioEngine.playEffect(this.DapKich_Sound, false);   
                }
            }, false);
            this.toDoList.Wait(0.4);
            this.toDoList.AddWork(()=>{
                if(!this.isBattle) {           
                    cc.audioEngine.playEffect(this.DapKich_Sound, false);   
                }
            }, false);
            this.toDoList.Wait(0.7);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs.length; i++) {
                    rs[i].node.active = true;
                    rs[i].item.node.active = false;
                    rs[i].bonusObject.active = true;
                    rs[i].AnimHideText();
                }
            }, false);
            this.toDoList.Wait(0.245);
            this.toDoList.AddWork(()=>{
                for(let i = 0; i < rs.length; i++) {
                    rs[i].SetValueBonus();
                }
            }, false);
            this.toDoList.Wait(0.055);
            this.toDoList.AddWork(()=>{
                if(!this.isBattle) {
                    this.character.playAnimation("waitinghunter", 0);
                }
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
            this.bonusTurn.play("HideNotifyTurn");
        }
        this.cacheBonusTurn = bonusTurn;
    },
    
});
