cc.Class({
    extends: cc.Component,
    ctor() {
        this.userScore = 0;
        this.rivalScore = 0;
        this.userSpin = 0;
        this.rivalSpin = 0;
        this.endUser = false;
        this.endRival = false;
        this.isEnd = false;
        this.rivalBonus = false;
        this.rivalFree = false;
        this.rivalSlotView = null;
    },

    properties: {
        userAva : cc.Sprite,
        rivalAva : cc.Sprite,
        userName : cc.Label,
        rivalName : cc.Label,
        userTurn : cc.Label,
        rivalTurn : cc.Label,
        time : cc.Label,
        userPoint : require("UpdateProgressEffect"),
        rivalPoint : require("UpdateProgressEffect"),
        seperator : cc.ParticleSystem,
        effectRun : cc.Node,
        userMoney : require("TextJackpot"),
        rivalMoney : require("TextJackpot"),
        btnEnd : cc.Node,
        iconFree : cc.Node,
        iconBonus : cc.Node,
        iconBigWin : cc.Node,
    },

    Init(slotView) {
        this.slotView = slotView;
        this.rivalScore = Global.dataBattle.rivalScore;
        this.node.parent = slotView.node;
        Global.Helper.GetAvata(this.userAva);
        Global.Helper.GetAvataOther(this.rivalAva, Global.dataBattle.rivalName);
        this.userName.string = Global.MainPlayerInfo.nickName;
        this.rivalName.string = Global.dataBattle.rivalName;
        this.UpdateUserTurn(Global.dataBattle.myTurn);
        this.UpdateRivalTurn(Global.dataBattle.rivalTurn);
        this.UpdateUserMoney(Global.dataBattle.userScore);
        this.UpdateRivalMoney(Global.dataBattle.rivalScore);
        this.SetProgress();
        this.btnEnd.x -= (cc.winSize.width-1344)/2;
        this.scheduleOnce(()=>{
            Global.OtherBattle.slotView.SpeedSpin(true);
            Global.OtherBattle.slotView.RequestSpin();
            
        } ,  2);
        this.scheduleOnce(() => {
            Global.SlotNetWork.slotView.menuView.toggleAuto.isChecked = true;
            Global.SlotNetWork.slotView.isAuto = true;
            Global.SlotNetWork.slotView.ActionAutoSpin();
        }, 1);
    },

    RequestSpin() {
        this.slotView.netWork.RequestRivalSpinBattle();
    },

    SetProgress() {
        if(this.userScore == 0 && this.rivalScore == 0) {
            this.userPoint.node.width = 535;
            this.rivalPoint.node.width = 535;
            this.seperator.node.x = 0;
        } else {
            let percent = this.userScore / (this.userScore + this.rivalScore);
            let width = 0;
            if(percent <= 0.5)
                width = percent * 1070;
            else width = 535 + 1050 * (percent - 0.5);
            if(width < 30)
                width = 30;
            let rivalWidth = 1070 - width;
            if(rivalWidth < 30)
                rivalWidth = 0;
            this.userPoint.UpdateWidth(width, 1, this);
            this.rivalPoint.UpdateWidth(rivalWidth, 1);
        }
    },

    UpdateUserTurn(userTurn) {
        this.userSpin = userTurn;
        this.userTurn.string = userTurn.toString();
        if(userTurn <= 0) {
            Global.SlotNetWork.slotView.EndBattle();
        }
    },

    UpdateRivalTurn(rivalTurn) {
        this.rivalSpin = rivalTurn;
        this.rivalTurn.string = rivalTurn.toString();
    },

    UpdateRivalSpinBattle(winNormalValue, winBonusValue, numberBonusSpin, freeSpinLeft, totalWin, accountBalance, isTakeJackpot, rivalTurn) {
        let timeWait = 1.5;
        if(numberBonusSpin > 0) {
            timeWait += 2;
            if(!this.rivalBonus) {
                this.rivalBonus = true;
                timeWait += 2;
                cc.log("rival start bonus")
            }
        }
            
        if(winBonusValue > 0 && numberBonusSpin == 0) {
            timeWait += 5;
            this.rivalBonus = false;
            cc.log("rival end bonus")
        }
            
        if(freeSpinLeft > 0) {
            timeWait += 2;
            if(!this.rivalFree) {
                this.rivalFree = true;
                this.timeWait += 3;
                cc.log("rival start free");
            }
        }
        if(freeSpinLeft == 0 && this.rivalFree) {
            timeWait += 3;
            this.rivalFree = false;
            cc.log("rival end free");
        }
            
        if(totalWin > 0)
            timeWait += 1;
        // if(totalWin > Global.OtherBattle.slotView.CheckBigWin() && numberBonusSpin == 0) {
        //     timeWait += 2;
        //     this.iconBigWin.active = true;
        //     this.iconBonus.active = false;
        //     this.iconFree.active = false;
        // }
            
        this.scheduleOnce(()=>{
            if(!this.rivalBonus)
                this.iconBonus.active = false;
            else this.iconBonus.active = true;
            if(!this.rivalFree)
                this.iconFree.active = false;
            else this.iconFree.active = true;
            this.iconBigWin.active = false;
            this.UpdateRivalTurn(rivalTurn);
            this.UpdateRivalMoney(accountBalance);
            if(rivalTurn > 0 && !this.isEnd) {
                Global.OtherBattle.slotView.RequestSpin(isRequest);
                this.slotView.netWork.RequestRivalSpinBattle();
            } else {
                this.endRival = true;
                this.OnEnd();
            }
        } ,  timeWait);
    },

    OnEnd() {
        if(this.endUser && this.endRival) {
            this.isEnd = true;
            this.slotView.netWork.RequestEndBattle();
        }
    },

    UpdateUserMoney(userScore) {
        this.userScore = userScore;
        this.userMoney.StartIncreaseTo(userScore);
        this.SetProgress();
    },

    UpdateRivalMoney(rivalScore) {
        this.rivalScore = rivalScore;
        this.rivalMoney.StartIncreaseTo(rivalScore);
        this.SetProgress();
    },

    ClickEndBattle() {
        Global.UIManager.showConfirmPopup (Global.MyLocalization.GetText("END_BATTLE"), ()=>{
            Global.SlotNetWork.slotView.battleManager.isEnd = true;
            Global.SlotNetWork.slotView.isAuto = false;
            Global.SlotNetWork.slotView.isGiveUpBattle = true;
            require("SendRequest").getIns().MST_Client_Battle_Field_Confirm_Lose();
        });
        
    },

    FormatTime(existTime) {
        if(existTime <= 0) {
            this.isEnd = true;
            this.slotView.netWork.RequestEndTimeBattle();
            this.slotView.SetEndBattle();
            this.slotView.CheckEndBattle();
        } else {
            let minute = parseInt(existTime / 60);
            let second = parseInt(existTime - minute * 60);
            let strMinute = minute.toString();
            if(minute < 10) strMinute = "0"+minute;
            let strSecond = second.toString();
            if(second < 10) strSecond = "0"+second;
            this.time.string = strMinute+":"+strSecond;
        }
    },

    UpdateProgress(isRun) {
        if(isRun) {
            // this.effectRun.active = true;
            this.seperator.startSize = 30;
        } else {
            // this.effectRun.active = false;
            this.seperator.startSize = 10;
        }
        
    },

    update(dt) {
        if(!this.isEnd && Global.dataBattle != null) {
            this.seperator.node.x = this.userPoint.node.width-535;
            let existTime = Global.dataBattle.endTimeLive -(require("SyncTimeControl").getIns().GetCurrentTimeServer() - Global.dataBattle.startTime)/1000;
            this.FormatTime(existTime);
        }
        
    },
});
