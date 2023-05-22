var ScreenManager = require("ScreenManager");
cc.Class({
    extends: require("SlotView"),
    ctor() {
        this.multi = 1;
        this.prize = 0;
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
        this.Init();
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
        this.prize = 0;
    },

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.NEW_MINISLOT;
    },

    
    UpdateMulti(multi) {
        this.spinManager.UpdateMulti(multi);
    },

    ShowEffectMulti(){
        this.spinManager.ShowEffectMulti();
    },

    UpdateMoneyNormalGame(winMoney, accountBalance) {
        this.prize = 0;
        let betValue = this.totalBetValue;
        if(this.isFree || this.isBonus || Global.isChallenge != 0 || Global.dataBattle != null)
            betValue = 0;
        if(!this.isBattle) {
            this.prize = winMoney;
            if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                require("WalletController").getIns().UpdateBalance(-betValue);
            }else{
                require("WalletController").getIns().PushBalance(this.slotType, betValue, winMoney, accountBalance);
            }
            if(Global.InGameView != null) {
                Global.GameLogic.mainActor.maxBalance = accountBalance;
            }
        } else {

        }
    },

    
    CloseGame () {
        this.prize = 0;
        this.node.active = false;
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData) {
        this.lineData = lineData;
        this.menuView.UpdateBetValue(totalBetValue);
    },

    UpdateMoneyResult(winNormalValue, total, isTakeJackpot,isWaitRunMoneyWin = false) {
        if(!isTakeJackpot) {
            let isBigWin = this.CheckBigWin(winNormalValue);
            winNormalValue = total;
            if(winNormalValue > 0) {
                if(!isBigWin) {
                    if(!this.isBattle) {
                        if (ScreenManager.getIns().currentScreen == Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
                            require("WalletController").getIns().UpdateBalance(winNormalValue)
                        }else{
                            require("WalletController").getIns().TakeBalance(this.slotType)
                        }
                    }
                    this.PlayWinMoney();
                    this.effectManager.ShowWinMoneyMulti(winNormalValue);
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
            this.effectManager.ShowJackpot(total, this.toDoList, true, true, true);
        }           
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData) {
        this.lineData = lineData;
        this.totalBetValue = totalBetValue;
        this.menuView.UpdateBetValue(totalBetValue);
        if (ScreenManager.getIns().currentScreen != Global.Enum.SCREEN_CODE.INGAME_KILL_BOSS){
            require("WalletController").getIns().UpdateWallet(accountBalance);
        }
        this.normalManager.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData);
    },

    onDestroy() {
        Global.MiniSlot = null;
    },
});
