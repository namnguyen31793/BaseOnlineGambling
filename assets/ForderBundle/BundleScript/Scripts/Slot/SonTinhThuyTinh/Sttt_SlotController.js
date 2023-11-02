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

            this.TIME_SPIN = 0.2;
            this.TIME_DISTANCE_COLUMN = 0.25;
            this.NUMBER_LINE = 20;
            this.stackSpin = [];
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
                    this.netWork.ProceduGetResult(packet);
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
            //this.soundControl.PlaySpin();
            this.slotEffect.Clear();
            this.PlayEffectSpin();
            
            if(!this.isFree && !this.isBonus)
                this.slotMenu.ResetValueCacheWin();
    
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
            
            this.scheduleOnce(()=>{
                this.slotUI.OnCheckSpinSuccess();
                this.slotUI.OnCheckUpdateMatrix();
            } , timeSpin);
            this.slotUI.PlaySpinColumn(timeDistanceColumn);
            //this.soundControl.PlaySpinStart();
        },

        GetIsSpeed(){
            return this.slotMenu.isSpeed;
        },

        CheckEndAnimPreWin(freeTurn, bonusTurn) {
            cc.log("CheckEndAnimPreWin "+freeTurn);
            if(!this.isFree && !this.isBonus) {
                if((freeTurn > 0 || bonusTurn > 0) && this.slotUI.CheckPreWin()) {
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
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_GET_ACCOUNT_INFO:
                    this.GetAccountInfo(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_JACKPOT_INFO:
                    this.GetJackpotInfo(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_SPIN:
                    this.ProceduGetResult(packet);
                    break;
                case Global.Enum.RESPONSE_CODE.MSG_SERVER_TAY_DU_KY_GAME_SPIN_CHOI_THU:
                    this.ProceduGetResultTry(packet);
                    break;
            }
        },

        GetAccountInfo(packet) {
            Global.UIManager.hideMiniLoading();
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
    
            this.DeActiveButtonMenu();
            this.toDoList.CreateList();
            this.toDoList.AddWork(()=>{
                //todolist true đợi diễn effect show free nếu đang chơi dở lần trước
                this.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData);
            }, true);
            this.toDoList.AddWork(()=>{
                this.OnUpdateLastMatrix(lastMatrix);
                this.ActiveButtonMenu();
                this.CheckStateAuto();
            }, false);
            this.toDoList.Play();
        },

        GetJackpotInfo(packet) {
            let listJackpot = [];
            listJackpot[0] = packet[1];
            listJackpot[1] = packet[2];
            listJackpot[2] = packet[3];
            this.slotMenu.OnGetJackpotValue(listJackpot);
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
            let currentJackpotValue = packet[12];
            let isTakeJackpot = packet[13];
            let extendMatrixDescription = packet[14];
    
            this.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue,freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription);
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
        OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData) {
            this.lineData = lineData;
            this.UpdateBetValue(totalBetValue);
            require("WalletController").getIns().UpdateWallet(accountBalance);
            //set ui các giá trị của lần chơi trước
            this.OnUpdateMoney(accountBalance);
            this.slotUI.RemoveExpandWild();
            this.slotMenu.UpdateTotalBetValue(totalBetValue);
            this.slotMenu.UpdateJackpotValue(jackpotValue);
            this.slotMenu.SetLastPrizeValue(lastPrizeValue);
            // this.slotMenu.SetLineData(lineData); //-> server trả về sai là 50
            this.HideLineWinData();
            //turn trước khi thoát được free hay không thì hiển thị tiếp UI
            if(this.CheckFreeSpin(freeSpin)){
                //schedule show effect, change BG
                //Nếu có schedule thì sẽ đợi xong effect mới call DoWork
                //show UI free
                this.isFree = true;
                this.slotMenu.SetTextFree(numberFree);//------------
                this.slotMenu.GetTotalWinCache();
                this.toDoList.DoWork();
            }else{
                this.toDoList.DoWork();
            }
        },
        
        OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
            if(isTakeJackpot)
                winNormalValue = totalWin;
            //add cache tiền thắng
            require("WalletController").getIns().PushBalance(this.getGameId(), this.GetBetValue(), totalWin, accountBalance);
            this.UpdateMatrix(this.ParseMatrix(matrix), false);
            //màn bonus chia ra tiền nhận sau khi diễn, nên cộng số dư ăn line trước
            let mAccountBalance = accountBalance;
            if(this.isBonus)
                mAccountBalance = accountBalance-winBonusValue;
            this.UpdateMoneyNormalGame(winNormalValue, mAccountBalance);
            let listLine = this.ParseLineData(listLineWinData);

            //Khởi tạo list action chạy lần lượt
            this.toDoList.CreateList();
            this.toDoList.AddWork(()=>this.OnGetResult(),true);//-- chờ check chạy xong effect cột, các cột chạy xong sẽ call OnSpinDone() trong SlotUI
            this.toDoList.AddWork(()=>this.CheckEndAnimPreWin(freeSpinLeft, 0),true);
            if(listLine.length != 0){
                this.toDoList.AddWork(()=>{
                    this.UpdateLineWinData(listLine);
                },false);
            }
            this.toDoList.AddWork(()=>{
                this.slotMenu.UpdateSessionID(spinId);
                this.slotMenu.UpdateJackpotValue(currentJackpotValue);
            },false);
            // check có free k show turn free, k có thì check bonus
            if(this.CheckFreeSpin(freeSpinLeft)){
                this.toDoList.AddWork(()=> this.HandleFree(freeSpinLeft),true);
            }else{
                if(this.CheckBonus(extendMatrixDescription)){
                    this.toDoList.AddWork(()=>this.ShowStartBonus(winBonusValue, extendMatrixDescription),true);  
                }
            }
            //show tiền thắng
            this.toDoList.AddWork(()=>this.UpdateMoneyResult(winNormalValue, isTakeJackpot, false),true);
            //check end free và show total thắng trong lượt free
            if(this.isFree){
                this.toDoList.AddWork(()=>this.CheckEndFree(freeSpinLeft, totalWin),true);
            }
            this.toDoList.AddWork(()=>{
                // lấy số dư tài khoản đã cache
                require("WalletController").getIns().TakeBalance(this.getGameId())
                this.HideLineWinData();
                this.ActiveButtonMenu();
                this.ActionAutoSpin();   //check auto thì send turn tiếp
            },false);
            this.toDoList.Play();
        },
        /*---------------------------------*/

        OnUpdateLastMatrix(lastMatrix) {
            if(lastMatrix.length != 0) {
                let matrix = this.ParseMatrix(lastMatrix);
                let extendMatrix = this.ParseExtendMatrix(lastMatrix);
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
            let listBonus =  JSON.parse(extendMatrixDescription);
            //show effect start()
            let seft = this;
            this.slotEffect.ShowEffectStartBonus( () => {
                seft.ShowBonusGame(listBonus, winBonusValue);
            });
        },

        ShowBonusGame(listBonus, bonusValue){
            let seft = this;
            this.slotEffect.ShowBonusGame(listBonus, bonusValue, () => {
                //seft.toDoList.DoWork();
                //show effect thắng lớn số tiền bonus
                seft.UpdateMoneyResult(bonusValue, false);
            });
        },

        //xóa các effect turn cũ khi bắt đầu quay turn mới
        ResetUINewTurn(){
            this.slotUI.RemoveExpandWild();
        },

        HandleFree(freeSpinLeft){
            cc.log(" HandleFree "+freeSpinLeft);
            // ssoo lượt free > 0 mà chưa đôi isFree -> Mới nhận được free
            if(freeSpinLeft > 0 && !this.isFree) {
                //save số lượt
                this.slotMenu.ClearTotalWinFreeCache();
                //chờ show effect start free
                let seft = this;
                this.slotEffect.ShowEffectStartFree(numberFree, () => {
                    seft.ShowFree(freeSpinLeft);
                });
                return;
            }
            this.ShowFree(freeSpinLeft);
        },

        ShowFree(freeSpinLeft){
            this.slotMenu.SetTextFree(freeSpinLeft);
            this.isFree = true;
            this.toDoList.DoWork(); //chạy tiếp todoList sau khi set free
        },
        
        CheckEndFree(freeSpinLeft, totalWin){
            this.slotMenu.UpdateWinFree(totalWin);
            let totalWinFree = this.ClearTotalWinFreeCache();
            if(freeSpinLeft == 0)
                this.slotEffect.ShowEffectEndFree(totalWinFree, () => {
                    seft.toDoList.DoWork();
                });
            else
                this.toDoList.DoWork();
        },
        
        UpdateMoneyResult(winValue, isTakeJackpot) {
            let seft = this;
            if(!isTakeJackpot) {
                if(winValue > 0) {
                    let isBigWin = this.CheckBigWin(winValue);
                    if(!isBigWin) {
                        //this.soundControl.PlayWinMoney();
                        this.ShowUpdateWinValueMenu(winValue);
                    } else {
                        //this.soundControl.PlayBigWin();
                        this.slotEffect.ShowBigWin(winValue, () => {
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
            }else{
                //this.soundControl.PlayJackpot();
                this.slotEffect.ShowJackpot(winValue,  () => {
                    seft.ShowUpdateWinValueMenu(winValue);
                });
            }  
        },
        
        ShowUpdateWinValueMenu(value){
            this.slotMenu.UpdateWinValue(value);
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
            this.posData = [];
            for(let i = 0; i < matrixStr.length; i++) {
                matrix[i] = parseInt(matrixStr[i]);
                //id 2 la wild doc, chi xuat hien cot 2 va 4
                if((i == 1 || i == 3) && matrix[i] == 2){
                    cc.log("ParseMatrix  posData "+i)
                    this.posData.push(i);
                }
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
            if(winMoney >= this.totalBetValue * mutil) 
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
    });
