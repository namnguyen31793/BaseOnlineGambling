// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        GameID: {
            default: 19,               // Giá trị mặc định
            type: cc.Integer            // Loại dữ liệu là số nguyên (int)
        },
        RoomID: {
            default: 1,               // Giá trị mặc định
            type: cc.Integer            // Loại dữ liệu là số nguyên (int)
        },
       

    },
   
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad () {
        Global.MainPlayerInfo.SetCurrentGameID(this.GameID);
        let slotController =  require("SlotControllerFactory").getIns().GetSlotController(this.GameID);
        slotController.setRoomID(this.RoomID);
        slotController.setGameID(this.GameID);
    },
    onDestroy()
    {
            Global.MainPlayerInfo.SetCurrentGameID(0);
    },

    // update (dt) {},
});
