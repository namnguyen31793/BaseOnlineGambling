

cc.Class({
    extends: require("SlotNetwork"),

    ResponseServer(code, packet) {
        cc.log(JSON.stringify(packet));
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_INFO:
                cc.log("MSG_SERVER_NEW_MINISLOT_GET_ACCOUNT_INFO");
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_SPIN:
                cc.log(packet);
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_NEW_MINISLOT_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
        }
    },

    onLoad() {
        Global.MiniSlotNetWork = this;
    },

    onDestroy() {
        Global.MiniSlotNetWork = null;
    },

    GetAccountInfo(packet) {
        Global.UIManager.hideMiniLoading();
        cc.log(packet);
        let accountBalance = packet[1];
        let totalBetValue = packet[2];
        let jackpotValue = packet[3];
        let lineData = packet[4];
        let lastPrizeValue = packet[5];
        let freeSpin = packet[6];
        let isTakeFreeSpin = packet[7];
        let bonusCounter = packet[8];
        let isBonusTurn = packet[9];
        let lastMatrix = packet[10];

        //   freeSpin = 1;
        let toDoList = this.slotView.toDoList;
        toDoList.CreateList();
        toDoList.AddWork(()=>{
            cc.log("----get account info");
            this.slotView.DeActiveButtonMenu();  
        }, false);
        toDoList.AddWork(()=>{
            cc.log("ongetaccount info");
            this.slotView.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData);
        }, false);
        // toDoList.AddWork(()=>{
        //     cc.log("onupdatelastmatrix");
        //     this.slotView.OnUpdateLastMatrix(lastMatrix);
        // }, false);
        // toDoList.AddWork(()=>{
        //     cc.log("oncheck last turn");
        //     this.slotView.OnCheckLastTurnBonus(bonusCounter, isBonusTurn);
        // }, true);
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList),true);
        toDoList.AddWork(()=>this.slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>this.slotView.CheckStateAuto(),false);
        toDoList.Play();
    },

    ProceduGetResult(packet) {
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let winBonusValue = packet[5];
        let freeSpinLeft = packet[6];
        let totalWin = packet[9];
        let accountBalance = packet[11];
        let currentJackpotValue = packet[12];
        let isTakeJackpot = packet[13];
        
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

    // GetAccountInfo(packet) {
    //     this.RequestGetJackpotInfo();
    // },
    
});
