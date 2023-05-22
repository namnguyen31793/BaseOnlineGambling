

cc.Class({
    extends: require("SlotNetwork"),

    ResponseServer(code, packet) {
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_GET_ACCOUNT_INFO:
                cc.log(packet);
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_SPIN:
                cc.log(packet);
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_CHINA_FALL_GAME_GET_TOP_TAKE_JACKPOT_INFO:
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

        //   freeSpin = 1;
        let toDoList = this.slotView.toDoList;
        toDoList.CreateList();
        toDoList.AddWork(()=>{
            this.slotView.DeActiveButtonMenu();  
            cc.log("DeActiveButtonMenu");
        }, false);
        toDoList.AddWork(()=>{
            this.slotView.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
            cc.log("OnGetAccountInfo");
        }, true);
        toDoList.AddWork(()=>{
            this.slotView.OnUpdateLastMatrix(lastMatrix);
            cc.log("OnUpdateLastMatrix");
        }, false);
        // toDoList.AddWork(()=>{
        //     this.slotView.OnCheckLastTurnBonus(bonusCounter, isBonusTurn);
        //     cc.log("OnCheckLastTurnBonus");
        // }, true);
        toDoList.AddWork(()=>this.slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>this.slotView.CheckStateAuto(),false);
        toDoList.Play();
    },

    ProceduGetResult(packet) {

        // packet[2] = "12,7,10,11,6,13,13,9,1,7,10,6,7,12,11,11,13,13,9,1|2,12,5,11,6,12,4,10,1,7,10,7,9,12,11,11,6,7,9,1";
        // packet[3] =  "497,369|";
        // packet[4] = 100;
        // packet[5] = 0;
        // packet[6] = 0;
        // packet[7] = 0;
        // packet[9] = 100;


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
        let extandMatrix = packet[14];
        
        
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extandMatrix);
    },

    GetJackpotInfo(packet) {
        let listJackpot = [];
        listJackpot[0] = packet[1];
        listJackpot[1] = packet[2];
        listJackpot[2] = packet[3];
        listJackpot[3] = packet[4];
        listJackpot[4] = packet[5];
        listJackpot[5] = packet[6];
        listJackpot[6] = packet[7];
        this.slotView.OnGetJackpotValue(listJackpot);
    },

    Test(){
        this.slotView.RequestSpin(false);
        // let spinId = 5570;
        // let matrix = "9,5,10,9,11,4,13,4,11,12,12,12,10,7,10,4,7,4,9,5,12,11,12,13,10,11,4,11,12,4|13,12,12,9,11,4,4,12,11,12,9,5,10,7,10,4,13,4,9,5,12,12,10,13,10,12,7,12,12,4|12,10,12,9,11,12,12,12,9,12,13,4,12,11,10,4,5,10,7,5,9,13,4,9,10,4,7,10,13,4|9,13,7,9,11,7,9,8,9,12,9,10,10,11,10,12,5,12,7,5,13,13,10,9,10,9,7,10,13,4|6,9,10,1,11,9,13,8,9,12,9,9,10,9,10,12,10,12,11,5,13,5,10,9,10,9,13,10,13,4";
        // let listLineWinData = "7525,5077|7555,6259|7057,4465,1585,1549|2395|";
        // let winNormalValue = 38500;
        // let numberBonusSpin = 0;
        // let winBonusValue = 0;
        // let freeSpinLeft = 0;
        // let valueFreeSpin = 0;
        // let totalWin = 38500;
        // let accountBalance = 490100;
        // let currentJackpotValue = 100120;
        // let isTakeJackpot = false;
        // let extandMatrix = "1.33|2.32|3.180|4.140|/3|4|5|6|6";
        let spinId = 5570;
        let matrix = "4,13,7,7,11,11,10,5,7,9,5,5,9,12,7,10,7,7,12,11,7,12,5,13,11,12,4,7,5,10|12,7,12,7,11,4,13,13,7,9,11,10,7,12,7,5,5,5,12,11,10,12,9,13,11,12,4,5,5,10|10,4,11,11,11,12,7,9,7,9,4,13,12,7,7,11,10,13,12,11,10,12,7,12,11,12,4,9,13,10|13,12,7,8,11,9,4,11,12,9,10,7,9,11,7,4,13,13,7,11,11,10,7,7,11,10,4,9,13,10|12,13,6,6,11,9,12,7,8,9,10,4,11,12,7,4,7,9,11,11,11,10,7,7,11,10,4,9,7,10";
        let listLineWinData = "6013,5941|4747,4675|7441,7435,2257,2251|787|";
        let winNormalValue = 31800;
        let numberBonusSpin = 0;
        let winBonusValue = 0;
        let freeSpinLeft = 0;
        let valueFreeSpin = 0;
        let totalWin = 31800;
        let accountBalance = 490100;
        let currentJackpotValue = 100120;
        let isTakeJackpot = false;
        let extandMatrix = "1.30|2.160|3.96|4.32|/3|4|5|6|6";
        
        
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extandMatrix);
    },

    //battle
    BattlePlayerSpin(packet) {
        let playerInfo = JSON.parse(packet[1]);
        let rivalInfo = JSON.parse(packet[2]);
        let matrix = packet[3];
        let listLineWinData = packet[4];
        let winNormalValue = packet[5];
        let numberBonusSpin = packet[6];
        let winBonusValue = packet[7];
        let freeSpinLeft = packet[8];
        let valueFreeSpin = packet[9];
        let totalWin = packet[10];
        let isTakeJackpot = packet[13];
        let extendMatrixDescription = packet[14];
        let accountBalance = playerInfo.BattleScore;
        this.slotView.OnGetSpinResult(0, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, accountBalance, 
            0, isTakeJackpot, extendMatrixDescription);
        
        let userTurn = playerInfo.BattleNormalTurn;
        this.slotView.UpdateUserTurn(userTurn);

    },
    //end battle
});
