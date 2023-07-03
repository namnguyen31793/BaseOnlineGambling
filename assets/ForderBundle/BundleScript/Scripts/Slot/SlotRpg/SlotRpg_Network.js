cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
        this.isFake = true;
        this.countFree = 3;
        this.isSend = false;
        this.toDoListNetwork = null;
        this.cacheEndRpg = null;
    },

    Init(slotView) {
        this.slotView = slotView;
        this.toDoListNetwork = this.node.addComponent("ToDoList");
    },

    RequestSpinNormal() {
        require("SendRequest").getIns().MST_Client_Rpg_Battle_Spin();
    },

   
    ////////////////////////////////////////////////////////////

    ResponseServer(code, packet) {
      
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_RPG_BATTLE_GAME_SPIN:
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_RPG_BATTLE_FIELD_GAME_END:
                this.GetResultEnd(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_RPG_BATTLE_FIELD_START_GAME:
                this.StartGame(packet);
                break;
        }
    },

    GetRegisRpgBattle(packet) { 
        let accountBalance = packet[1];
        let player = packet[2];
        let bot = packet[3];
        let gameId = packet[4];
        let endLiveTimeSeconds = packet[5];
        let battleFieldConfig= packet[6];
        this.slotView.RegisBattleRpg(accountBalance, player, bot, gameId, endLiveTimeSeconds, battleFieldConfig);
    },

    SetConfigRpg(packet) {
        let rpgBattleListConfig_ToString = packet[1];
        this.slotView.SetConfigRpg(rpgBattleListConfig_ToString);
    },

    StartGame(packet) {
        cc.log(packet);
        Global.RpgConfig[8] = packet[1];
        this.slotView.StartGame(packet[1]);
    },

    GetSpinResult(packet) {
        cc.log(packet);
        let botCharactorInfo = packet[1];
        let playerCharactorInfo = packet[2];
        let Matrix = packet[3];
        let LineWinString = packet[4];
        let ValueWinLine = packet[5];
        let NumberBonusSpin = packet[6];
        let ValueBonus = packet[7];
        let NumberFreeSpin = packet[8];
        let ValueFreeSpin = packet[9];
        let Total = packet[10]; 
        let ModelFreeString = packet[11]; 
        let IsTakeJackpot = packet[13]; 
        let ExtendMatrixDescription = packet[14]; 
        let CurrentTurnName = packet[15]; 

        if(this.slotView.isStart && CurrentTurnName != Global.MainPlayerInfo.nickName){
            this.slotView.PlayAnimSpin();
            this.slotView.GetSpinResult(botCharactorInfo, playerCharactorInfo, Matrix, LineWinString, ValueWinLine, NumberBonusSpin, ValueBonus
                , NumberFreeSpin, ValueFreeSpin, Total, ModelFreeString, IsTakeJackpot, ExtendMatrixDescription, CurrentTurnName);
            return;
        }
        cc.log("get spin result:"+(CurrentTurnName == Global.RpgConfig[8]));
        if(CurrentTurnName == Global.MainPlayerInfo.nickName) {
            this.slotView.StartPlayerWaitBot();
            this.slotView.GetSpinResult(botCharactorInfo, playerCharactorInfo, Matrix, LineWinString, ValueWinLine, NumberBonusSpin, ValueBonus
                , NumberFreeSpin, ValueFreeSpin, Total, ModelFreeString, IsTakeJackpot, ExtendMatrixDescription, CurrentTurnName);
        }else{
            this.slotView.GetSpinResultOther(packet);
        }
    },

    GetResultEnd(packet) {
        let status = packet[1];
        let reward = packet[2];
        let accountBalance = packet[3];
        this.slotView.SetEndBattle();
        this.cacheEndRpg = ()=>{
            Global.UIManager.showEndRpgPopup(this.slotView.characterManager, status, reward, accountBalance);
        };
    },

    RequestLeaveRoom() {
        if(require("ScreenManager").getIns().moneyType == 0){
            require("SendRequest").getIns().MST_Client_Slot_Leave_Room();
        }else{
            require("SendRequest").getIns().MST_Client_Real_Money_Slot_Leave_Room();
        }
    },

    onLoad() {
        Global.SlotNetWork = this;
    },

    onDestroy() {
        Global.SlotNetWork = null;
    },
});
