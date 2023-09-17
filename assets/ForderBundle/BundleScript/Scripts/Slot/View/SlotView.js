cc.Class({
    extends: cc.Component,
    ctor() {
        this.netWork = null;
        this.soundControl = null;
        this.roomID = 1;
        this.slotType = 14;
        this.lineData = 20;
        this.isFree = false;
        this.isBonus = false;
        this.isAuto = false;
        this.isSpeed = false;
        this.isSpin = false;
        this.activeButton = true;
        this.historyView = null;
        this.topView = null;
        this.helpView = null;
        this.toDoList = null;
        this.stackSpin = [];
        this.countAuto = 0;
        this.tutorialManager = null;  
        this.timeInGame = 0;
        this.isShowCommand = false;
        this.totalBetValue = 0;
        this.configRoom = null;
        this.countMissSpecialTurn = 0;
    
    },

    properties: {
        itemManager : require("ItemManager"),
        spinManager : require("SpinManager"),
        menuView : require("SlotMenuView"),
        normalManager : require("SlotNormalGameManager"),
        freeManager : require("SlotFreeManager"),
        bonusManager : require("SlotBonusManager"),
        drawLineManager : require("DrawLineControl"),
        effectManager : require("SlotGameEffect"),
        netWork : require("SlotNetwork"),
        soundControl : require("SlotSoundControl"),  
      
        isBattle : {
            default: false,
        },
        isCreateListUser : {
            default: true,
        },
        contentUser : cc.Node,
        backgroundNormal : cc.Node,
        backgroundFreeSpin : cc.Node,
    },

    onLoad() {
       
      
        this.timeInGame = (new Date()).getTime();
        this.Init();
        this.toDoList = this.node.addComponent("ToDoList");
        require("WalletController").getIns().init(require("ScreenManager").getIns().moneyType == 0);
        require("WalletController").getIns().AddListener(this);
        this.itemManager.Init(this);
        this.spinManager.Init(this);
        this.menuView.Init(this);
        this.drawLineManager.Init(this);
        this.normalManager.Init(this);
        this.freeManager.Init(this);
        this.bonusManager.Init(this);
        this.effectManager.Init(this);
        this.netWork.Init(this);
       
        this.soundControl.Init();
        this.soundControl.PlayBackgroundMusic();
        this.netWork.RequestGetInfoRoom();
       
        this.CallRequestGetJackpotInfo();
        this.AddScheduleAnimWait();
       
      
        let msgRoomConfig = {};
        msgRoomConfig[40] = this.slotType
        require("SendRequest").getIns().MST_Client_Slot_Get_Room_Config(msgRoomConfig);
       
        
    },

    CallRequestGetJackpotInfo() {
        this.RequestGetJackpotInfo();
        this.schedule(() => {
            this.RequestGetJackpotInfo();
        }, 10);
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
            if(!this.isFree && !this.isBonus && !this.isAuto && !this.isSpin)
                this.PlayAnimWaitAfk();
        }
    },

    PlayAnimWaitAfk(){
        if(this.spinManager){
            this.spinManager.PlayAnimWaitAfk();
        }
    },

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.OLD_SCHOOL;
    },

    OnUpdateMoney(gold) {
        this.menuView.UpdateMoney(gold);
       
    },

    OnCheckLastTurnBonus(bonusCounter, isBonusTurn) {
        if(isBonusTurn) {
            this.isBonus = true;
            this.PlayBonusStart();
            this.bonusManager.ShowBonusGame(bonusCounter);
        } else {
            this.toDoList.DoWork();
        }
    },

    OnUpdateLastMatrix(lastMatrix) {
        if(lastMatrix != null && lastMatrix.length != 0) {
            let matrix = this.normalManager.ParseMatrix(lastMatrix);
            this.spinManager.UpdateMatrix(matrix, true);
        }
    },

    SetFreeSpin(numberFree, isNotify = false, winNormal = 0) {
            this.freeManager.ShowFree(numberFree, isNotify, winNormal);
    },

    CheckHideFreeUI() {
            this.freeManager.CheckHideFreeUI();
    },

    CheckJackpot(isJackpot, total) {
        if(isJackpot) {
            this.PlayJackpot();
            this.effectManager.ShowJackpot(total, ()=> this.ActionAutoSpin());
            this.UpdateWinValue(total);
        }
    },

    CheckBonus(bonusValue, total, accountBalance) {
        if(bonusValue > 0 && !this.isBonus) {
            this.isBonus = true;
            this.bonusManager.StartBonus(bonusValue, total, accountBalance);
        } else {
            this.toDoList.DoWork();
        }
          
    },

    ShowBonusGame(bonusValue) {
        this.bonusManager.ShowBonusGame(bonusValue, this.GetBetValue());
    },

    SetLineData(lineData) {
        this.lineData = lineData;
        this.menuView.SetLineData(lineData);
    },

    UpdateTotalBetValue(betValue) {
        cc.log("update total bet value:"+betValue);
        this.totalBetValue = betValue;
        this.menuView.UpdateTotalBetValue(betValue);
    },

    UpdateJackpotValue(jackpotValue) {
        if(jackpotValue > 0)
            this.menuView.UpdateJackpotValue(jackpotValue);
    },

    SetLastPrizeValue(lastPrizeValue) {
        this.menuView.SetLastPrizeValue(lastPrizeValue);
    },

    OnGetJackpotValue(listJackpot) {
        this.menuView.OnGetJackpotValue(listJackpot);
    },

    UpdateSessionID(sessionID) {
        this.StopSpin();
        this.menuView.UpdateSessionID(sessionID);
    },

    UpdateMatrix(matrix) {
        this.spinManager.UpdateMatrix(matrix);
    },

    UpdateLineWinData(lineWinData) {
        this.drawLineManager.ShowLineWin(lineWinData);     
    },

    OnSpinDone() {

    },

    ActionAutoSpin() {
        
        if(!this.isSpin && this.isAuto ) {
            this.effectManager.ClickCloseNotify(false);
            this.effectManager.ClickCloseFree();
            this.effectManager.ClickCloseBonus();
            this.bonusManager.isCheckAuto = false;
            let packet = this.GetStack();
            let isRequest = true;
            this.RequestSpin(isRequest);
            if(packet) {
                this.netWork.ProceduGetResult(packet);
            }
        }
       
    },

   
    AutoSpin(isAuto) {
        this.isAuto = isAuto;
        if(!this.isAuto)
            this.countAuto = 0;
        if(this.isAuto && this.activeButton) {
            this.ActionAutoSpin();
        }
    },

    SpeedSpin(isSpeed) {
        this.isSpeed = isSpeed;
    },

    DeActiveButtonMenu() {
        this.activeButton = false;
        this.menuView.ActiveButtonMenu(false);
    },

    ActiveButtonMenu() {
        this.activeButton = true;
        this.menuView.ActiveButtonMenu(true);
        this.isSpin = false;
       
    },

    CheckStateAuto() {
        if(this.isAuto) {
            this.ActionAutoSpin();
        }
    },

    UpdateMoneyNormalGame(winMoney, accountBalance) {
        let betValue = this.totalBetValue;
        if(this.isFree || this.isBonus)
            betValue = 0;
        
         require("WalletController").getIns().PushBalance(this.slotType, betValue, winMoney, accountBalance);
        
    },

    UpdateMoneyResult(winNormalValue, totalValue, isTakeJackpot, isWaitRunMoneyWin = false) {
        // if(!this.isBattle) {
        //     require("WalletController").getIns().TakeBalance(this.slotType)
        // }
        if(this.isFree) {
            this.freeManager.AddTotalWin(winNormalValue);
        }
        if(!isTakeJackpot) {
            let isBigWin = this.CheckBigWin(winNormalValue);
          
            if(winNormalValue > 0) {
                if(!isBigWin) {
                    if(!this.isBattle) {
                        require("WalletController").getIns().TakeBalance(this.slotType)
                    }
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
                    this.menuView.ResetValueCacheWin();
                    this.PlayBigWin();
                    this.effectManager.ShowBigWin(winNormalValue, this.toDoList, true, true, true);
                }
            } else {
                this.UpdateWinValue(winNormalValue);
                this.toDoList.DoWork();
            }
        }else{
            this.PlayJackpot();
            this.effectManager.ShowJackpot(totalValue, this.toDoList, true, true);
        }  
    },


    CheckBigWin(winMoney, mutil = 6) {
        let isBigWin = false;
        if(winMoney >= this.totalBetValue * mutil) 
            isBigWin = true;
        return isBigWin;
    },

    UpdateAccountBalance(accountBalance) {  
       require("WalletController").getIns().UpdateWallet(accountBalance)    
    },

    ShowNotify(winValue, act) {
        this.effectManager.ShowNotify(winValue, act);
    },

    HideNotify() {
        this.effectManager.ClickCloseNotify();
    },

    GetSpinResult() {
        this.spinManager.OnGetResult();
    },

    CheckTimeShowPrize(prizeValue) {
      
        this.normalManager.CheckTimeShowPrize(prizeValue);
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData) {
        this.lineData = lineData;
        this.menuView.UpdateBetValue(totalBetValue);
        require("WalletController").getIns().UpdateWallet(accountBalance);
        this.normalManager.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData);
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot);
    },

   
    OnUpdateTime() {
       
    },


    RequestGetAccountInfo() {
        this.netWork.RequestGetAccountInfo();
    },

    RequestSpin(isRequest = true) {
        if(Global.isChallenge==0 && Global.dataBattle == null)
            if(Global.MainPlayerInfo.ingameBalance < this.totalBetValue && !this.isFree && !this.isBonus) {
                    Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_ENOUGHT_MONEY_TO_PLAY"));
                if(this.isAuto) {
                    this.menuView.toggleAuto.isChecked = false;
                    this.isAuto = false;
                }
                return;
            }
        this.isSpin = true;
        this.PlaySpin();
        this.effectManager.HideWinMoney();
        this.drawLineManager.StopDraw();
        this.spinManager.PlayEffectSpin();
        
        if(!this.isFree && !this.isBonus)
            this.menuView.ResetValueCacheWin();

        if(isRequest) {
            this.netWork.RequestSpinNormal();    
        }
        this.menuView.ActiveButtonMenu(false);
    },

    RequestGetJackpotInfo() {
        this.netWork.RequestGetJackpotInfo(this.gameType);
    },
    

    RequestLeaveRoom() {
        this.netWork.RequestLeaveRoom();
    },

    GetBetValue() {
        if(this.menuView)
            return this.menuView.GetBetValue()/this.lineData;
        else return this.totalBetValue/this.lineData;
    },

    UpdateWinValue(winMoney) {
        this.menuView.UpdateWinValue(winMoney);
    },

    SetMoneyWin(bonusValue) {
        this.menuView.SetMoneyWin(bonusValue);
    },

    //sound
    ChangeStateMusic(state) {
        this.soundControl.ChangeStateMusic(state);
    },

    ChangeStateSound(state) {
        this.soundControl.ChangeStateSound(state);
    },

    PlayClick() {
        this.soundControl.PlayClick();
    },

    PlaySpin() {
        this.soundControl.PlaySpin();
    },

    StopSpin() {
        this.soundControl.StopSpin();
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

    PlayFreeSpin() {
        this.soundControl.PlayFreeSpin();
    },

    PlayJackpot() {
        this.soundControl.PlayJackpot();
    },

    PlayBonusStart() {
        this.soundControl.PlayBonusStart();
    },

    PlayBonusEnd() {
        this.soundControl.PlayBonusEnd();
    },

    //stack
    AddStack(data) {
        if(this.stackSpin[0] == null)
            this.stackSpin[0] = data;
        else if(this.stackSpin[1] == null)
        this.stackSpin[1] = data;
    },

    GetStack() {
        let pack = this.stackSpin[0];
        this.RemoveStack();
        return pack;
    },

    RemoveStack() {
        if(this.stackSpin[0] != null) {
            this.stackSpin[0] = null;
            if(this.stackSpin[1] != null) {
                this.stackSpin[0] = this.stackSpin[1];
                this.stackSpin[1] = null;
            }
        }
    },

    CountStack() {
        let count = 0;
        if(this.stackSpin[0])
            count++;
        if(this.stackSpin[1])
            count++;
        return count;
    },

    //prewin
    ShowEffectPreWin(index) {
        this.normalManager.ShowEffectPreWin(index);
    },

    HideEffectPreWin(index) {
        this.normalManager.HideEffectPreWin(index);
    },

    HideAllEffectPreWin() {
        this.normalManager.HideAllEffectPreWin();
    },

    EndAnimPreWin(freeTurn, bonusTurn) {
        if(!this.isFree && !this.isBonus) {
            if((freeTurn > 0 || bonusTurn > 0) && this.spinManager.CheckPreWin()) {
                if(freeTurn > 0)
                    this.spinManager.EndItemBonusPreWin();
                if(bonusTurn > 0)
                    this.spinManager.EndItemFreePreWin();
                this.scheduleOnce(()=>{
                    this.EndAllItemPreWin();
                } , 1.5);
            } else {
                this.EndAllItemPreWin();
            }
        } else {
            this.EndAllItemPreWin();
        }
    },

    EndAllItemPreWin() {
        this.spinManager.EndAllItemPreWin();
        this.toDoList.DoWork();
    },

    onDestroy() {
        require("WalletController").getIns().RemoveListener();
        require("SoundManager1").getIns().stopAll();
        Global.LevelManager = null;
        // require("SendRequest").getIns().MST_Client_Slot_Leave_Room();
    },


    ShowCommandUseItemBonusTurn(todolist = null){
        if(todolist != null)
                todolist.DoWork();
            return;
            
       
    },

    Handle_ChangeFreespinBackground()
    {
        cc.log("Handle_ChangeFreespinBackground");
        this.backgroundNormal.active = false;
        this.backgroundFreeSpin.active = true;
        
    },

    Handle_ChangeNormalBackground()
    {
        cc.log("Handle_ChangeNormalBackground");
        this.backgroundNormal.active = true;
        this.backgroundFreeSpin.active = false;
    },

  


});
