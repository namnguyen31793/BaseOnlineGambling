

cc.Class({
    extends: require("CaChepView"),

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.MAYA_GAME;
        this.lineData = 50;
    },

    onLoad()
    {
        this._super();
    },
});
