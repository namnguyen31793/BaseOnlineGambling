cc.Class({
        extends : require('SlotController'),
        ctor(){
            this.activeButton = true;
            this.isSpin = false;
            this.isAuto = false;
            this.isSpeed = false;
            this.isgetResult = false;
            this.betValue = 0;
            this.lineData = 20;
            this.stateSpin = 0;

            this.NUMBER_COLUMN =5;
            this.TIME_SPIN = 0.2;
            this.TIME_DISTANCE_COLUMN = 0.25;
            this.NUMBER_LINE = 20;
            this.stackSpin = [];
            this.NAME_BUNDLE_STRING = "37";
        },

        properties: {
        },
        onLoad: function () {
            this._super();
            cc.log("onLoad 2")
        },

        //game kế thừa sửa phần này để chỉnh tùy chọn show room hay game
        Init: function () {
            this.setLineData (this.NUMBER_LINE)
            //game chọn rom thi show room
            //this.activeRoom();
            //game không có chọn room thì lần đầu vào chọn room 1
            this.JoinSlot(1);
        },
        
        JoinSelectRoom: function () {
            if(this.slotUI)
                this.slotUI.Hide();
            if(this.nodeRoom)
                this.nodeRoom.active = true;
        },

        JoinSlot: function (roomId) {
            this.SelectRoom(roomId);
            if(this.slotUI)
                this.slotUI.Show();
            if(this.slotMenu)
                this.slotMenu.Show();
            if(this.nodeRoom)
                this.nodeRoom.active = false;
        },
        
        /*
        Kế thừa wallet thay đổi số dư và xử lý tiền
        */
        OnUpdateMoney(gold) {
            this.slotMenu.UpdateMoney(gold);
        },

        UpdateMoneyNormalGame(winMoney, accountBalance, isBuyFree = false) {
            cc.log("UpdateMoneyNormalGame isBuyFree "+isBuyFree+" - this.totalBetValue "+this.betValue)
            let betValue = this.betValue;
            //free và bonus sẽ k mất tiền lượt quay
            if(this.isFree || this.isBonus)
                betValue = 0;
            //buy free giá tiền khác với giá quay
            if(isBuyFree)
                betValue = this.totalBetValue*CONFIG.MULTI_BET_BONANZA;
             require("WalletController").getIns().PushBalance(this.getGameId(), betValue, winMoney, accountBalance);
            
        },

        SelectRoom(roomId) {
            this._super(roomId);
        },

        DeActiveButtonMenu() {
            this.activeButton = false;
            this.slotMenu.ActiveButtonMenu(false);
        },

        ActiveButtonMenu() {
            this.isSpin = false;
            this.activeButton = true;
            this.slotMenu.ActiveButtonMenu(true);
        },

        UpdateBetValue(totalBetValue) {
            this.betValue = totalBetValue;
            this.slotMenu.UpdateBetValue(totalBetValue)
        },

        GetBetValue() {
            return this.betValue;
        },

        CheckStateAuto() {
            if(this.isAuto) {
                this.ActionAutoSpin();
            }
        },

        ActionAutoSpin() {
            if(!this.isSpin && this.isAuto ) {
                // this.slotEffect.ClickCloseNotify(false);
                // this.slotEffect.ClickCloseFree();
                // this.slotEffect.ClickCloseBonus();
                // this.bonusManager.isCheckAuto = false;
                this.slotEffect.Clear();
                let packet = this.GetStack();
                let isRequest = true;
                this.RequestSpin(isRequest);
                if(packet) {
                    this.ProceduGetResult(packet);
                }
            }
        },

        RequestSpin(isRequest = true) {
            if(Global.MainPlayerInfo.ingameBalance < this.totalBetValue && !this.isFree && !this.isBonus) {
                Global.UIManager.showCommandPopup(Global.MyLocalization.GetText("NOT_ENOUGHT_MONEY_TO_PLAY"));
                if(this.isAuto) {
                    this.slotMenu.OffButtonAuto();
                    this.isAuto = false;
                }
                return;
            }
            this.ResetUINewTurn();
            this.isSpin = true;
            this.slotSound.PlayAudioSpin();
            this.slotEffect.Clear();
            this.PlayEffectSpin();
            
            if(!this.isFree && !this.isBonus)
                this.slotMenu.ClearTotalWinFreeCache();
    
            this.DeActiveButtonMenu();
            if(isRequest) {
                if(this.roomID != 0){
                    this.CallRequestSpin();  
                }else{
                    this.CallRequestSpinTry();  
                }
            }
        },

        PlayEffectSpin() {
            this.isgetResult = false;
            this.stateSpin = 0;
            this.stateGetResult = 0;
            let timeDistanceColumn = this.TIME_DISTANCE_COLUMN;
            if(this.GetIsSpeed())
                timeDistanceColumn = 0;
            let timeSpin = this.TIME_SPIN + timeDistanceColumn * (this.NUMBER_COLUMN-1);
            cc.log("PlayEffectSpin "+timeSpin)
            this.scheduleOnce(()=>{
                cc.log("PlayEffectSpin ++++")
                this.slotUI.OnCheckSpinSuccess();
                this.slotUI.OnCheckUpdateMatrix();
            } , timeSpin);
            this.slotUI.PlaySpinColumn(timeDistanceColumn);
            //this.slotSound.PlaySpinStart();
        },

        GetIsSpeed(){
            return this.slotMenu.isSpeed;
        },

        CheckEndAnimNearWin(freeTurn, bonusTurn) {
            cc.log("CheckEndAnimNearWin "+freeTurn);
            if(!this.isFree && !this.isBonus) {
                if((freeTurn > 0 || bonusTurn > 0) && this.slotUI.CheckNearWin()) {
                    if(freeTurn > 0)
                        this.slotUI.EndItemBonusPreWin();
                    if(bonusTurn > 0)
                        this.slotUI.EndItemFreePreWin();
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
            this.slotUI.EndAllItemPreWin();
            this.toDoList.DoWork();
        },
    

        UpdateLineWinData(lineWinData) {
            this.slotUI.ShowLineWin(lineWinData);     
        },

        HideLineWinData() {
            this.slotUI.HideAllLine() ;     
        },

        /*
        Kế thừa lắng nghe server
        */
        ResponseServer(code, packet) {
            cc.log("ResponseServer "+code)
            cc.log(packet)
            switch (code) {
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_GET_ROOM_CONFIG:
                    this.GetRoomConfig(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_CAY_KHE_GAME_GET_ACCOUNT_INFO:
                    this.GetAccountInfo(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_CAY_KHE_GAME_JACKPOT_INFO:
                    this.GetJackpotInfo(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_CAY_KHE_GAME_SPIN:
                    this.ProceduGetResult(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_CAY_KHE_GAME_SPIN_CHOI_THU:
                    this.ProceduGetResultTry(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_CAY_KHE_GAME_SELECT_FREE_TYPE:
                    this.SelectInputFree(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_CAY_KHE_GAME_GET_DETAIL_HISTORY:
                    //this.SelectInputFree(packet);
                    break;
            }
        },

        GetRoomConfig(packet) {
            cc.log(packet)
            let config = [];
            for(let i = 0; i < packet[1].length; i++) {
                config[i] = JSON.parse(packet[1][i]);
            }
            cc.log(config);
        },

        SelectInputFree(packet) {
            cc.log(packet)
            let turn = packet[1];
            this.slotEffect.HandleInputFreeGame(()=>{
                this.slotMenu.UpdateTextTurnFree(turn);
                this.ShowFree(turn)
            });
        },

        GetAccountInfo(packet) {
            cc.log(packet)
            Global.UIManager.hideMiniLoading();
            let accountBalance = packet[1];
            let totalBetValue = packet[2];
            let jackpotModel = packet[3];
            let lineData = packet[4];
            let lastPrizeValue = packet[5];
            let freeSpin = packet[6];
            let isTakeFreeSpin = packet[7];
            let bonusCounter = packet[8];
            let isBonusTurn = packet[9];
            let lastMatrix = packet[10];
            let isNotSelectFreeTurnType = packet[12];
    
            this.DeActiveButtonMenu();
            this.toDoList.CreateList();
            this.toDoList.AddWork(()=>{
                //todolist true đợi diễn effect show free nếu đang chơi dở lần trước
                this.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotModel, lastPrizeValue, lineData, isNotSelectFreeTurnType);
            }, true);
            this.toDoList.AddWork(()=>{
                this.OnUpdateLastMatrix(lastMatrix);
                this.ActiveButtonMenu();
                this.CheckStateAuto();
            }, false);
            this.toDoList.Play();
        },

        GetJackpotInfo(packet) {
            let currentJackpotModel = packet[1];
            this.slotMenu.UpdateJackpotValue(currentJackpotModel);
        },

        ProceduGetResult(packet) {
            if(this.isgetResult) {
                this.AddStack(packet);
                return;
            }
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
            let currentJackpotModel = packet[12];
            let isTakeJackpot = packet[13];
            let extendMatrixDescription = packet[14];
    
            this.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue,freeSpinLeft, totalWin, accountBalance, currentJackpotModel, isTakeJackpot, extendMatrixDescription);
        },

        ProceduGetResultTry(packet) {
            if(this.isgetResult) {
                this.AddStack(packet);
                return;
            }
            let spinId = packet[1];
            let matrix = packet[2];
            let listLineWinData = packet[3];
            let winNormalValue = packet[4];
            let numberBonusSpin = packet[5];
            let winBonusValue = packet[6];
            let freeSpinLeft = packet[7];
            let valueFreeSpin = packet[8];
            let totalWin = packet[9];
            let accountBalance = 0;
            let currentJackpotValue = packet[12];
            let isTakeJackpot = packet[13];
            let extendMatrixDescription = packet[14]; 
            if(this.cacheFreeSpin == 0)
                this.cacheFreeSpin = freeSpinLeft
            else
                this.cacheFreeSpin -= 1;
            //fake chơi thử k có số dư nên tự cộng trừ tiền
            accountBalance = require("WalletController").getIns().GetBalance() - 200000 + totalWin;
            this.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, this.cacheFreeSpin, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription);
        },
        /*---------------------------------*/

        /*
        xử lý logic sau khi nhận từ server
        */
        OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotModel, lastPrizeValue, lineData, isNotSelectFreeTurnType) {
            this.lineData = lineData;
            this.UpdateBetValue(totalBetValue);
            require("WalletController").getIns().UpdateWallet(accountBalance);
            //set ui các giá trị của lần chơi trước
            this.OnUpdateMoney(accountBalance);
            this.slotMenu.UpdateTotalBetValue(totalBetValue);
            this.slotMenu.UpdateJackpotValue(jackpotModel);
            this.slotMenu.SetLastPrizeValue(lastPrizeValue);
            // this.slotMenu.SetLineData(lineData); //-> server trả về sai là 50
            this.HideLineWinData();
            //turn trước khi thoát được free hay không thì hiển thị tiếp UI
            if(isNotSelectFreeTurnType){
                this.HandleFree(1);
            }else{
                if(this.CheckFreeSpin(freeSpin)){
                    //schedule show effect, change BG
                    //Nếu có schedule thì sẽ đợi xong effect mới call DoWork
                    //show UI free
                    this.isFree = true;
                    this.ShowFree(numberFree);
                    this.slotMenu.GetTotalWinCache();
                    this.toDoList.DoWork();
                }else{
                    this.toDoList.DoWork();
                }
            }
        },
        
        OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, currentJackpotModel, isTakeJackpot, extendMatrixDescription) {
            if(isTakeJackpot)
                winNormalValue = totalWin;
            this.UpdateMatrix(this.ParseMatrix(matrix), false);
            //màn bonus chia ra tiền nhận sau khi diễn, nên cộng số dư ăn line trước
            let mAccountBalance = accountBalance;
            if(this.isBonus)
                mAccountBalance = accountBalance-winBonusValue;
            //add cache tiền thắng
            this.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
            let listLine = this.ParseLineData(listLineWinData);

            //Khởi tạo list action chạy lần lượt
            this.toDoList.CreateList();
            this.toDoList.AddWork(()=>this.OnGetResult(),true);//-- chờ check chạy xong effect cột, các cột chạy xong sẽ call OnSpinDone() trong SlotUI
            this.toDoList.AddWork(()=>this.CheckEndAnimNearWin(freeSpinLeft, 0),true);
            if(listLine.length != 0){
                this.toDoList.AddWork(()=>{
                    this.UpdateLineWinData(listLine);
                },false);
                this.toDoList.Wait(0.5);
            }
            this.toDoList.AddWork(()=>{
                this.slotMenu.UpdateSessionID(spinId);
                this.slotMenu.UpdateJackpotValue(currentJackpotModel);
            },false);
            // check có free k show turn free, k có thì check bonus
            if(this.CheckFreeSpin(freeSpinLeft)){
                //show tiền thắng
                if(!this.isFree){
                    this.toDoList.AddWork(()=> this.slotUI.ShowLineFree(),false);
                    this.toDoList.Wait(0.5);
                }
                this.toDoList.AddWork(()=> this.HandleFree(freeSpinLeft),true);
                this.toDoList.AddWork(()=> this.UpdateMoneyResult(winNormalValue, isTakeJackpot, false),true);
            }else{
                if(this.CheckBonus(extendMatrixDescription)){
                    this.toDoList.AddWork(()=> this.slotUI.ShowLineBonus(),false);
                    this.toDoList.Wait(0.5);
                    this.toDoList.AddWork(()=> this.ShowStartBonus((totalWin - winNormalValue), extendMatrixDescription),true);  
                }
                //show tiền thắng
                this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, isTakeJackpot, false),true);
            }
            //check end free và show total thắng trong lượt free
            if(this.isFree){
                this.toDoList.AddWork(()=>this.CheckEndFree(freeSpinLeft, totalWin),true);
            }
            this.toDoList.AddWork(()=>{
                // lấy số dư tài khoản đã cache
                require("WalletController").getIns().TakeBalance(this.getGameId())
                this.ActiveButtonMenu();
                this.ActionAutoSpin();   //check auto thì send turn tiếp
            },false);
            this.toDoList.Play();
        },
        /*---------------------------------*/

        OnUpdateLastMatrix(lastMatrix) {
            if(lastMatrix.length != 0) {
                let matrix = this.ParseMatrix(lastMatrix);
                this.UpdateMatrix(matrix, true);
            }
        },

        UpdateMatrix(matrix, isSetDefaut = false) {
            this.cacheMatrix = matrix;
            this.slotUI.OnCheckUpdateMatrix(isSetDefaut);
        },

        OnGetResult() {
            this.isgetResult = true;
            this.slotUI.OnCheckSpinSuccess();
        },

        //check lượt free của turn vừa nhận
        CheckFreeSpin(numberFree) {
            //turn cuối cùng trả về = 0
            if(this.isFree)
                return true
            return numberFree > 0;
        },
        //check xem turn này ăn bonus hay không
        CheckBonus(extendMatrixDescription){
            if(extendMatrixDescription === '[]' || extendMatrixDescription === ''){
                return false;
            }else{
                return true;
            }
        },

        ShowStartBonus(winBonusValue,extendMatrixDescription){
            let matrixStr = extendMatrixDescription.split(",");
            let listBonus = [];
            for(let i = 0; i < matrixStr.length; i++) {
                listBonus[i] = parseInt(matrixStr[i]);
            }
            let seft = this;
            this.slotEffect.ShowBonusGame(listBonus, winBonusValue, () => {
                //seft.toDoList.DoWork();
                //show effect thắng lớn số tiền bonus
                seft.UpdateMoneyResult(winBonusValue, false);
            });
        },

        //xóa các effect turn cũ khi bắt đầu quay turn mới
        ResetUINewTurn(){
            this.HideLineWinData();
        },

        HandleFree(freeSpinLeft){
            cc.log(" HandleFree "+freeSpinLeft);
            // ssoo lượt free > 0 mà chưa đôi isFree -> Mới nhận được free
            if(freeSpinLeft > 0 && !this.isFree) {
                //save số lượt
                this.slotMenu.ClearTotalWinFreeCache();
                //chờ show effect start free
                this.slotSound.PlayAudioFreeSpin();
                this.slotEffect.ShowEffectSelectFree();
                return;
            }
            this.ShowFree(freeSpinLeft);
        },

        ShowFree(freeSpinLeft){
            cc.log(" ShowFree "+freeSpinLeft);
            //set bg free
            this.slotUI.ShowBgGameFree(true);
            this.slotMenu.ShowBoxTurnFree(true);
            this.slotMenu.SetTextFree(freeSpinLeft);
            this.isFree = true;
            this.toDoList.DoWork();
        },
        
        CheckEndFree(freeSpinLeft){
            if(freeSpinLeft == 0){
                let seft = this;
                this.isFree = false;
                this.slotUI.ShowBgGameFree(false);
                this.slotMenu.ShowBoxTurnFree(false);
                let totalWinFree = this.slotMenu.ClearTotalWinFreeCache();
                let type = this.GetTypeBigWinByValue(totalWinFree);
                this.slotEffect.ShowBigWin(totalWinFree, type, () => {
                    seft.toDoList.DoWork();
                });
            }
            else
                this.toDoList.DoWork();
        },
        
        UpdateMoneyResult(winValue) {
            let seft = this;
            if(winValue > 0) {
                let isBigWin = this.CheckBigWin(winValue);
                if(!isBigWin) {
                    this.slotSound.PlayAudioWinMoney();
                    this.ShowUpdateWinValueMenu(winValue);
                } else {
                    let type = this.GetTypeBigWinByValue(winValue);
                    this.slotSound.PlayAudioBigWin();
                    this.slotEffect.ShowBigWin(winValue, type, () => {
                        seft.ShowUpdateWinValueMenu(winValue);
                    });
                }
            } else {
                //không ăn giải, bỏ qua show kết quả continues
                this.slotMenu.UpdateWinValue(0);
                this.scheduleOnce(()=>{
                    this.toDoList.DoWork();
                } , 0.4);
            } 
        },

        GetTypeBigWinByValue(value){
            let type = 1;
            if(value > 30*this.GetBetValue)
                type = 3;
            else if(value > 6*this.GetBetValue)
                type = 2;
            return type;
        },
        
        ShowUpdateWinValueMenu(value){
            if(!this.isFree)
                this.slotMenu.UpdateWinValue(value);
            else
                this.slotMenu.UpdateWinFree(value);
            this.scheduleOnce(()=>{
                this.toDoList.DoWork();
            } , 1.2);
        },

        /*
        Xử lý giải mã matrix và extend đặc biệt
        */
        ParseMatrix(matrixData) {
            let matrixString = matrixData.split("|");
            let matrixStr = matrixString[0].split(",");
            let matrix = [];
            this.cacheMulti = [];
            for(let i = 0; i < matrixStr.length; i++) {
                var item = matrixStr[i].split(".");
                matrix[i] = parseInt(item[0]);
                if(item[1])
                    this.cacheMulti[i] =  parseInt(item[1]);
                else
                    this.cacheMulti[i] = 1;
            }
            return matrix;
        },

        ParseExtendMatrix(matrixData) {
            let matrixString = matrixData.split("|");
            return parseInt(matrixString[1]);
        },
    
        ParseLineData(lineWinData) {
            let lineStr = lineWinData.split(",");
            let result = [];
            if(lineWinData === "")
                return result;
            for(let i = 0; i < lineStr.length; i++) {
                result[i] = parseInt(lineStr[i]);
            }
            return result;
        },
        /*-------------------------------*/

        /*
        EFFECT
        */
        CheckBigWin(winMoney, mutil = 6) {
            let isBigWin = false;
            if(winMoney >= this.GetBetValue() * mutil) 
                isBigWin = true;
            return isBigWin;
        },
        /*-------------------------------*/

        SpeedSpin(isSpeed) {
            this.isSpeed = isSpeed;
        },

        GetIsSpeed(){
            return this.isSpeed;
        },
   
        AutoSpin(isAuto) {
            this.isAuto = isAuto;
            if(!this.isAuto)
                this.countAuto = 0;
            if(this.isAuto && this.activeButton) {
                this.ActionAutoSpin();
            }
        },

        /*
        STACK CACHE RESULT SPIN
        */
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
        /*-------------------------------*/

        /* AUDIO */
        PlayClick(){
            this.slotSound.PlayAudioClick();
        },
        /*-------------------------------*/
    });
