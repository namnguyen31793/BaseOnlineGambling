

cc.Class({
    extends: require("SlotView"),

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.JUMP_GAME;
    },

    CheckHideFreeUI() {
        this.freeManager.CheckHideFreeUI();
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot , jumpPosData) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, jumpPosData)
    },

    CacheLineWin(listLineWinData) {
        this.listLineWinData = listLineWinData;
    },
    
});
