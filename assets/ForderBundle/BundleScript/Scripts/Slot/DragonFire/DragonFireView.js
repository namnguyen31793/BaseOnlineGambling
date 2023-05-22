

cc.Class({
    extends: require("SlotView"),

    ctor(){
        this.isClick = false;
    },

    Init() {
        this.slotType = Global.Enum.GAME_TYPE.EXTEND_COLUMNS;
        this.lineData = 50;
    },

    CallRequestGetJackpotInfo() {
        this.netWork.RequestGetJackpotInfo(this.gameType);
    },

    OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix) {
        this.lineData = lineData;
        this.menuView.UpdateBetValue(totalBetValue);
        this.normalManager.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData, extandMatrix);
    },

    OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn, freeSpinLeft, totalWin, accountBalance, currentJackpotValue, isTakeJackpot, extendMatrixDescription) {
        this.normalManager.OnGetSpinResult(spinId, matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
            currentJackpotValue, isTakeJackpot, extendMatrixDescription);
    },

    OnSpinDone() {
        this.normalManager.CheckBonus();
    },

    //sua ham auto
    ActionAutoSpin() {
        if(this.CheckShowFreeAds()){
            return;
        }
        if(!this.isSpin && this.isAuto) {
            if(this.isClick)
                return;
            this.isClick = true;
            let timeDelay = 0;
            if(this.normalManager.isNewColum || this.normalManager.isResetColum){
                timeDelay = 0.5;
            } 
            this.effectManager.ClickCloseNotify(false);
            this.effectManager.ClickCloseFree();
            this.effectManager.ClickCloseBonus();
            this.bonusManager.isCheckAuto = false;
            
            if((this.normalManager.isResetColum ) || (this.normalManager.extandMatrixNextTurn == 3 && this.isFree)){
                this.drawLineManager.StopDrawDragon();
            }
            this.normalManager.ScrollContentSpin(this.normalManager.extandMatrixNextTurn);
            this.scheduleOnce(()=>{
                if(this.normalManager.isNewColum || (this.normalManager.extandMatrixNextTurn > 3 && this.isFree))
                    this.normalManager.animWaitColum.play("WaitColumAnim");
                this.HandleSendAuto();
            }, timeDelay);
        }
    },

    HandleSendAuto(){
        this.isClick = false;
        let packet = this.GetStack();
        let isRequest = true;
        this.RequestSpin(isRequest);
        if(packet) {
            this.netWork.ProceduGetResult(packet);
        }
    },

    ClickSpin(){
        if(this.isClick)
            return;
        this.isClick = true;
        let timeDelay = 0;
        if(this.normalManager.isNewColum || this.normalManager.isResetColum){
            timeDelay = 0.5;
        } 
        //xoa effect line khi khong sinh cot moi hoac khong reset colum o man Free hoac chieu dai cot bang 3 start free
        if((this.normalManager.isResetColum ) || (this.normalManager.extandMatrixNextTurn == 3 && this.isFree)){
            this.drawLineManager.StopDrawDragon();
        }
        this.normalManager.ScrollContentSpin(this.normalManager.extandMatrixNextTurn);
        this.scheduleOnce(()=>{
            if(this.normalManager.isNewColum || (this.normalManager.extandMatrixNextTurn > 3 && this.isFree))
                this.normalManager.animWaitColum.play("WaitColumAnim");
            this.RequestSpin();
        }, timeDelay);
    },

    RequestSpin(isRequest) {
        this._super(isRequest);
        this.normalManager.ResetUINewTurn();
        this.isClick = false;
        this.UpdateNumberWay(0);
    },

    CheckBonus(bonusValue, total, accountBalance, bonusTurn) {
        if(bonusValue > 0) {
            if(this.isBonus) {
                this.bonusManager.EndBonus(bonusValue, accountBalance);
            } else {
                this.isBonus = true;
                this.PlayBonusStart();
                this.bonusManager.ShowBonusGame(bonusTurn);
            }
        } else {
            if(this.isBonus) {
                this.bonusManager.CheckBonus(bonusTurn);
            } else {
                this.scheduleOnce(()=>{
                    this.toDoList.DoWork();
                } , 1);
            }
            this.normalManager.CheckBonus();
        }
    },

    SetFreeSpin(numberFree, isNotify = false, lineWin, winNormalValue, totalWin, idCheckFree) {
        this.freeManager.ShowFree(numberFree, isNotify, lineWin, winNormalValue, totalWin, idCheckFree);
    },

    UpdateMatrix(matrix) {
        this.spinManager.UpdateMatrix(matrix);
    },

    HideWildFree(){
        this.spinManager.HideWildFree();
    },
    
    ActiveColorButtonNormalGame(isActive = true){
        this.itemManager.ActiveColorButtonNormalGame(isActive);
    },
    
    EndAnimPreWin(freeTurn, bonusTurn) {
        if(!this.isFree && !this.isBonus) {
            if(freeTurn > 0 || bonusTurn > 0) {
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

    OnUpdateLastMatrix(lastMatrix, extandMatrix, lastPrizeValue, freeSpin) {
        //turn truoc thoat co chieu dai khac 0 la van win
        if(lastMatrix.length != 0) {
            let matrix = this.normalManager.ParseMatrix(lastMatrix);
            this.spinManager.UpdateMatrix(matrix, true);
        }
        let columExtend = this.normalManager.ParseLengthColum(extandMatrix);
        if(freeSpin > 0){
            let check ='2'; //check co item free khong thi la turn dau tien free
            let check2 ='.2';//check không co item cộng 2 lượt free
            if(lastMatrix.indexOf(check) !== -1 && lastMatrix.indexOf(check2) === -1){
                this.ChangeExtandMatrixNextTurn(3);
            }else if(lastPrizeValue > 0){
                this.ChangeExtandMatrixNextTurn(columExtend+1);
            }else{
                this.ChangeExtandMatrixNextTurn(columExtend);
            }
        }else{
            if(lastMatrix.length != 0) {
                this.ChangeExtandMatrixNextTurn(columExtend+1);
            }else{
                this.ChangeExtandMatrixNextTurn(3);
            }
        }
        this.normalManager.ScrollContentSpin(this.normalManager.extandMatrixNextTurn);
    },

    PlayAnimPullCurtain(){
        this.effectManager.PlayAnimPullCurtain();
    },

    SetTypeJackpot(type){
        this.effectManager.SetTypeJackpot(type);
    },

    ShowNotifyWinFree(num){
        this.effectManager.ShowNotifyWinFree(num);
    },

    HideNotifyWinFree(){
        this.effectManager.HideNotifyWinFree();
        this.normalManager.ResetUINewTurn();
    },

    UpdateNumberFree(num){
        this.freeManager.UpdateNumberFree(num);
    },

    ClearWildEndFree(){
        this.normalManager.ClearWildEndFree();
    },

    ChangeExtandMatrixNextTurn(num){
        this.normalManager.extandMatrixNextTurn = num;
    },

    ShowExtra(pos, value){
        this.spinManager.ShowExtra(pos, value);
    },

    ResetFree(){
        this.ChangeExtandMatrixNextTurn(3);
        this.normalManager.isResetColum = true;
    },

    UpdateNumberWay(num){
        this.menuView.UpdateNumberWay(num);
    },

    playTakeExtraFree(){
        this.soundControl.PlayTakeExtraFree();
    },

    PlayFreeEnd(){
        this.soundControl.PlayFreeEnd();
    },

    CheckShowFreeAds() {

    },
});
