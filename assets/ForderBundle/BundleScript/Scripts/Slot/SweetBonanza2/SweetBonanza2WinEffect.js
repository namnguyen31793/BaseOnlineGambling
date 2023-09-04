
cc.Class({
    extends: require("BigWinEffect"),

    properties: {
    },

    ShowBigWin(winMoney, betValue, toDoList, slotView, isUpdateWinValue = true) {
        this._super(winMoney, betValue, toDoList, slotView, true, isUpdateWinValue);
        this.slotView.effectManager.PlayStartBigWinCharater();
    },

    EndBigWin() {
        this._super();
        this.slotView.effectManager.PlayEndBigWinCharacter();
    },
});
