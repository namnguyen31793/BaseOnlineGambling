cc.Class({
    extends: require("SlotNormalGameManager"),
    ctor() {
        this.listWild = [];
        this.countFree = 3;
        this.jumpPosData = null
    },

    properties: {
        wildContent : cc.Node,
        itemWildJump : cc.Node,
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, jumpPosData) {

        if(isTakeJackpot)
            winNormalValue = totalWin;
        let bonusTurn = 0;
        if(winBonusValue > 0)
            bonusTurn = 1;

        this.jumpPosData = jumpPosData;

        this.slotView.UpdateMatrix(this.ParseMatrix(matrix));
        let mAccountBalance = accountBalance;
        if(this.slotView.isBonus)
            mAccountBalance = accountBalance-winBonusValue;
        this.slotView.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
        let toDoList = this.slotView.toDoList;
        let slotView = this.slotView;
        toDoList.CreateList();
        toDoList.AddWork(()=>slotView.GetSpinResult(),true);
        toDoList.AddWork(()=>slotView.UpdateSessionID(spinId),false);
        toDoList.AddWork(()=>slotView.EndAnimPreWin(freeSpinLeft, bonusTurn),true);
        slotView.CacheLineWin(this.ParseLineData(listLineWinData));
        let isWait = freeSpinLeft > 0 || winBonusValue > 0;
        if(this.slotView.isFree) {
            toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, winNormalValue),true);
        } else {
            toDoList.AddWork(()=>slotView.UpdateLineWinData(this.ParseLineData(listLineWinData)),false);
            toDoList.AddWork(()=>slotView.UpdateMoneyResult(winNormalValue, totalWin, isTakeJackpot, isWait),true);
            toDoList.AddWork(()=>slotView.SetFreeSpin(freeSpinLeft, true, winNormalValue),true);
        }
        toDoList.AddWork(()=>slotView.CheckBonus(winBonusValue, totalWin, accountBalance, bonusTurn, isTakeJackpot),true);
        toDoList.AddWork(()=>slotView.UpdateJackpotValue(currentJackpotValue),false);
        // toDoList.AddWork(()=>slotView.CheckJackpot(isTakeJackpot, totalWin),false);
        if(freeSpinLeft > 0 || winBonusValue) {
        } else {
            slotView.CheckTimeShowPrize(winNormalValue);
        }
        toDoList.AddWork(()=>slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>slotView.ActionAutoSpin(),false);
        toDoList.Play();
    },

    resetWild() {
        this.listWild = [];
        for(let i = this.wildContent.children.length - 1; i >=0; i--) {
            this.wildContent.children[i].destroy();
        }
    },

    SetJumpItem(toDoList) {
        if(!this.jumpPosData) {
            toDoList.DoWork();
        } else {
            let listItem = this.slotView.spinManager.listItem;
            this.wildContent.setSiblingIndex(this.wildContent.parent.children.length-1);
            for(let i = 0; i < this.listWild.length; i++) {
                this.listWild[i].isMove = false;
            }
            for (let i = 0; i < this.jumpPosData.length; i++) {
                if(this.jumpPosData[i].SPos != 0 && this.jumpPosData[i].EPos != 0) {
                    let hasWild = false;
                    for(let j = 0; j < this.listWild.length; j++) {
                        if(this.listWild[j].pos === this.jumpPosData[i].SPos && !this.listWild[i].isMove) {
                            hasWild = true;
                            this.listWild[i].isMove = true;
                            let posEnd = listItem[this.jumpPosData[i].EPos-1].node.getPosition();
                            this.listWild[j].data.runAction(cc.moveTo(0.5, cc.v2(posEnd.x, posEnd.y)).easing(cc.easeSineOut()));
                            this.listWild[j].pos = this.jumpPosData[i].EPos;
                        }
                    }
                    if(!hasWild) {
                        let jumpNew = cc.instantiate(this.itemWildJump);
                        jumpNew.parent = this.wildContent;
                        jumpNew.setPosition(listItem[this.jumpPosData[i].EPos-1].node.getPosition());
                        jumpNew.active = true;
                        jumpNew.scale = 0;
                        jumpNew.runAction(cc.scaleTo(1 , 1).easing(cc.easeSineOut()));
                        let wild = {
                            pos : this.jumpPosData[i].EPos,
                            data : jumpNew,
                            isMove : false,
                        }
                        this.listWild.push(wild);
                    }
                }
                else if(this.jumpPosData[i].SPos == 0){    //jump moi
                    let jumpNew = cc.instantiate(this.itemWildJump);
                    jumpNew.parent = this.wildContent;
                    jumpNew.setPosition(listItem[this.jumpPosData[i].EPos-1].node.getPosition());
                    jumpNew.active = true;
                    jumpNew.scale = 0;
                    jumpNew.runAction(cc.scaleTo(1 , 1).easing(cc.easeSineOut()));
                    let wild = {
                        pos : this.jumpPosData[i].EPos,
                        data : jumpNew
                    }
                    this.listWild.push(wild);
                }else if(this.jumpPosData[i].EPos == 0){    //jump bien mat
                    for(let j = 0; j < this.listWild.length; j++) {
                        if(this.listWild[j].pos == this.jumpPosData[i].SPos) {
                            this.scheduleOnce(()=>{
                                //  cc.log("show:"+this.jumpPosData[i].Value);
                                    this.slotView.effectManager.ShowWinBetMoney(this.jumpPosData[i].Value * this.slotView.GetBetValue());
                            } , 2);
                            this.listWild[j].pos = -1;
                            this.listWild[j].data.runAction(cc.moveTo(0.5, cc.v2(this.listWild[j].data.position.x - 200, this.listWild[j].data.position.y))
                            ,cc.callFunc(() => {
                                
                                // this.listWild[j].data.active = false;
                                
                            }));
                        }
                    }
                }else{
                    
                }
            }
    
            this.scheduleOnce(()=>{
                for(let i = 0; i < this.listWild.length; i++) {
                    // this.listWild[i].data.active = false;
                }
                toDoList.DoWork();
            } , 1.2);  
        }
        
    },

    ShowJumpWild() {
        for(let i = 0; i < this.listWild.length; i++) {
            this.listWild[i].data.active = true;
        }
    },
});
