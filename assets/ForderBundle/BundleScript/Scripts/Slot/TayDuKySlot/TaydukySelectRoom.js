cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
    },

    properties: {
        jackpotRoom1 : cc.Label,
        jackpotRoom2 : cc.Label,
        jackpotRoom3 : cc.Label,
        nodeTry : cc.Node,
    },
    
    Init(slotView) {
        this.slotView = slotView;
        this.ShowSelectRoom();
    },


    SelectRoom(event, index){
        this.slotView.PlayClick();
        this.slotView.roomID = index;
        if(this.slotView.roomID != 0){
            // this.UpdateBetValue();
            this.slotView.RequestGetAccountInfo();
            this.slotView.RequestGetJackpotInfo();
            this.nodeTry.active = false;
        }else{
            //fake info mode try
            this.SetAccountInfoTry();
            this.nodeTry.active = true;
        }
        this.node.active = false;
    },

    SetAccountInfoTry(){
        let accountBalance = 79797979;
        let totalBetValue = 200000;
        let jackpotValue = 210000000 +Global.RandomNumber(4, 9)*100000+Global.RandomNumber(1, 9)*10000+Global.RandomNumber(1, 8)*10000;
        let lineData = '';
        let lastPrizeValue = 0;
        let freeSpin = 0;
        let isTakeFreeSpin = false;
        let bonusCounter = 0;
        let isBonusTurn = false;
        let lastMatrix = '';

        let toDoList = this.slotView.toDoList;
        toDoList.CreateList();
        toDoList.AddWork(()=>{
            this.slotView.DeActiveButtonMenu();  
        }, false);
        toDoList.AddWork(()=>{
            this.slotView.OnGetAccountInfo(accountBalance, freeSpin, totalBetValue, jackpotValue, lastPrizeValue, lineData);
        }, true);
        toDoList.AddWork(()=>{
            this.slotView.OnUpdateLastMatrix(lastMatrix);
        }, false);
        toDoList.AddWork(()=>{
            this.slotView.OnCheckLastTurnBonus(bonusCounter, isBonusTurn);
        }, true);
        toDoList.AddWork(()=>this.slotView.ShowCommandUseItemBonusTurn(this.slotView.toDoList),true);
        toDoList.AddWork(()=>this.slotView.ActiveButtonMenu(),false);
        toDoList.AddWork(()=>this.slotView.CheckStateAuto(),false);
        toDoList.Play();
    },

    ShowSelectRoom(){
        this.node.active = true;
        ApiController.RequestGetJackpotLobby( 1, 33, (data) => {
            if(data == "null" || data == ""){
            }else{
                this.jackpotRoom1.string = Global.Helper.formatNumber(parseInt(data));;
            }
        }, this.ErrorCallBack);
        ApiController.RequestGetJackpotLobby( 2, 33, (data) => {
            if(data == "null" || data == ""){
            }else{
                this.jackpotRoom2.string = Global.Helper.formatNumber(parseInt(data));;
            }
        }, this.ErrorCallBack);
        ApiController.RequestGetJackpotLobby( 3, 33, (data) => {
            if(data == "null" || data == ""){
            }else{
                this.jackpotRoom3.string = Global.Helper.formatNumber(parseInt(data));;
            }
        }, this.ErrorCallBack);
    },

    QuitGame(){
        this.slotView.RequestLeaveRoom();
        require("ScreenManager").getIns().LoadScene(Global.Enum.SCREEN_CODE.LOBBY);
    },

    ErrorCallBack(errorCode, message) {
    },
});
