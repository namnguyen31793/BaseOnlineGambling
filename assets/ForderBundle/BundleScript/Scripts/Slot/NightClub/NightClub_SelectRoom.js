cc.Class({
    extends: cc.Component,

    ctor(){
        this.slotController = null;
    },

    properties: {
        jackpotRoom1 : cc.Label,
        jackpotRoom2 : cc.Label,
        jackpotRoom3 : cc.Label,
        nodeTry : cc.Node,
    },

    Init(slotController){
        this.slotController = slotController;
        this.ShowSelectRoom();
    },

    SelectRoom(event, index){
        this.slotController.JoinSlot(index);
        if(index != 0){
            this.nodeTry.active = false;
        }else{
            //fake info mode try
            this.slotController.SetAccountInfoTry();
            this.nodeTry.active = true;
        }
        this.node.active = false;
    },

    ShowSelectRoom(){
        this.node.active = true;
        ApiController.RequestGetJackpotLobby( 1, Global.Enum.GAME_TYPE.NIGHT_CLUB, (data) => {
            if(data == "null" || data == ""){
            }else{
                this.jackpotRoom1.getComponent("LbMonneyChange").setMoney(parseInt(data));
            }
        }, this.ErrorCallBack);
        ApiController.RequestGetJackpotLobby( 2, Global.Enum.GAME_TYPE.NIGHT_CLUB, (data) => {
            if(data == "null" || data == ""){
            }else{
                this.jackpotRoom2.getComponent("LbMonneyChange").setMoney(parseInt(data));
            }
        }, this.ErrorCallBack);
        ApiController.RequestGetJackpotLobby( 3, Global.Enum.GAME_TYPE.NIGHT_CLUB, (data) => {
            if(data == "null" || data == ""){
            }else{
                this.jackpotRoom3.getComponent("LbMonneyChange").setMoney(parseInt(data));
            }
        }, this.ErrorCallBack);
    },
});
