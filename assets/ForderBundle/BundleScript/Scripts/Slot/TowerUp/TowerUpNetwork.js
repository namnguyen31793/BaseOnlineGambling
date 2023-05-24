

cc.Class({
    extends: require("SlotNetwork"),

    ResponseServer(code, packet) {
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_GET_ACCOUNT_INFO:
                console.log(packet);
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_SPIN:
                console.log(packet);
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CLIMB_STAIRS_GAME_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
        }
    },

    GetAccountInfo(packet) {
        Global.UIManager.hideMiniLoading();
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
        let extandMatrix = packet[11];
        if(extandMatrix == "")
            extandMatrix = "1";
        //   freeSpin = 1;
        let toDoList = this.slotView.toDoList;
        toDoList.CreateList();
        toDoList.AddWork(()=>{
            this.slotView.DeActiveButtonMenu();  
        }, false);
        toDoList.AddWork(()=>{
            this.slotView.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
        }, true);
        toDoList.AddWork(()=>{
            this.slotView.OnUpdateLastMatrix(lastMatrix);
        }, false);
        toDoList.AddWork(()=>this.slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>this.slotView.CheckStateAuto(),false);
        toDoList.Play();
    },

    ProceduGetResult(packet) {
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let numberBonusSpin = packet[5];
        let winBonusValue = packet[6];
        let freeSpinLeft = packet[7];
        let valueFreeSpin = packet[8];
        let totalWin = packet[9];
        let accountBalance = packet[11];
        let currentJackpotValue = packet[12];
        let isTakeJackpot = packet[13];
        let extendMatrixDescription = packet[14];

           
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extendMatrixDescription);
    },

    GetJackpotInfo(packet) {
    },

    
});
