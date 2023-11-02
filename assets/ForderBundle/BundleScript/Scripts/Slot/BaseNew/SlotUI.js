
cc.Class({
    extends: cc.Component,

    ctor(){
        slotController : require("SlotController");
    },

    Init(slotController){
        this.slotController = slotController;
    },

    //kế thừa xử lý show maingame dầu tiên khi vào
    Show(){

    },
    //kế thừa ẩn main game quay về chọn room
    Hide(){

    },
});
