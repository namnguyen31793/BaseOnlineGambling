cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onClick() {
        require("SendRequest").getIns().MST_Client_Slot_Play_X2();
    },
});
