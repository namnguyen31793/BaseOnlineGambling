cc.Class({
    extends: cc.Component,
    ctor() {
        this.toDoList = null;
        this.roomID = 1;
        this.slotType = 27;
        this.lineData = 1;
        this.isAuto = false;
        this.isSpeed = false;
        this.isSpin = false;
        this.timeInGame = 0;
        this.IsWaitNextTurn = false;
        this.IsRunResult = false;
        this.IsWaitRunResult = true;
        this.packet = null;
        this.MaxHp = 0;
        this.isEnd = false;
        this.isStart = true;
        this.isPlaySpin = false;
    },

    properties: {
        itemManager : require("SlotRpg_ItemManager"),
        characterManager : require("SlotRpg_CharacterManager"),
        spinManager : require("SlotRpg_SpinManager"),
        menuView : require("SlotRpg_MenuView"),
        normalManager : require("SlotRpg_NormalGameManager"),
        drawLineManager : require("SlotRpg_DrawLine"),
        effectManager : require("SlotRpg_GameEffect"),
        netWork : require("SlotRpg_Network"),
        soundControl : require("SlotRpg_SoundControl"),
    },

    onLoad() {
        this.Init();
        this.toDoList = this.node.addComponent("ToDoList");
        this.timeInGame = (new Date()).getTime();

        this.itemManager.Init(this);
        this.characterManager.Init(this);
        this.spinManager.Init(this);
        this.menuView.Init(this);
        this.drawLineManager.Init(this);
        this.normalManager.Init(this);
        this.effectManager.Init(this);
        this.netWork.Init(this);
        
        this.soundControl.Init();
        this.soundControl.PlayBackgroundMusic();
        
        this.AddScheduleAnimWait();

        //setup info
        this.MaxHp = Global.RpgConfig[6];
        this.menuView.UpdateMoney(Global.RpgConfig[1]);
        this.menuView.ShowGameId(Global.RpgConfig[4]);
        this.InitInfoCharacter(JSON.parse(Global.RpgConfig[2]),JSON.parse(Global.RpgConfig[3]));
        //let timeCD = Global.RpgConfig[5];
        // Global.RpgConfig = null;
        this.DeActiveButtonMenu();
        require("SendRequest").getIns().MST_Client_Rpg_Battle_Start();
    },

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.RPG_FIRST_GAME;
    },

    AddScheduleAnimWait(){
        this.schedule(() => {
            this.CheckShowAnimItemAfk();
        }, 8);
    },

    CheckShowAnimItemAfk(){
        let timeNow = (new Date()).getTime();
        if(timeNow >= (this.timeInGame+10000)){    ///10s afk
            this.timeInGame = (new Date()).getTime();
            if(!this.isAuto && !this.isSpin)
                this.PlayAnimWaitAfk();
        }
    },

    PlayAnimWaitAfk(){
        if(this.spinManager){
            this.spinManager.PlayAnimWaitAfk();
        }
    },

    RequestSpin(isRequest = true) {
        this.unschedule(this.createSche);
        this.isSpin = true;
        this.PlaySpin();
        this.effectManager.HideWinMoney();
        this.drawLineManager.StopDraw();
        this.spinManager.PlayEffectSpin();

        if(isRequest) {
            if(Global.isChallenge==0 && Global.dataBattle == null) {
                this.netWork.RequestSpinNormal();
            } else {
                if(Global.isChallenge == 1){
                    this.netWork.RequestSpinChallenge();
                } else if(Global.dataBattle != null) {
                    this.netWork.RequestPlayerSpinBattle();
                }
            }
        }
        this.menuView.ActiveButtonMenu(false);
    },

    CheckEndTurnResult(){
        this.IsRunResult = false;
        cc.log("check end turn result:"+this.IsWaitRunResult);
        if(!this.IsWaitRunResult){
            if(!this.IsWaitNextTurn) {
                this.ActiveButtonMenu();
            }
        }else{
            cc.log("bot spin");
            this.PlaySpin();
            this.spinManager.PlayEffectSpin();
            
            let botCharactorInfo = this.packet[1];
            let playerCharactorInfo = this.packet[2];
            let Matrix = this.packet[3];
            let LineWinString = this.packet[4];
            let ValueWinLine = this.packet[5];
            let NumberBonusSpin = this.packet[6];
            let ValueBonus = this.packet[7];
            let NumberFreeSpin = this.packet[8];
            let ValueFreeSpin = this.packet[9];
            let Total = this.packet[10]; 
            let ModelFreeString = this.packet[11]; 
            let IsTakeJackpot = this.packet[13]; 
            let ExtendMatrixDescription = this.packet[14]; 
            let CurrentTurnName = this.packet[15];

            this.GetSpinResult(botCharactorInfo, playerCharactorInfo, Matrix, LineWinString, ValueWinLine, NumberBonusSpin, ValueBonus
                , NumberFreeSpin, ValueFreeSpin, Total, ModelFreeString, IsTakeJackpot, ExtendMatrixDescription, CurrentTurnName);           
            this.IsWaitRunResult = false;
            this.packet = null;
        }
    },

    ActiveButtonMenu() {
        if(this.isEnd) {
            return;
        }
        this.characterManager.ShowEffectCurrentTurn(true);
        this.activeButton = true;
        this.menuView.ActiveButtonMenu(true);
        this.isSpin = false;
        // this.schedule(this.createSche = () => {
        //     this.menuView.ClickSpin();
        // }, 5);
    },

    GetSpinManagerResult() {
        this.spinManager.OnGetResult();
    },

    PlayAnimSpin(){
        this.PlaySpin();
        this.IsWaitNextTurn = false;
        this.spinManager.PlayEffectSpin();
    },

    StartPlayerWaitBot(){
        this.IsWaitNextTurn = true;
    },

    StartGame(nameStart) {
        //play effect user start
        this.scheduleOnce(()=>{
            if(nameStart != Global.MainPlayerInfo.nickName) {
                this.IsWaitRunResult = false;
                this.characterManager.ShowEffectCurrentTurn(false);
            } else {
                this.ActiveButtonMenu();
                this.characterManager.ShowEffectCurrentTurn(true);
            }
        }, 1);
        
    },

    GetSpinResult(botCharactorInfo, playerCharactorInfo, Matrix, LineWinString, ValueWinLine, NumberBonusSpin, ValueBonus, NumberFreeSpin, ValueFreeSpin, Total, ModelFreeString, IsTakeJackpot, ExtendMatrixDescription, CurrentTurnName){        
        cc.log("------GetSpinResult");
        this.IsRunResult = true;
        this.normalManager.OnGetSpinResult(0, Matrix, LineWinString, ValueWinLine, ValueBonus, NumberFreeSpin, Total, 0, 0, IsTakeJackpot, JSON.parse(playerCharactorInfo), JSON.parse(botCharactorInfo));        
    },

    GetSpinResultOther(packet){
        this.IsWaitNextTurn = false;
        cc.log("get spin result other:"+this.IsWaitRunResult);
        if(this.IsRunResult){
            this.IsWaitRunResult = true;
            //add result after
            this.packet = packet;
        }else{
            this.PlayAnimSpin();

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

            this.GetSpinResult(botCharactorInfo, playerCharactorInfo, Matrix, LineWinString, ValueWinLine, NumberBonusSpin, ValueBonus
                , NumberFreeSpin, ValueFreeSpin, Total, ModelFreeString, IsTakeJackpot, ExtendMatrixDescription, CurrentTurnName);           
            this.IsWaitRunResult = false;
        }
    },

    InitInfoCharacter(player, other){
        this.characterManager.SetupUI(player, other);
    },

    UpdateInfoCharacter(player, other){
        this.characterManager.UpdateInfo(player, other);
    },

    UpdateMatrix(matrix) {
        this.spinManager.UpdateMatrix(matrix);
    },

    CheckTimeShowPrize(prizeValue) {
        this.normalManager.CheckTimeShowPrize(prizeValue);
    },

    UpdateLineWinData(lineWinData) {
        this.drawLineManager.ShowLineWin(lineWinData);
    },

    UpdateMoneyResult(winNormalValue, isWaitRunMoneyWin = false) {

        // if(winNormalValue >0)
        //     isBigWin = true;
        if(winNormalValue > 0) {
            this.PlayWinMoney();
            this.effectManager.ShowWinMoney(winNormalValue);
            if(isWaitRunMoneyWin) {
                this.scheduleOnce(()=>{
                    this.UpdateWinValue(winNormalValue);
                    this.toDoList.DoWork();
                } , 1);  
            } else {
                this.UpdateWinValue(winNormalValue);
                this.toDoList.DoWork();
            }
        } else {
            this.UpdateWinValue(winNormalValue);
            this.toDoList.DoWork();
        }
    },

    CheckEndBattle() {
        Global.SlotNetWork.cacheEndRpg();
        Global.SlotNetWork.cacheEndRpg = null;
    },

    SetEndBattle() {
        this.isEnd = true;
        this.DeActiveButtonMenu();
    },

    DeActiveButtonMenu() {
        this.menuView.ActiveButtonMenu(false);
    },

    UpdateWinValue(winMoney) {
        this.menuView.UpdateWinValue(winMoney);
    },

    //audio
    PlaySpin() {
        this.characterManager.HideEffectCurrentTurn();
        this.isPlaySpin = true;
        this.soundControl.PlaySpin();
    },

    OnSpinDone() {
        cc.log("---------OnSpinDone");
        this.isPlaySpin = false;
    },

    UpdateSessionID(sessionID) {
        this.StopSpin();
        this.menuView.UpdateSessionID(sessionID);
    },

    HideAllEffectPreWin() {
        this.normalManager.HideAllEffectPreWin();
    },

    StopSpin() {
        this.soundControl.StopSpin();
    },

    PlayClick() {
        this.soundControl.PlayClick();
    },

    PlayWinMoney() {
        this.soundControl.PlayWinMoney();
    },

    PlayBigWin() {
        this.soundControl.PlayBigWin();
    },

    PlaySpinStart() {
        this.soundControl.PlaySpinStart();
    },

    PlaySpinStop() {
        this.soundControl.PlaySpinStop();
    },


});
