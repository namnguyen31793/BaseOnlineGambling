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
        this.battleManager = null;
        this.timeInGame = 0;
        this.isShowCommand = false;
        this.totalBetValue = 0;
        this.configRoom = null;
        this.isEndBattle = false;
        this.countMissSpecialTurn = 0;
        this.TURN_SHOW_ADS_FREE_SPIN = 40;
        this.DISTANCE_SHOW_ADS = 20;
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
        tournamentView : require("SlotTournamentView"),
        challengeView : require("SlotChallengeView"),
        isBattle : {
            default: false,
        },
        isCreateListUser : {
            default: true,
        },
        contentUser : cc.Node,
    },

    onLoad() {
        // this.contentUser.setPosition(cc.v2(0,0));
        // this.contentUser.width = cc.winSize.width;
        // this.contentUser.height = cc.winSize.height;
        // let layout = this.contentUser.getComponent(cc.Layout);
        // if(layout != null) {
        //     layout.enabled = false;
        // }
        // Global.Bundle.load("GamePrefabs/Notify", cc.Prefab, (err, prefab) => {
        //     let node = cc.instantiate(prefab);
        //     this.contentUser.addChild(node);
        //     node.setPosition(cc.v2(0,280));
        //     let notifyLobby = node.getComponent(require("NotifyLobbyView"));
        //     notifyLobby.Init();
        //     notifyLobby.mask.opacity = 150;
        // })
        if(Global.isViewAdsFree == true) {
            this.TURN_SHOW_ADS_FREE_SPIN = 100;
            this.DISTANCE_SHOW_ADS = 100;
        }
        this.timeInGame = (new Date()).getTime();
        this.Init();
        this.toDoList = this.node.addComponent("ToDoList");
        if(!this.isBattle) {
            require("WalletController").getIns().init(Global.isChallenge == 0 & Global.dataBattle == null && require("ScreenManager").getIns().moneyType == 0);
            require("WalletController").getIns().AddListener(this);
        }
        this.itemManager.Init(this);
        this.spinManager.Init(this);
        this.menuView.Init(this);
        this.drawLineManager.Init(this);
        this.normalManager.Init(this);
        this.freeManager.Init(this);
        this.bonusManager.Init(this);
        this.effectManager.Init(this);
        this.netWork.Init(this);
        this.InitBattleManager();
        if(this.tournamentView)
            this.tournamentView.Init(this);
        if(this.challengeView)
            this.challengeView.Init(this);
        this.soundControl.Init();
        this.soundControl.PlayBackgroundMusic();
        if(Global.isChallenge==0 && Global.dataBattle == null)
            this.netWork.RequestGetInfoRoom();
        else if(Global.isChallenge == 1)
            this.SetupChallenge();
        else if(Global.dataBattle != null)
            this.SetupBattle();
        this.CallRequestGetJackpotInfo();
        this.AddScheduleAnimWait();
        require("SendRequest").getIns().MST_Client_Event_Tournament_Get_Account_Reward();

      
        let msgRoomConfig = {};
        msgRoomConfig[40] = this.slotType
        require("SendRequest").getIns().MST_Client_Slot_Get_Room_Config(msgRoomConfig);
        if(Global.dataBattle == null) {
            this.ShowNotifyBigWin();
            this.CreateListUser();
        }
        
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
        if(Global.isChallenge != 0) {
            this.challengeView.UpdateProgress();
        }
        if(Global.dataBattle != null) {
            this.battleManager.UpdateUserMoney(gold);
        }
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
        this.OnPlayInfoTournament();
    },

    OnSpinDone() {

    },

    ActionAutoSpin() {
        
        if(!this.isSpin && this.isAuto && !this.isEndBattle) {
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
        if(this.isEndBattle)
            this.DeActiveButtonMenu();
    },

    UpdateProgressMission() {
        if(Global.MissionDaily != null && Global.MissionDaily.node.activeInHierarchy) {
            Global.MissionDaily.ProcessInfo();
        }
        if(Global.SlotTutorialView != null && Global.SlotTutorialView.node.activeInHierarchy) {
            Global.SlotTutorialView.ProcessInfo();
        }
        if(Global.MissionBean != null && Global.MissionBean.node.activeInHierarchy) {
            Global.MissionBean.ProcessInfo();
        }
        if(Global.MissionRandom != null && Global.MissionRandom.node.activeInHierarchy) {
            Global.MissionRandom.ProcessInfo();
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
        this.CheckEndChallenge();
        this.CheckEndBattle();
        this.UpdateCurrentQuest();
    },

    CheckStateAuto() {
        if(this.isAuto) {
            this.ActionAutoSpin();
        }
    },

    UpdateMoneyNormalGame(winMoney, accountBalance) {
        let betValue = this.totalBetValue;
        if(this.isFree || this.isBonus || Global.isChallenge != 0 || Global.dataBattle != null)
            betValue = 0;
        if(!this.isBattle) {
            require("WalletController").getIns().PushBalance(this.slotType, betValue, winMoney, accountBalance);
        } else {

        }
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
            // if(winNormalValue >0)
            //     isBigWin = true;
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
        if(!this.isBattle) {
            require("WalletController").getIns().UpdateWallet(accountBalance)
        } else {
            this.battleManager.UpdateRivalMoney(accountBalance);
        }
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
        this.toDoList.AddWork(()=>this.UpdateProgressMission(),false);
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

    OnGetTopPlayerTournament(listUser, currentFund, startTime, endTime) {
        if(this.tournamentView != null)
            this.tournamentView.SetInfo(listUser, currentFund, startTime, endTime);
    },

    OnPlayInfoTournament() {
        if(this.tournamentView != null)
            this.tournamentView.PlayInfo();
    },

    OnGetTopWinTournament(data) {
        if(this.tournamentView != null)
            this.tournamentView.ShowTopWin(data);
    },

    OnUpdateTime() {
        if(this.tournamentView != null)
            this.tournamentView.UpdateTime();
    },

    //challenge
    SetupChallenge() {
        this.netWork.RequestJoinChallenge();
        this.SetLineData(50);
        this.roomID = 1;
        this.totalBetValue = Global.dataBattle.betValue;
        this.menuView.UpdateTotalBetValue(Global.dataBattle.betValue);
        this.DeActiveButtonMenu();
    },

    SetupTargetChallenge(totalTurn, totalMoney) {
        this.challengeView.SetupTarget(totalTurn, totalMoney);
    },

    UpdateInfoChallenge(currentTurn, currentMoney) {
        this.challengeView.UpdateInfo(currentTurn, currentMoney);
    },

    SetEndChallenge(resultStatus, challengeReward, ingameBalance) {
        this.challengeView.SetEndChallenge(resultStatus, challengeReward, ingameBalance);
    },

    CheckEndChallenge() {
        if(Global.isChallenge != 0) {
            this.challengeView.CheckEndChallenge();
        }
    },

    //request

    RequestGetAccountInfo() {
        this.netWork.RequestGetAccountInfo();
    },

    RequestSpin(isRequest = true) {
        if(Global.isChallenge==0 && Global.dataBattle == null)
            if(Global.MainPlayerInfo.ingameBalance < this.totalBetValue && !this.isFree && !this.isBonus) {
                if(CONFIG.ACTIVE_ADS) {
                    Global.UIManager.ShowGetMoneyPopup();
                } else {
                    Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_ENOUGHT_MONEY_TO_PLAY"));
                }
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

    

    //tutorial
    UpdateCurrentQuest() {
        if(this.tutorialManager != null) {
            this.tutorialManager.UpdateCurrentQuest();
        }
    },

    //share money
    ShowShareMoney() {
        Global.UIManager.ShowShareMoney();
    },

    //battle
    InitBattleManager() {
        let slotView = this;
        Global.DownloadManager.LoadPrefab("Mission","MissionContent", (prefab)=>{
            let node = cc.instantiate(prefab);
            node.getComponent("MissionContentView").Init(slotView);
        });

        if(Global.dataBattle != null) {
            let slotName = "";
            let bName = "";
            if(this.slotType == Global.Enum.GAME_TYPE.CHINA_QUEEN) {
                bName = "21";
                slotName = "ChinaBattle";
            } else if(this.slotType == Global.Enum.GAME_TYPE.MAYA_GAME) {
                bName = "20";
                slotName = "MayaBattle";
            } else if(this.slotType == Global.Enum.GAME_TYPE.DRAGON_PHOENIX) {
                bName = "19";
                slotName = "CaChepBattle";
            } else if(this.slotType == Global.Enum.GAME_TYPE.EXTEND_COLUMNS) {
                bName = "25";
                slotName = "DragonFireBattle";
            }
            let slView = this;
            Global.DownloadManager.LoadPrefab(bName,slotName, (prefab)=>{
                let node = cc.instantiate(prefab);
                node.parent = slView.node.parent;
                node.scale = 0.3;
                node.setPosition(cc.v2(480,150));
            });
            Global.DownloadManager.LoadPrefab("Battle","BattleContainer", (prefab)=>{
                let node = cc.instantiate(prefab);
                slView.battleManager = node.getComponent("SlotBattleView");
                slView.battleManager.Init(slView);

                for(let i = 0; i < Global.dataBattle.turnModel.length; i++) {
                    if(Global.dataBattle.turnModel[i].Nickname == Global.MainPlayerInfo.nickName) {
                        let toDoList = slView.toDoList;
                        toDoList.CreateList();
                        toDoList.AddWork(()=>{
                            slView.DeActiveButtonMenu();
                        }, false);
                        toDoList.AddWork(()=>{
                            slView.OnUpdateLastMatrix(Global.dataBattle.turnModel[i].Matrix);
                        }, false);
                        toDoList.AddWork(()=>{
                            slView.OnCheckLastTurnBonus(Global.dataBattle.turnModel[i].NumberBonusSpin, Global.dataBattle.turnModel[i].NumberBonusSpin > 0);
                        }, true);
                        toDoList.AddWork(()=>slView.ActiveButtonMenu(),false);
                        toDoList.AddWork(()=>{
                            slView.CheckStateAuto();
                        },false);
                        toDoList.Play();
                    }
                }
            });
        } else {
            if(Global.isTutorial == 0) {
                cc.log("---show share money");
                this.scheduleOnce(()=>{
                    this.ShowShareMoney();
                } , Global.RandomNumber(30,60));
            }
           
        }
    },

    SetupBattle() {
        Global.UIManager.hideMiniLoading();
        Global.BtnOnline.node.active = false;
        this.SetLineData(50);
        this.roomID = 1;
        this.totalBetValue = Global.dataBattle.betValue;
        this.menuView.UpdateTotalBetValue(Global.dataBattle.betValue);
        this.ActiveButtonMenu();
        // this.schedule(() => {
        //     this.menuView.toggleAuto.isChecked = true;
        //     this.isAuto = true;
        // }, 1);
    },

    UpdateUserTurn(userTurn) {
        this.battleManager.UpdateUserTurn(userTurn);
    },

    UpdateRivalTurn(rivalTurn) {
        this.battleManager.UpdateRivalTurn(rivalTurn);
    },

    UpdateRivalSpinBattle(winNormalValue, winBonusValue, numberBonusSpin, freeSpinLeft, totalWin, accountBalance, isTakeJackpot, rivalTurn) {
        this.battleManager.UpdateRivalSpinBattle(winNormalValue, winBonusValue, numberBonusSpin, freeSpinLeft, totalWin, accountBalance, isTakeJackpot, rivalTurn);
    },

    CheckEndBattle() {
        if(Global.SlotNetWork && Global.SlotNetWork.slotView && Global.OtherBattle && Global.OtherBattle.slotView && 
            !Global.SlotNetWork.slotView.isSpin && !Global.OtherBattle.slotView.isSpin && Global.SlotNetWork.cacheEndBattle != null) {
            Global.SlotNetWork.cacheEndBattle();
            Global.SlotNetWork.cacheEndBattle = null;
        }
        if(Global.dataBattle != null && this.battleManager != null) {
            if(this.battleManager.userSpin <= 0) {
                this.SetEndBattle();
                this.battleManager.OnEnd();
                cc.log("check end battle:"+this.isAuto);
            }
            
        }
    },

    SetEndBattle() {
        this.DeActiveButtonMenu();
        this.menuView.toggleAuto.isChecked = false;
        this.isAuto = false;
        this.battleManager.endUser = true;
    },

    ShowCommandUseItemBonusTurn(todolist = null){
        if(todolist != null)
                todolist.DoWork();
            return;
            
        if(Global.dataBattle != null) {
            if(todolist != null)
                todolist.DoWork();
            return;
        }
        if(this.isShowCommand){
            if(todolist != null)
                todolist.DoWork();
            return;
        }
        let ishaveItem = false;
        let data = Global.RewardSpin_Model;//DailyGameManager.getIns().configFree;
        for(let i = 0; i < data.length; i++){
            if(data[i].GameID == this.slotType && data[i].RoomId == this.roomID){
                ishaveItem = true;
            }
        }
        if(!ishaveItem){
            if(todolist != null)
                todolist.DoWork();
            return;
        }
        if(this.isBonus || this.isFree){
            if(todolist != null)
                todolist.DoWork();
            return;
        }
        this.isShowCommand = true;
        Global.UIManager.showConfirmPopup("Bạn có item đặc biệt, có muốn sử dụng ngay không?",
            ()=>{   
                this.netWork.ActionCallGetTurnBonus();
            },
            ()=>{   if(todolist != null)
                        todolist.DoWork();}
        );
    },

    EndBattle() {
        this.DeActiveButtonMenu();
        this.isEndBattle = true;
    },

    CheckShowFreeAds() {
        return false;
    },

    ShowNotifyBigWin() {
        if(this.notifyBigWin == null) {
            let current = this;
            Global.Bundle.load("GamePrefabs/NotifyBigWinSlot", cc.Prefab, (err, prefab) => {
				current.notifyBigWin = cc.instantiate(prefab).getComponent("NotifyBigWinSlot");
				current.effectManager.node.addChild(current.notifyBigWin.node);
                current.notifyBigWin.node.setSiblingIndex(0);
				current.notifyBigWin.Show(-262,9);
			})
        } else {
            this.notifyBigWin.Show();
        }
        let timeWait = Global.RandomNumber(10,31)/10;
        this.scheduleOnce(()=>{
            if(this.notifyBigWin2 == null) {
                let current = this;
                Global.Bundle.load("GamePrefabs/NotifyBigWinSlot", cc.Prefab, (err, prefab) => {
                    current.notifyBigWin2 = cc.instantiate(prefab).getComponent("NotifyBigWinSlot");
                    current.effectManager.node.addChild(current.notifyBigWin2.node);
                    current.notifyBigWin2.node.setSiblingIndex(0);
                    current.notifyBigWin2.Show(-231,6);
                })
            } else {
                this.notifyBigWin2.Show();
            }
        } , timeWait);
        
    },

    CreateListUser() {
        return;
        if(!this.isCreateListUser) {
            if(cc.winSize.width > 1350) {
                if(cc.winSize.width > 1500) {
                    this.contentUser.x = -(cc.winSize.width/2 - 80);
                } else {
                    this.contentUser.x = -(cc.winSize.width/2 - 50);
                }
            } else 
                return;
        }
        this.contentUser.setSiblingIndex(this.freeManager.node.getSiblingIndex()-1);
        let current = this;
        Global.DownloadManager.LoadPrefab("Invite","ListUser", (prefab)=>{
            let listUser = cc.instantiate(prefab);
            listUser.setPosition(cc.v2(0,0));
            current.contentUser.addChild(listUser);
        })
    },
});
