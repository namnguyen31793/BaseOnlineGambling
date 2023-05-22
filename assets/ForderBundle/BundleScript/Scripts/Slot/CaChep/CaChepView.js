

cc.Class({
    extends: require("SlotView"),

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.DRAGON_PHOENIX;
        this.lineData = 50;
    },

    CallRequestGetJackpotInfo() {
        this.netWork.RequestGetJackpotInfo(this.gameType);
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

    OnSpinDone() {

    },

    RequestSpin(isRequest) {
        this._super(isRequest);
        this.normalManager.EndBonus();
    },

    CheckBonus(bonusValue, total, accountBalance, bonusTurn, isTakeJackpot) {
        if(bonusValue > 0) {
            if(this.isBonus) {
                this.bonusManager.EndBonus(bonusValue, accountBalance, isTakeJackpot);
            } else {
                this.isBonus = true;
                this.PlayBonusStart();
                this.bonusManager.ShowBonusGame(bonusTurn);
            }
        } else {
            if(this.isBonus) {
                this.bonusManager.CheckBonus(bonusTurn);
            } else {
                this.toDoList.DoWork();
            }
              
        }
    },

    SetFreeSpin(numberFree, isNotify = false, lineWin, winNormalValue, totalWin) {
        this.freeManager.ShowFree(numberFree, isNotify, lineWin, winNormalValue, totalWin);
    },

    UpdateMoneyResult(winNormalValue, isTakeJackpot, isWaitRunMoneyWin = false) {
        this._super(winNormalValue, false, false);
    },
    
});
