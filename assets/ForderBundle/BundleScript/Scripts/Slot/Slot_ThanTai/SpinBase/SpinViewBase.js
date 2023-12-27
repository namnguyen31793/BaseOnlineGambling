
var slotsConfig = require('SlotsConfig');
var effectConfig = require('EffectType');
cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.indexStopColumn = 0;
    },

    properties: {
      
        lbiTotalBet: cc.LabelIncrement,
        lbiTotalWin: cc.LabelIncrement,
        lbiJackpot: cc.LabelIncrement,
        lbSessionID: cc.Label,
        lbTotalLines: cc.Label,
        lbTotalLinesFreeSpin: cc.Label,
        lbBetPerLine: cc.Label,
        spinColumnViews: {
            default: [],
            type:  require("SpinColumnView")
        },
        SieuToc_Toggle : cc.Toggle,
        ChoiThu_Toggle : cc.Toggle,
    },   

    // LIFE-CYCLE CALLBACKS:
    

    onLoad () {

     

        this.audioController =  require("AudioController").getIns();

        this.scheduler = cc.director.getScheduler();
        this.isSpining = false;
        this.isFastSpin = false;
        this.isAutoSpin = false;
        //this.tryPlay = false;
        this.tryPlay = false;
        this.betLinesText = '';

        this.timeBetweenCol = 0;
        this.spinController = this.setSpinController();
        this.spinController.setSpinView(this);

        this.Handle_AfterJoinRoom();
        

    },
    Handle_AfterJoinRoom()
    {
      
    },
    

    start () {

    },
    setSpinController()
    {
      
    },
    setCurrentGameID()
    {

    },

     //goi setAccountID khi joinRoom de biet duoc la tryUser hay User that
     setSpinAccountID: function (spinAccountID) {
        this.spinAccountID = spinAccountID;
    },
    
    //set sessionID UI ngoai game
    setSessionID: function (sessionID) {
        this.lbSessionID.string = sessionID;
    },

    //update lai totalWin UI (dung cho FS khi joinRoom de set totalWin da quay dc)
    updateTotalWinUI: function (amount) {
        this.lbiTotalWin.tweenValueto(amount);
    },

    //cap nhat betlinesText de truyen len server khi SPIN
    updateBetLinesText: function (betLinesText) {
        this.betLinesText = betLinesText;
    },
    updateBetUI(betPerLine)
    {
        if(this.lbBetPerLine)
        this.lbBetPerLine.string = betPerLine;
    },
    updateTotalBetUI(totalBet)
    {
        this.lbiTotalBet.string = totalBet;
    },

    getBetLinesText: function () {
        return this.betLinesText;
    },

    //update tong so Line UI
    updateTotalLines: function (totalLines,betValue) {
        this.lbTotalLines.string = totalLines;

        if (this.lbTotalLinesFreeSpin !== null)
            this.lbTotalLinesFreeSpin.string = totalLines;
        if(!this.tryPlay)
        {
            this.updateTotalBet (totalLines * this.spinController.getBetValue());
        }
        else
        {
            this.updateTotalBet (totalLines * betValue);
        }
    },



    getTotalLines: function () {
        return this.lbTotalLines.string;
    },
    startSpin: function (isNearWin = false) {
       
        var self = this;

        
        //dat lich SPIN lan luot cac cot
        if(!this.isFastSpin)
        { 
            this.scheduler.schedule(function () {                      
                self.spinColumn(isNearWin);
            }, this, 0, 0, 0, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol * 2, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol * 3, false);
            this.scheduler.schedule(function () {
                self.spinColumn(isNearWin);
            }, this, 0, 0, this.timeBetweenCol * 4, false);
        }
        else
        {
            this.scheduler.schedule(function () {            
                self.fastStopColumn();
            }, this, 0, 0, 0, false);
            this.scheduler.schedule(function () {
                self.fastStopColumn();
            }, this, 0, 0, this.timeBetweenCol, false);
            this.scheduler.schedule(function () {
                self.fastStopColumn();
            }, this, 0, 0, this.timeBetweenCol * 2, false);
            this.scheduler.schedule(function () {
                self.fastStopColumn();
            }, this, 0, 0, this.timeBetweenCol * 3, false);
            this.scheduler.schedule(function () {
                self.fastStopColumn();
            }, this, 0, 0, this.timeBetweenCol * 4, false);
        }
    },

   
    spinColumn: function (isNearWin = false) {
        this.spinColumnViews[this.indexSpin].spin(isNearWin);
        this.indexSpin++;
    },
    fastStopColumn: function () {
        this.resetColumnEffect();
        this.spinColumnViews[this.indexSpin].fastStop();
        this.indexSpin++;
    },
    stopColumn()
    {    
        this.spinColumnViews[this.indexStopColumn].stop();
        ++this.indexStopColumn; 
    },


    //cap nhat UI TotalBet
    updateTotalBet: function (totalBet) {
        this.totalBet = totalBet;
        this.lbiTotalBet.setValue(totalBet);
    },

    updateJackpotUI(currentJackpot)
    {
        this.lbiJackpot.tweenValueto(currentJackpot);
    },
    randomIcon: function () {
        this.spinColumnViews.forEach(function (spinColumnView) {
            spinColumnView.randomAllIcon();
        });
    },
    resetColumnEffect()
    {
        this.spinColumnViews.forEach(function(spinColumnView) {
            spinColumnView.Column_ResetEffect();
        });
    },

  
    onDestroy()
    {
        Global.MainPlayerInfo.SetCurrentGameID(0);
    },

    //#region  Network
    
    ClientRequest_GetInfoJoinRoom()
    {
        let msg = {};
        msg[40] = Global.MainPlayerInfo.currentGameID;

        let msg2 = {};
        msg2[1] = 1;
        msg2[20] =  Global.MainPlayerInfo.currentGameID;
        msg2[40] =  Global.MainPlayerInfo.currentGameID;
 
        require("SendRequest").getIns().MST_Client_Slot_Open_Game(msg);
        //require("SendRequest").getIns().MST_Client_Slot_Get_Account_Info(msg2);     
        this.resetRoomInfo();
    },

    ClientRequest_GetRoomConfig()
    {
        let msgRoomConfig = {};
        msgRoomConfig[40] = Global.MainPlayerInfo.currentGameID;
        require("SendRequest").getIns().MST_Client_Slot_Get_Room_Config(msgRoomConfig);
    },
    //#endregion

    //#region  Button Handle
    onClick_Spin()
    {      
       
        this.audioController.playSound(cc.AudioTypes.CLICK);
        if(!this.spinController.CheckNotEnoughMoney())
            return;
        this.audioController.playSound(cc.AudioTypes.SPIN);
    
        this.isSpining = true;
        var self = this;
        this.resetSpinIndex();
         //Set time goi STOP va time goi SPIN cot theo mode
         if (this.isFastSpin) {
            this.timeBetweenCol = slotsConfig.TIME_COLUMN_FAST;
            this.timeStop = slotsConfig.TIME_CALL_STOP_FAST;
        } else {
            this.timeBetweenCol = slotsConfig.TIME_COLUMN_NORMAL;
            this.timeStop = slotsConfig.TIME_CALL_STOP_NORMAL;
        }
        this.resetSpin();
        //Khoa Click cac button chuc nang
        this.spinController.activeButtonSpin(false);

        /*
        let packet = [];
        //let spinId
        packet[1] = 0;
        //let matrix 
        packet[2] = '20,5.576,5.576,20,21,19,3.8,3.68,4.288,4.288,3.168,3.8,3.18,19,3.18';
        //let listLineWinData 
        packet[3] = '54,72,158,59';
        //let winNormalValue 
        packet[4] = 200500;
        //let numberBonusSpin 
        packet[5] = 0;
        //let winBonusValue 
        packet[6] = 0;
        //let freeSpinLeft 
        packet[7] = 7;
        
        //let valueFreeSpin 
        packet[8] = 0;
        //let totalWin 
        packet[9] = 200500;
        //let accountBalance
        packet[11] = 100000;
        //let currentJackpotValue 
        packet[12] = 0;
        //let isTakeJackpot 
        packet[13] = 0;
        //let extandMatrix 
        packet[14] = '';
         this.spinController.ServerResponse_Handle_GetSpinResult(packet)
        */

        /*
        let dataLine = '0,11,2,3,4';
        let lineId =  require("AllwayLineManager").getIns().findLineID(dataLine);
        cc.log("LineID : "+lineId);

        let dataLine2 = '0,11,12,3,4';
        let lineId2 =  require("AllwayLineManager").getIns().findLineID(dataLine2);
        cc.log("lineId2 : "+lineId2);

        let dataLine3 = '5,11,12,8,14';
        let lineId3 =  require("AllwayLineManager").getIns().findLineID(dataLine3);
        cc.log("lineId3 : "+lineId3);

        let dataLine4 = '0,11,2,8,14';
        let lineId4 =  require("AllwayLineManager").getIns().findLineID(dataLine4);
        cc.log("dataLine4 : "+lineId4);
        */


       

        
        if(!this.tryPlay)
        {
           cc.log("CLICK SPIN - MST_CLIENT_SLOT_SPIN");
            let msg = {};
            msg[1] = this.spinController.roomID;
            msg[2] = this.spinController.Get_LineInfo();
            msg[20] = this.spinController.gameID;
            msg[40] = this.spinController.gameID;
            Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_SPIN, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
        }
        else
        {
            cc.log("CLICK SPIN - MSG_CLIENT_SLOT_SPIN_CHOI_THU");
            let tryPlayData = this.spinController.GetTryPlayData();

            if(tryPlayData == null)
            {
                let msg = {};
                msg[1] = this.spinController.Defaul_MaxRoom();
                msg[2] = this.spinController.DefaultMaxLineInfo();
                msg[20] = this.spinController.gameID;
                msg[40] = this.spinController.gameID;
                Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_SPIN_CHOI_THU, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
            }
            else
            {
                this.spinController.PlayTutorial(tryPlayData);
            }
        }
        
    },

    onClick_FastSpin()
    {
        if(this.isSpining)
            return;
        this.isFastSpin =  this.SieuToc_Toggle.isChecked;
    
    },

    onClick_AutoSpin()
    {
        if(this.isSpining)
            return;
        this.isAutoSpin = !this.isAutoSpin;
        this.spinController.activeButtonAutoSpin(this.isAutoSpin);

        if (this.isAutoSpin && !this.isSpining) {
            this.onClick_Spin();
        }
    },

    onClick_ChangeBet()
    {
        if(this.isSpining)
            return;
        if(this.tryPlay)
            return;
       this.spinController.Inc_RoomID();
       this.resetRoomInfo();
      
    },

    onClick_IncRoom()
    {
        if(this.isSpining)
            return;
        if(this.tryPlay)
            return;
       if(this.spinController.Inc_RoomID())
        this.resetRoomInfo();
    },
    onClick_DecRoom()
    {
        if(this.isSpining)
            return;
        if(this.tryPlay)
            return;
       if(this.spinController.Dec_RoomID())
        this.resetRoomInfo();
    },

  
  

    onClick_TryPlay()
    {
        if(this.isSpining)
            return;
        this.tryPlay = this.ChoiThu_Toggle.isChecked;
       
    },
    //#endregion

    //#region  Effect
     //reset lai cac tham so + tat cac hieu ung + stop cac schedule
     resetSpin: function () {
        this.unscheduleAllCallbacks();
        this.spinController.Handle_ResetEffect();
        this.updateTotalWinUI(0);
        
    },
    resetSpinIndex()
    {
        this.indexSpin = 0;
        this.indexStopColumn = 0
    },
    resetRoomInfo()
    {
        let msg = {};
        msg[1] = this.spinController.roomID;
        msg[20] = this.spinController.gameID;
        msg[40] = this.spinController.gameID;     
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_GET_ROOM_CONFIG, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_GET_JACKPOT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_GET_ACCOUNT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
     
    },
    getRoomConfig()
    {
        let msg = {};
        msg[1] = this.spinController.roomID;
        msg[20] = this.spinController.gameID;
        msg[40] = this.spinController.gameID;  
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_GET_ROOM_CONFIG, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);   
    },
    getJackpot()
    {
        let msg = {};
        msg[1] = this.spinController.roomID;
        msg[20] = this.spinController.gameID;
        msg[40] = this.spinController.gameID;  
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MST_CLIENT_SLOT_GET_JACKPOT_INFO, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },
    //#endregion

    //goi khi STOP SPIN xong
    stopSpinFinish: function () {
        
    },

    Handle_AfterStopSpin(spinData)
    {
        this.resetSpinIndex();
        
        let spinId = spinData[1];
        let matrix = spinData[2];
        let listLineWinData = spinData[3];
        let winNormalValue = spinData[4];
        let numberBonusSpin = spinData[5];
        let winBonusValue = spinData[6];
        let freeSpinLeft = spinData[7];
        let valueFreeSpin = spinData[8];
        let totalWin = spinData[9];
        let accountBalance = spinData[11];
        let currentJackpotValue = spinData[12];
        let isTakeJackpot = spinData[13];
        let extandMatrix = spinData[14];

        this.detectEffectType(spinData);
        this.updateTotalWinUI(winNormalValue);
        this.spinController.activeButtonSpin(true);

      
    },
    detectEffectType(spinData)
    {
        let spinId = spinData[1];
        let matrix = spinData[2];
        let listLineWinData = spinData[3];
        let winNormalValue = spinData[4];
        let numberBonusSpin = spinData[5];
        let winBonusValue = spinData[6];
        let freeSpinLeft = spinData[7];
        let valueFreeSpin = spinData[8];
        let totalWin = spinData[9];
        let accountBalance = spinData[11];
        let currentJackpotValue = spinData[12];
        let isTakeJackpot = spinData[13];
        let extandMatrix = spinData[14];

        let effectType = 0;
        if(isTakeJackpot)
        {
            // chay effect trung jackpot
            effectType = effectConfig.JACKPOT;
        }

        if(winBonusValue > 0)
        {
            effectType = effectConfig.BONUS;
       
        }
        if(valueFreeSpin > 0)
        {
            effectType = effectConfig.FREESPIN;
         
        }
        if(winNormalValue > 0 && numberBonusSpin == 0 && freeSpinLeft == 0)        
        {
           
            this.PlayNormalWinSound();
            if(!isTakeJackpot)
            {
                // gia tri minBigwinValue de kiem tra bigwin
                let minBigwinValue = (this.spinController.CurrentRoomConfig.Bet * 6);
                if(winNormalValue >= minBigwinValue)
                {
                    effectType = effectConfig.BIG_WIN;
                }        
            }
            else
            {
                effectType = effectConfig.JACKPOT;
            }
            
        }
        this.spinController.Handle_ShowEffect(effectType,winNormalValue);  
    },
  
    runContinueScript: function() {
        if(!this.storeNextScripts)
        return;

        var t = this.storeNextScripts
          , e = t.data
          , o = t.object
          , i = t.script;

          if(this.storeCurrentScripts)
          {
            if(t)
            {
                if(o === null && o === undefined)
                    this.storeCurrentScripts(t.data);
                else 
                {
                    const { script, object } = this.storeNextScripts;
                    if (script && object) {
                        script.call(object, e);
                    }
                }  
            }
            else
            {
                if(o === null && o === undefined)
                    this.storeCurrentScripts();
                else 
                {
                        const { script, object } = this.storeNextScripts;
                        if (script && object) {
                            script.call(object, e);
                        }
                }
            }

          }

    
        this._resetStoreScript()
    },
    _resetStoreScript: function() {
        this.storeCurrentScripts = "",
        this.storeNextScripts = {
            script: [],
            data: {}
        }
    },

    HideTutorial()
    {
      
    },

    PlayNormalWinSound()
    {
        this.audioController.playSound(cc.AudioTypes.NORMAL_WIN);
    },
   

    



});

