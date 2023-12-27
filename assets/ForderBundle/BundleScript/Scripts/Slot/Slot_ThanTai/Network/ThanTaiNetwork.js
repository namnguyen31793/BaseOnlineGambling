
cc.Class({
    extends: require("SlotNetwork"),
    onLoad()
    {
        require("SlotNetworkManager").getIns().Set_NetworkInstance(Global.MainPlayerInfo.currentGameID,this);
    },
    ResponseServer(code, packet) {
       
        require("ThanTaiSpinController").getIns().ResponseNetwork(code, packet);
    },


});
