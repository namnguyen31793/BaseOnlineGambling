
var ThanTaiSpinController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new ThanTaiSpinController();
                this.self.Setup();
                
            }
            return this.self;
        }
    },

    Setup()
    {
        //this.betLinesText();
        this.lineIndex = 25;
        this.lineInfo = "";
        this.X2GameController = require("X2GameController").getIns();
        this.roomID = 1;
        this.SetupResponseCode();
    },

    SetupResponseCode()  
    {

        this.MSG_SERVER_GET_ROOM_CONFIG = 552;
        this.MSG_SERVER_THAN_TAI_GAME_JACKPOT_INFO = 589;
        this.MSG_SERVER_THAN_TAI_GAME_SPIN = 590;
        this.MSG_SERVER_THAN_TAI_GAME_GET_ACCOUNT_INFO = 591;
        this.MSG_SERVER_THAN_TAI_GAME_GET_ACCOUNT_FREETURN = 592;
        this.MSG_SERVER_THAN_TAI_GAME_GET_TOP_TAKE_JACKPOT_INFO = 593;
        this.MSG_SERVER_THAN_TAI_GAME_GET_DETAIL_HISTORY = 594;
        this.MSG_SERVER_THAN_TAI_GAME_SPIN_CHOI_THU = 595;
        this.MSG_SERVER_THAN_TAI_GAME_X2_REWARD = 596;
    },

        setRoomID(roomID)
        {
            this.roomID = roomID;
        },
        setGameID(gameID)
        {
            this.gameID = gameID;
        },

        Inc_RoomID()
        {
            this.roomID++;
            if(this.roomID > this.RoomConfig_Map.length)
                this.roomID = 1;
        },
        
        setIconView(iconView) {
            return this.iconView = iconView;
        },

        getIconView() {
            return this.iconView;
        },

        setSpinView(spinView) {
            return this.spinView  = spinView;
        },

        setEffectView(effectView)
        {
            return this.effectView = effectView;
        },
        setAudioPool(audioPool)
        {
            this.audioPool = audioPool;        
        },

        setBetValue(betValue)
        {
            if (this.spinView.updateBetUI) {
                this.spinView.updateBetUI(betValue);
            }
            return this.betValue = betValue;
        },
        getBetValue() {
            return this.betValue;
        },

        setButtonView(buttonView)
        {
            return this.buttonView = buttonView;
        },
        setBonusGameView(bonusGameView)
        {
            return this.bonusGameView = bonusGameView;
        },
        setMainView(mainView)
        {
            return this.mainView = mainView;
        },
        setFreeGameView(freeGameView)
        {
            return this.freeGameView = freeGameView;
        },
        setLineManager(lineManager)
        {
            return this.lineManager = lineManager;
        },

        activeButtonSpin(enable) {
            this.isSpin = !enable;
            if (this.buttonView === undefined)
                return;
            return this.buttonView.activeButtonSpin(enable);
        },
        activeButtonX2(enable)
        {
            this.buttonView.activeButtonX2(enable);
        },
        activeButtonAutoSpin(enable) {
            this.isAutoSpin = enable;
            return this.buttonView.activeButtonAutoSpin(enable);
        },
        checkIsSpin() {
            if (!this.isAutoSpin && !this.isSpin) {
                return false;
            } else {
                return true;
            }
        },
        stopSpinFinish() {
            return this.spinView.stopSpinFinish();
        },
        getLastSpinResponseData()
        {
            return this.spinResponseData;
        },

        getIsFastSpin()
        {
            return this.spinView.isFastSpin;
        },

        ResponseNetwork(code, packet) {
            switch (code) {
                case this.MSG_SERVER_GET_ROOM_CONFIG:
                    this.ServerResponse_Handle_GetRoomConfig(packet);
                    break;
                case this.MSG_SERVER_THAN_TAI_GAME_GET_ACCOUNT_INFO:
                   this.ServerResponse_Handle_GetAccountInfo(packet);
                    break;
                case this.MSG_SERVER_THAN_TAI_GAME_JACKPOT_INFO:
                    this.ServerResponse_Handle_GetJackpotInfo(packet);
                    break;
                case this.MSG_SERVER_THAN_TAI_GAME_SPIN:
                    cc.log(packet);
                    this.ServerResponse_Handle_GetSpinResult(packet);
                    break;
                case this.MSG_SERVER_THAN_TAI_GAME_GET_DETAIL_HISTORY:
                    this.GetHistory(packet);
                    break;
                case this.MSG_SERVER_THAN_TAI_GAME_GET_TOP_TAKE_JACKPOT_INFO:
                    this.GetTop(packet);
                    break;
                case this.MSG_SERVER_THAN_TAI_GAME_X2_REWARD:
                    this.X2GameController.Handle_X2Game_Response(packet);
                    break;
                case this.MSG_SERVER_THAN_TAI_GAME_SPIN_CHOI_THU:
                    this.ServerResponse_Handle_ChoiThu(packet);
                    break;
            }
        },

        ServerResponse_Handle_GetAccountInfo(packet)
        {
            cc.log(" --  ServerResponse_Handle_GetAccountInfo");
            cc.log(packet);
            let accountBalance = packet[1];
            let betPerLine = packet[2];
            let jackpotValue = packet[3];
            let lineData = packet[4];
            let lastPrizeValue = packet[5];
            let freeSpin = packet[6];
            let isTakeFreeSpin = packet[7];
            let bonusCounter = packet[8];
            let isBonusTurn = packet[9];
            let lastMatrix = packet[10];

            // update balance 
            require("BalanceController").getIns().updateRealBalance(accountBalance);
            require("BalanceController").getIns().updateBalance(accountBalance);

            this.setBetValue(betPerLine);
            this.spinView.updateJackpotUI(jackpotValue);
            this.spinView.randomIcon()  
            
            if(bonusCounter > 0)
            {
                this.mainView.Create_BonusGameView();
                this.bonusGameView.BonusGame_SetUp(this.packet);
            }
            else if(freeSpin > 0)
            {
                if(this.freeGameView == null)
                {
                    this.mainView.Create_FreeGameView();
                    this.freeGameView.FreeSpin_SetUp(freeSpin);
                }
                else
                {
                    this.freeGameView.FreeSpin_UpdateInfo(freeSpin);
                }
            }


          
        },

        ServerResponse_Handle_GetRoomConfig(packet)
        {
           cc.log(">>>> ServerResponse_Handle_GetRoomConfig");
            let roomConfigArray = packet[1].map(jsonString => JSON.parse(jsonString));           
            this.RoomConfig_Map = roomConfigArray;
            
            this.CurrentRoomConfig = this.RoomConfig_Map.find(obj => obj.RoomBetId ==  this.roomID );
            this.spinView.updateBetUI(this.CurrentRoomConfig.Bet);
            this.spinView.updateTotalLines(this.lineIndex,this.CurrentRoomConfig.Bet);
            
           
        },

       
        ServerResponse_Handle_GetJackpotInfo(packet)
        {
            let jackpotValue_Room1 = packet[1];
            let jackpotValue_Room2 = packet[2];
            let jackpotValue_Room3 = packet[3];

           switch(this.roomID)
           {
                case 1:
                    this.spinView.updateJackpotUI(jackpotValue_Room1);
                    break;
                case 2:
                    this.spinView.updateJackpotUI(jackpotValue_Room2);
                    break;
                case 3:
                    this.spinView.updateJackpotUI(jackpotValue_Room3);
                    break;
           }

        },
        ServerResponse_Handle_GetSpinResult(packet)
        {
           
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
            let totalBet = packet[15];
            
            this.spinView.updateJackpotUI(currentJackpotValue);
            require("BalanceController").getIns().subtractBalanceUI(totalBet);
           
            this.spinResponseData = packet;
            this.spinView.startSpin();
        },

        ServerResponse_Handle_ChoiThu(packet)
        {
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
            let totalBet = packet[15];
            
            this.spinView.updateJackpotUI(currentJackpotValue);
            require("BalanceController").getIns().subTryBalance(totalBet);
           
            this.spinResponseData = packet;
            this.spinView.startSpin();
        },
        Handle_ShowEffect(type, rewardAmount, time)
        {
            this.effectView.node.active = true;
            this.effectView.ShowEffect(type, rewardAmount, time);
        },
        Handle_ResetEffect()
        {
            this.effectView.ResetAllEffect();

        },
        Handle_Inc_BetLine(lineIndex)
        {  
                this.lineIndex = lineIndex;      
        },

        Get_LineInfo()
        {
            const numbersArray = Array.from({ length: this.lineIndex }, (_, index) => index + 1);
            // Chuyển mảng thành chuỗi, sử dụng phương thức join với dấu ","
            const commaSeparatedString = numbersArray.join(",");
            return commaSeparatedString;
        },
        DefaultMaxLineInfo()
        {
            return '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25';
        },
        Defaul_MaxRoom()
        {
            return 3;
        },

        Handle_AfterSpinAnimation()
        {
            let spinId = this.spinResponseData[1];
            let matrix = this.spinResponseData[2];
            let listLineWinData = this.spinResponseData[3];
            let winNormalValue = this.spinResponseData[4];
            let numberBonusSpin = this.spinResponseData[5];
            let winBonusValue = this.spinResponseData[6];
            let freeSpinLeft = this.spinResponseData[7];
            let valueFreeSpin = this.spinResponseData[8];
            let totalWin = this.spinResponseData[9];
            let accountBalance = this.spinResponseData[11];
            let currentJackpotValue = this.spinResponseData[12];
            let isTakeJackpot = this.spinResponseData[13];
            let extandMatrix = this.spinResponseData[14];

            this.spinView.Handle_AfterStopSpin(this.spinResponseData);  
            
            if(numberBonusSpin > 0)
            {
                this.mainView.Create_BonusGameView();
                this.bonusGameView.BonusGame_SetUp(this.spinResponseData);
            }
            else if(freeSpinLeft > 0)
            {
                if(this.freeGameView == null)
                {
                    this.mainView.Create_FreeGameView();
                    this.freeGameView.FreeSpin_SetUp(freeSpinLeft);
                 
                }
                else
                {
                    this.freeGameView.FreeSpin_UpdateInfo(freeSpinLeft);
                }
                this.Handle_AutoRespin();
            }
            else
            {
                if(!isTakeJackpot)
                    this.Handle_AutoRespin();
            }
           
            
            if(freeSpinLeft == 0)
            {
                if(this.freeGameView != null)
                    this.freeGameView.node.destroy();
            }

            if(!this.spinView.tryPlay)
            {
                this.X2GameController.setBaseValue(totalWin);
                this.activeButtonX2(totalWin>0);
            }        
        },
        Handle_AutoRespin()
        {
            if(!this.CheckNotEnoughMoney())
            {
                return;
            }

            if(this.isAutoSpin)
            {
               this.spinView.scheduleOnce(()=>{
                   this.spinView.onClick_Spin();
               },2.5);    
            }
        },
        GetTryPlayData()
        {
            return null;
        },
        CheckNotEnoughMoney()
        {
            let currentLine = this.spinView.ThanTai_LineManager.Get_CurrentLineAmount();
            if(Global.MainPlayerInfo.ingameBalance >= (this.CurrentRoomConfig.Bet*currentLine))
                return true;
            return false;
        },
        


    });

module.exports = ThanTaiSpinController;