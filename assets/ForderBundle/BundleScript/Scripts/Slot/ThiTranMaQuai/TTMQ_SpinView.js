var slotsConfig = require('SlotsConfig');
var effectConfig = require('EffectType');
cc.Class({
    extends: require("SpinViewBase"), 

    properties: {
       ThanTai_LineManager: require("TTMQ_Line_Manager"),
       ChoiThu_Img : cc.Node,
       HoldToSpin_Btn: require("TTMQ_HoldToSpin"),
    },

    // LIFE-CYCLE CALLBACKS:

   
    onEnable()
    {
        this.indexStopFinish = 0;
        let currentLine = this.ThanTai_LineManager.Get_CurrentLineAmount();
       
        this.updateTotalLines(currentLine);

      this.ChoiThu_Img.active = false;
      this.lbiTotalWin.setValue(0);
  
      this.audioController.enableMusic(true);
      this.audioController.enableSound(true);
      this.audioController.playBackgroundMusic();
      this.spinController.activeButtonX2(false);
    },

    start () {
       
    },
    Handle_AfterJoinRoom()
    {
        this._super();
        this.ClientRequest_GetInfoJoinRoom();
        this.ClientRequest_GetRoomConfig();
    },

    setSpinController()
    {
        this.spinController = require("ThanTaiSpinController").getIns();
        return this.spinController;
    },

     //goi khi STOP SPIN xong     
     stopSpinFinish: function () {
        this.indexStopFinish++;
        if(this.indexStopFinish < 5)
            return;
        this.audioController.stopSound(cc.AudioTypes.SPIN);

        this.indexStopFinish = 0;
        this.isSpining = false;
        let lastSpinData = this.spinController.getLastSpinResponseData();
        this.spinController.Handle_AfterSpinAnimation();
        
     },
     resetSpin()
     {
        this.ThanTai_LineManager.Handle_Draw_ClearAllLine();
        this._super();
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
                 let minBigwinValue = (this.spinController.CurrentRoomConfig.Bet * 6 * 25);
                 if(winNormalValue >= minBigwinValue)
                 {
                     effectType = effectConfig.BIG_WIN;
                 }
                 else
                    effectType = effectConfig.NORMAL_WIN;
             }
             else
             {
                 effectType = effectConfig.JACKPOT;
             }
             
         }
         this.spinController.Handle_ShowEffect(effectType,winNormalValue);  
     },

     Handle_AfterStopSpin(spinData)
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
        let totalBet = spinData[15];

        if(winNormalValue > 0)
            this.ThanTai_LineManager.DrawLine_RewardSpin(listLineWinData);
       // this.HoldToSpin_Btn.ShowAnimation_Spining();
        this._super(spinData);
       

        if(this.tryPlay)
        {
            require("BalanceController").getIns().addTryBalance(winNormalValue);
        }
        else
        {
            require("BalanceController").getIns().addBalanceUI(winNormalValue);
            require("BalanceController").getIns().updateRealBalance(accountBalance);
        }    
     },

     onClick_SelectLine()
     {
       if(this.tryPlay)
         return;
        let lineCounter = this.ThanTai_LineManager.Handle_Draw_ShowLine();
        this.spinController.Handle_Inc_BetLine(lineCounter);
        this.updateTotalLines(lineCounter);
        this.audioController.playSound(cc.AudioTypes.CLICK);
     },

     onClick_OpenX2Game()
     {
      if(this.tryPlay)
      return;
      this.spinController.activeButtonX2(false);
      this.spinController.mainView.Create_X2GameView();
      this.audioController.playSound(cc.AudioTypes.CLICK);
     },

     onClick_Help()
     {
      this.spinController.mainView.Create_HelpView();
      this.audioController.playSound(cc.AudioTypes.CLICK);
     },
     onClick_Setting()
     {
        this.spinController.mainView.Create_SettingView();
        this.audioController.playSound(cc.AudioTypes.CLICK);
     }
     ,
     onClick_TryPlay()
     {
         this._super();
         
         if(this.tryPlay)
         {
            this.ChoiThu_Img.active = true;
            require("BalanceController").getIns().updateTryBalance(7979797979);
           let maxRoomConfig = this.spinController.RoomConfig_Map.find(obj => obj.RoomBetId ==  this.spinController.Defaul_MaxRoom());
                 
           let maxLine = 25;
           this.updateBetUI(maxRoomConfig.Bet);
           this.updateTotalLines(maxLine,maxRoomConfig.Bet);
          // this.updateTotalLines(maxLine);

         }
         else
         {
            this.ChoiThu_Img.active = false;
            this.resetRoomInfo();
         }
     },
     reset_HoldToSpin()
     {
        this.HoldToSpin_Btn.cancelAutoSpin();
     },

 
    

    // update (dt) {},
});
