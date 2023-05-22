cc.Class({
    extends: require("MayaView"),

    properties: {
        
    },

    onLoad() {
        this.Init();
        this.isAuto = true;
        this.toDoList = this.node.addComponent("ToDoList");
        this.itemManager.Init(this);
        this.spinManager.Init(this);
        this.drawLineManager.Init(this);
        this.normalManager.Init(this);
        this.freeManager.Init(this);
        this.bonusManager.Init(this);
        this.effectManager.Init(this);
        this.soundControl.Init();
        this.bg = this.node.getChildByName("BGContainer");
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

    UpdateMoneyNormalGame(winMoney, accountBalance) {
        
    },

    RequestSpin(isRequest = true) {
        if(Global.SlotNetWork.slotView.battleManager.rivalSpin <= 0)
            return;
        this.isSpin = true;
        this.PlaySpin();
        this.effectManager.HideWinMoney();
        this.drawLineManager.StopDraw();
        this.spinManager.PlayEffectSpin();
        Global.SlotNetWork.RequestRivalSpinBattle();
    },

    UpdateSessionID(sessionID) {
        this.StopSpin();
    },

    UpdateMoneyResult(winNormalValue, totalValue, isTakeJackpot, isWaitRunMoneyWin = false) {
        if(this.isFree) {
            this.freeManager.AddTotalWin(winNormalValue);
        }
        if(!isTakeJackpot) {
            let isBigWin = this.CheckBigWin(winNormalValue);
            if(winNormalValue > 0) {
                if(!isBigWin) {
                    this.PlayWinMoney();
                    this.effectManager.ShowWinMoney(winNormalValue);
                    if(isWaitRunMoneyWin) {
                        this.scheduleOnce(()=>{
                            this.UpdateWinValue(winNormalValue);
                            this.toDoList.DoWork();
                        } , 1);  
                    } else {
                        this.UpdateWinValue(winNormalValue);
                        this.toDoList.DoWork();
                    }
                } else {
                    this.PlayBigWin();
                    this.effectManager.ShowBigWin(winNormalValue, this.toDoList);
                }
            } else {
                this.UpdateWinValue(winNormalValue);
                this.toDoList.DoWork();
            }
        }else{
            this.PlayJackpot();
            this.effectManager.ShowJackpot(totalValue, this.toDoList);
        }  
    },

    ActionAutoSpin() {
        if(!this.isSpin && this.isAuto ) {
            this.effectManager.ClickCloseNotify(false);
            this.effectManager.ClickCloseFree();
            this.effectManager.ClickCloseBonus();
            this.bonusManager.isCheckAuto = false;
            this.RequestSpin();
        }
    },

    DeActiveButtonMenu() {
        this.activeButton = false;
    },

    ActiveButtonMenu() {
        this.activeButton = true;
        this.isSpin = false;
        this.CheckEndChallenge();
        this.CheckEndBattle();
        this.UpdateCurrentQuest();
    },

    ShowCommandUseItemBonusTurn(todolist = null){
        cc.log("ShowCommandUseItemBonusTurn");
        if(todolist != null)
            todolist.DoWork();
    },

    UpdateWinValue(winMoney) {
        Global.OtherBattle.ShowAccountBalance();
    },

    SetMoneyWin(bonusValue) {
    },

    OnUpdateMoney(gold) {
    },

    CheckBigWin(winMoney, mutil = 6) {
        let isBigWin = false;
        if(winMoney >= Global.dataBattle.betValue * mutil) 
            isBigWin = true;
        return isBigWin;
    },
    
});
