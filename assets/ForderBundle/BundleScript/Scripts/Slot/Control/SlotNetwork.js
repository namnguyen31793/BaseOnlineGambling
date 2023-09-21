cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
        this.isFake = true;
        this.countFree = 3;
        this.isSend = false;
        this.toDoListNetwork = null;
        this.cacheEndBattle = null;
    },

    Init(slotView) {
        this.slotView = slotView;
        this.toDoListNetwork = this.node.addComponent("ToDoList");
    },

    RequestGetInfoRoom() {
        Global.UIManager.showMiniLoading();
        let msg = {};
        msg[40] = this.slotView.slotType;

        let msg2 = {};
        msg2[1] = this.slotView.roomID;
        msg2[20] = this.slotView.slotType;
        msg2[40] = this.slotView.slotType;
        cc.log("RequestGetInfoRoom "+require("ScreenManager").getIns().moneyType);
        if(require("ScreenManager").getIns().moneyType == 0){
            require("SendRequest").getIns().MST_Client_Slot_Open_Game(msg);
            require("SendRequest").getIns().MST_Client_Slot_Get_Account_Info(msg2);
        }else{
            require("SendRequest").getIns().MST_Client_Real_Money_Slot_Open_Game(msg);
            require("SendRequest").getIns().MST_Client_Real_Money_Slot_Get_Account_Info(msg2);
        }
    },

    RequestJoinChallenge() {
        Global.UIManager.showMiniLoading();
        let msg = {};
        msg[40] = this.slotView.slotType;
        require("SendRequest").getIns().MST_Client_Slot_Open_Game(msg);
        let data = {};
		data[1] = Global.isChallenge;
		data[40] = this.slotView.slotType;
		require("SendRequest").getIns().MST_Client_Challenge_Start(data);
    },

    RequestGetJackpotInfo() {
        let msg = {};
        msg[1] = this.slotView.roomID;
        msg[20] = this.slotView.slotType;
        msg[40] = this.slotView.slotType;
        if(require("ScreenManager").getIns().moneyType == 0){
            require("SendRequest").getIns().MST_Client_Slot_Get_Jackpot_Info(msg);
        }else{
            require("SendRequest").getIns().MST_Client_Real_Money_Slot_Get_Jackpot_Info(msg);
        }
    },

    RequestGetAccountInfo() {
        let msg = {};
        msg[1] = this.slotView.roomID;
        msg[20] = this.slotView.slotType;
        msg[40] = this.slotView.slotType;
        
        if(require("ScreenManager").getIns().moneyType == 0){
            require("SendRequest").getIns().MST_Client_Slot_Get_Account_Info(msg);
        }else{
            require("SendRequest").getIns().MST_Client_Real_Money_Slot_Get_Account_Info(msg);
        }
    },

    RequestSpinNormal() {
        let msg = {};
        Global.Helper.LogAction("request spin:"+this.slotView.roomID+"-"+this.slotView.slotType);
        msg[1] = this.slotView.roomID;
        msg[2] = this.slotView.lineData.toString();
        msg[20] = this.slotView.slotType;
        msg[40] = this.slotView.slotType;
        cc.log("SendClickSpin== " + this.slotView.roomID);
        // if(this.slotView.isAuto && !this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Auto");
        // } else if(this.slotView.isAuto && this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Turbo");
        // } else if(!this.slotView.isAuto && this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Fast");
        // } else if(!this.slotView.isAuto && !this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Normal");
        // }
        if(require("ScreenManager").getIns().moneyType == 0){
            require("SendRequest").getIns().MST_Client_Slot_Spin(msg);
        }else{
            require("SendRequest").getIns().MST_Client_Real_Money_Slot_Spin(msg);
        }
    },

    RequestBuyFree() {
        let msg = {};
        Global.Helper.LogAction("request BuyFree:"+this.slotView.roomID+"-"+this.slotView.slotType);
        msg[1] = this.slotView.roomID;
        msg[2] = this.slotView.lineData.toString();
        msg[20] = this.slotView.slotType;
        msg[40] = this.slotView.slotType;
        cc.log("RequestBuyFree== " + this.slotView.roomID);
        // if(this.slotView.isAuto && !this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Auto");
        // } else if(this.slotView.isAuto && this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Turbo");
        // } else if(!this.slotView.isAuto && this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Fast");
        // } else if(!this.slotView.isAuto && !this.slotView.isSpeed) {
        //     Global.SendTrackerLogView("Play Normal");
        // }
        if(require("ScreenManager").getIns().moneyType == 0){
            require("SendRequest").getIns().MST_Client_Slot_Buy_Free(msg);
        }else{
            //require("SendRequest").getIns().MST_Client_Real_Money_Slot_Spin(msg);
        }
    },

    RequestLeaveRoom() {
        if(require("ScreenManager").getIns().moneyType == 0){
            require("SendRequest").getIns().MST_Client_Slot_Leave_Room();
        }else{
            require("SendRequest").getIns().MST_Client_Real_Money_Slot_Leave_Room();
        }
    },

    RequestSpinChallenge() {
         let msg = {};
         msg[40] = this.slotView.slotType;
        require("SendRequest").getIns().MST_Client_Challenge_Spin(msg);
    },

    RequestPlayerSpinBattle() {
        require("SendRequest").getIns().MST_Client_Battle_Field_Spin();
    },

    RequestRivalSpinBattle() {
        cc.log("rival request spin");
        require("SendRequest").getIns().MST_Client_Battle_Field_Adversary_Player_Spin();
    },

    RequestEndBattle() {
        require("SendRequest").getIns().MST_Client_Battle_Field_Confirm_Lose();
    },

    RequestEndTimeBattle() {
        require("SendRequest").getIns().MST_Client_Battle_Field_End_Time();
    },

    RequestRematch() {
        require("SendRequest").getIns().MST_Client_Battle_Field_ReMatch();
    },

    ////////////////////////////////////////////////////////////

    ResponseServer(code, packet) {
      
        switch (code) {
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_ACCOUNT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_ACCOUNT_INFO:
                this.GetAccountInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_JACKPOT_INFO:
                this.GetJackpotInfo(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_SPIN:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_SPIN:
                this.GetSpinResult(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_DETAIL_HISTORY:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_DETAIL_HISTORY:
                this.GetHistory(packet);
                break;
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_OLDSCHOOL_GET_TOP_TAKE_JACKPOT_INFO:
            case Global.Enum.RESPONSE_CODE.MSG_SERVER_REAL_MONEY_MAYA_GAME_GET_TOP_TAKE_JACKPOT_INFO:
                this.GetTop(packet);
                break;
        }
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
            this.slotView.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData);
        }, true);
        toDoList.AddWork(()=>{
            this.slotView.OnUpdateLastMatrix(lastMatrix);
        }, false);
        toDoList.AddWork(()=>{
            this.slotView.OnCheckLastTurnBonus(bonusCounter, isBonusTurn);
        }, true);
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList),true);
        toDoList.AddWork(()=>this.slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>this.slotView.CheckStateAuto(),false);
        toDoList.Play();
    },

    GetJackpotInfo(packet) {
        let listJackpot = [];
        listJackpot[0] = packet[1];
        listJackpot[1] = packet[2];
        listJackpot[2] = packet[3];
        this.slotView.OnGetJackpotValue(listJackpot);
    },

    GetSpinResult(packet) {
        if(this.slotView.spinManager.isgetResult) {
            this.slotView.AddStack(packet);
            return;
        }
        this.ProceduGetResult(packet);
        
    },

    ProceduGetResult(packet) {
        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let winBonusValue = packet[5];
        let freeSpinLeft = packet[6];
        let totalWin = packet[8];
        let accountBalance = packet[10];
        let currentJackpotValue = packet[11];
        let isTakeJackpot = packet[12];
        
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

    GetHistory(packet) {
        this.slotView.historyView.responseServer(packet);
    },

    GetTop(packet) {
        this.slotView.topView.responseServer(packet);
    },

    //tournament 
    TournamentGetTopPlayer(packet) {
        let listDataString = packet[1];
        let listUser = [];
        for (let i = 0; i < listDataString.length; i++) {
            listUser[i] =  JSON.parse(listDataString[i]);
        }
        let currentFund = packet[2];
        let startTime = new Date(packet[3]);
        let endTime = new Date(packet[4]);
        this.slotView.OnGetTopPlayerTournament(listUser, currentFund, startTime, endTime);
    },

    TournamentGetTopWinner(packet) {
        let listDataString = packet[1];
        let listData = [];
        for (let i = 0; i < listDataString.length; i++) {
            listData[i] =  JSON.parse(listDataString[i]);
        }
        this.slotView.OnGetTopWinTournament(listData);
    },

    //end tournament

    //challenge
    ChallengeGameStart(packet){
        cc.log(packet);
        Global.UIManager.hideMiniLoading();
        let accountBalance = packet[1];
        let targetMoney = packet[2];
        let targetTurn = packet[3];
        let currentTargetMoney = packet[5];
        let currentTargetTurn = packet[6];
        let lastMatrix = packet[7];
        
        let bonusCounter = packet[10];
        let valueBonus = packet[11];
        let freeSpin = packet[12];
        let valueFree = packet[13];
        let lastPrizeValue = packet[16];
        if(lastPrizeValue < 0)
            lastPrizeValue = 0;
        let toDoList = this.slotView.toDoList;
        toDoList.CreateList();
        toDoList.AddWork(()=>{
            cc.log("----challenge start");
            this.slotView.DeActiveButtonMenu();
            this.slotView.OnGetAccountInfo(currentTargetMoney, freeSpin, 2000, 0, lastPrizeValue, 20);
        }, true);
        toDoList.AddWork(()=>{
            this.slotView.OnUpdateLastMatrix(lastMatrix);
        }, false);
        toDoList.AddWork(()=>{
            this.slotView.OnCheckLastTurnBonus(bonusCounter, bonusCounter > 0);
        }, true);
        toDoList.AddWork(()=>this.slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>{
            this.slotView.CheckStateAuto();
        },false);
        toDoList.Play();
        this.slotView.UpdateInfoChallenge(currentTargetTurn,currentTargetMoney);
        this.slotView.SetupTargetChallenge(targetTurn, targetMoney);
    },

    ChallengeGameSpin(packet){
        cc.log(packet);

        let spinId = packet[1];
        let matrix = packet[2];
        let listLineWinData = packet[3];
        let winNormalValue = packet[4];
        let numberBonusSpin = packet[5];
        let winBonusValue = packet[6];
        let freeSpinLeft = packet[7];
        let valueFreeSpin = packet[8];
        let totalWin = packet[9];
        let currentJackpotValue = 0;
        let currentTargetTurn = packet[11];
        let currentTargetMoney = packet[12];
        let isTakeJackpot = packet[13];
              
        this.slotView.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, numberBonusSpin,freeSpinLeft, totalWin, currentTargetMoney, 
            currentJackpotValue, isTakeJackpot);
        this.slotView.UpdateInfoChallenge(currentTargetTurn,currentTargetMoney);
    },

    ChallengeGameEnd(packet){
        cc.log(packet);
        if(this.slotView.isAuto) {
            this.slotView.menuView.toggleAuto.isChecked = false;
            this.slotView.isAuto = false;
        }
        let resultStatus = packet[1];//1-win; 2-lose 
        let challengeReward = packet[2];
        let ingameBalance = packet[3];
        if(this.slotView.isSpin)
            this.slotView.SetEndChallenge(resultStatus, challengeReward, ingameBalance);
        else Global.UIManager.showEndChallengePopup(resultStatus, challengeReward, ingameBalance);
    },

    //mission
    GetMissionInfo(packet) {
        
        cc.log(packet);
        let currentMissionInfo = JSON.parse(packet[1]);
        let currentTargetMission = JSON.parse(packet[2]);
        cc.log("get mission info:"+currentTargetMission.MissionType);
        let network = this;
        if(this.slotView.tutorialManager == null) {
            if(currentTargetMission.MissionType == Global.Enum.MISSION_TYPE.NEW_USER) {
                Global.DownloadManager.LoadPrefab("TutorialPopup","MissionTutorial", (prefab)=>{
                    let node = cc.instantiate(prefab);
                    network.slotView.tutorialManager = node.getComponent("SlotTutorialView");
                    network.slotView.tutorialManager.Init(network.slotView);
                    network.slotView.tutorialManager.SetInfo(currentMissionInfo, currentTargetMission);
                });
            } else if(currentTargetMission.MissionType == Global.Enum.MISSION_TYPE.DAILY) {
                if(Global.MissionDaily != null && Global.MissionDaily.node != null) {
                    Global.MissionDaily.SetInfo(currentMissionInfo, currentTargetMission);
                } else {
                    if(Global.MissionContent == null) {
                        Global.cacheDaily = {
                            current : currentMissionInfo,
                            target : currentTargetMission
                        };
                    } else {
                        Global.MissionContent.InitDailyMission(currentMissionInfo, currentTargetMission);
                    }
                } 
            }
        } else {
            if(currentTargetMission.MissionType == Global.Enum.MISSION_TYPE.NEW_USER) {
                this.slotView.tutorialManager.SetInfo(currentMissionInfo, currentTargetMission);
            } else if(currentTargetMission.MissionType == Global.Enum.MISSION_TYPE.DAILY) {
                Global.MissionDaily.SetInfo(currentMissionInfo, currentTargetMission);
            }
        }
    },

    //bean
    GetMissionBeanInfo(packet) {
        let currentMissionInfo = JSON.parse(packet[1]);
        let currentTargetMission = JSON.parse(packet[2]);
        if(Global.MissionBean != null) {
            Global.MissionBean.SetInfo(currentMissionInfo, currentTargetMission);
        } else {
            if(Global.MissionContent == null) {
                Global.cacheBean = {
                    current : currentMissionInfo,
                    target : currentTargetMission
                };
            } else {
                Global.MissionContent.InitBeanMission(currentMissionInfo, currentTargetMission);
            }
            
        }
    },

    //random mission
    GetMissionRandomInfo(packet) {
        let currentMissionInfo = JSON.parse(packet[1]);
        let currentTargetMission = JSON.parse(packet[2]);
        if(Global.MissionRandom != null) {
            Global.MissionRandom.SetInfo(currentMissionInfo, currentTargetMission);
        } else {
            let network = this;
            if(Global.MissionContent == null) {
                Global.cacheRandom = {
                    current : currentMissionInfo,
                    target : currentTargetMission
                };
            } else {
                Global.MissionContent.InitRandomMission(currentMissionInfo, currentTargetMission);
            }
        }
    },

    //battle
   
    //config
    GetRoomConfig(packet) {
        let config = [];
        for(let i = 0; i < packet[1].length; i++) {
            config[i] = JSON.parse(packet[1][i]);
        }
        cc.log(config);
        this.slotView.configRoom = config;
    },
    //x2
    ViewX2Complete(packet) {
        cc.log(packet);
        let totalReward = packet[1];
        let accountBalance = packet[2];
    },

    onLoad() {
        Global.SlotNetWork = this;
    },

    onDestroy() {
        Global.SlotNetWork = null;
    },

    ActionCallGetTurnBonus(){
        this.toDoListNetwork.CreateList();
        this.toDoListNetwork.AddWork(()=>{
            this.slotView.normalManager.EndBonus();         
        },false);
        this.toDoListNetwork.Wait(0.5);
        this.toDoListNetwork.AddWork(()=>{
            this.RequestGetAccountInfo();
        },false);
        
        this.toDoListNetwork.Play();
    },
});
  