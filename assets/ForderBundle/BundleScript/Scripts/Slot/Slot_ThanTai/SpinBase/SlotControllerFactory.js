
    var SlotControllerFactory;
    var SlotControllerFactory = cc.Class({
        statics: {
            getIns() {
                if (this.self == null) this.self = new SlotControllerFactory();
                return this.self;
            }
        },
    

        GetSlotController(GameID) {
           switch(GameID)
           {
                case  Global.Enum.GAME_TYPE.THAN_TAI: 
                    return require("ThanTaiSpinController").getIns();
                case  Global.Enum.GAME_TYPE.THE_WITCHER: 
                    return require("Tw_SpinController").getIns();
                case  Global.Enum.GAME_TYPE.TU_LINH: 
                    return require("TL_SpinController").getIns();
                
           }
        },

        GetCurrentSlotController()
        {
            return this.GetSlotController(Global.MainPlayerInfo.currentGameID);
        },

});
module.exports = SlotControllerFactory;