

cc.Class({
    extends: require("SlotView"),

    ctor(){
        this.maxTotalBetValue = 0;
    },
    properties: {
        selectRoom : require("TaydukySelectRoom"),
    },

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.TAY_DU_KY;
        this.lineData = 20;
        this.selectRoom.Init(this);
    },

    AddScheduleAnimWait(){
        //show all line start
        this.drawLineManager.ShowAllLineStart();
       this._super();
    },

    CallRequestGetJackpotInfo() {
        this.netWork.RequestGetJackpotInfo(this.gameType);
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        lineData = 20;//fix cung 20
        cc.log("OnGetAccountInfo "+totalBetValue);
        this.lineData = lineData;  
        this.menuView.UpdateBetValue(totalBetValue);
        this._super(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
    },


    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extendMatrixDescription);
    },

    OnSpinDone() {
        this.normalManager.CheckBonus();
    },

    RequestSpin(isRequest) {
        this._super(isRequest);
        this.normalManager.ResetUINewTurn();
    },
    
    SetFreeSpin(numberFree, isNotify = false, lineWin, winNormalValue, isTakeJackpot) {
        this.freeManager.ShowFree(numberFree, isNotify, lineWin, winNormalValue, isTakeJackpot);
    },

    UpdateMatrix(matrix) {
        this.spinManager.UpdateMatrix(matrix);
    },

    HideWildFree(){
        this.spinManager.HideWildFree();
    },
    
    ActiveColorButtonNormalGame(){
        this.itemManager.ActiveColorButtonNormalGame();
    },
    
    EndAnimPreWin(freeTurn, bonusTurn) {
        if(!this.isFree && !this.isBonus) {
            if(freeTurn > 0 || bonusTurn > 0) {
                if(freeTurn > 0)
                    this.spinManager.EndItemBonusPreWin();
                if(bonusTurn > 0)
                    this.spinManager.EndItemFreePreWin();
                this.scheduleOnce(()=>{
                    this.EndAllItemPreWin();
                } , 1.5);
            } else {
                this.EndAllItemPreWin();
            }
        } else {
            this.EndAllItemPreWin();
        }
    },

    EndAllItemPreWin() {
        this.spinManager.EndAllItemPreWin();
        this.toDoList.DoWork();
    },

    OnUpdateLastMatrix(lastMatrix) {
        if(lastMatrix.length != 0) {
            let matrix = this.normalManager.ParseMatrix(lastMatrix);
            let extendMatrix = this.normalManager.ParseExtendMatrix(lastMatrix);
            this.spinManager.UpdateMatrix(matrix, true);
        }
    },

    PlayAnimPullCurtain(){
        this.effectManager.PlayAnimPullCurtain();
    },

    SetTypeJackpot(type){
        this.effectManager.SetTypeJackpot(type);
    },

    ShowNotifyWinFree(num){
        this.effectManager.ShowNotifyWinFree(num);
    },

    HideNotifyWinFree(){
        this.effectManager.HideNotifyWinFree();
    },

    UpdateJackpotValue(listJackpotValue) {
        this.menuView.UpdateJackpotValue(listJackpotValue);
    },

    UpdateTotalBetValue(betValue) {
        //this.totalBetValue = (betValue/20) * this.lineData;
        this.totalBetValue = betValue;
        this.maxTotalBetValue = betValue;
        this.menuView.UpdateTotalBetValue(betValue);
    },

    UpdateLineBet() {
        this.totalBetValue = (this.maxTotalBetValue/20) * this.lineData;
        this.menuView.UpdateTotalBetValue(this.totalBetValue );
    },

    GetBetValue() {
        cc.log("GetBetValue: "+this.totalBetValue);
        return this.totalBetValue;
    },

    ShowSelectRoom(){
        this.selectRoom.ShowSelectRoom();
    },

    UpdateMoneyResult(winNormalValue, totalValue, isTakeJackpot, isWaitRunMoneyWin = false) {
        // if(!this.isBattle) {
        //     require("WalletController").getIns().TakeBalance(this.slotType)
        // }
        if(this.isFree) {
            this.freeManager.AddTotalWin(winNormalValue);
        }
        if(!isTakeJackpot) {
            let isBigWin = this.CheckBigWin(winNormalValue);
          
            if(winNormalValue > 0) {
                if(!isBigWin) {
                    if(!this.isBattle) {
                        require("WalletController").getIns().TakeBalance(this.slotType)
                    }
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
                    this.menuView.ResetValueCacheWin();
                    this.PlayBigWin();
                    this.effectManager.ShowBigWin(winNormalValue, this.toDoList, true, true, true);
                }
            } else {
                this.UpdateWinValue(winNormalValue);
                this.toDoList.DoWork();
            }
        }else{
            this.PlayJackpot();
            this.effectManager.ShowJackpot(totalValue, this.toDoList, true, true);
        }  
    },
});
