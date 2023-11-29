/**
 * Created on 25/10/2023.
 * khi khởi tạo ở InfullGame, add refrence vào lắng nghe server theo gameId
 * khi destroy xóa lăng nghe
 */
cc.Class({
    "extends": cc.Component,
    ctor(){
        this.gameId = 0;
        this.toDoList = null;
    },
    properties: {
        nodeRoom: cc.Node,
        slotUI: require('SlotUI'),
        slotMenu: require('SlotMenu'),
        slotEffect: require('SlotEffect'),
        slotSound: require('SlotSound'),
    },

    onLoad: function () {
        cc.log("onLoad 1")
        //bien check active button room chua
        this.isActiveButtonRoom = false;
        this.toDoList = this.node.addComponent("ToDoList");
        
        //add lang nghe vi tien
        require("WalletController").getIns().init(true);
        require("WalletController").getIns().AddListener(this);
        //Init cac thanh phan
        if(this.slotUI)
            this.slotUI.Init(this);
        if(this.slotMenu)
            this.slotMenu.Init(this);
        if(this.slotEffect)
            this.slotEffect.Init(this);
        if(this.slotSound)
            this.slotSound.Init();
        //get config room vaf lenh open game
        let msg = {};
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.GET_ROOM_INFO, msg);
    },

    ChangeStateMusic(state) {
        this.slotSound.ChangeStateMusic(state);
    },

    ChangeStateSound(state) {
        this.slotSound.ChangeStateSound(state);
    },

    //callserver bao open game và lấy thông tin cược lần trước
    CallRequestGetInfo() {
        Global.UIManager.showMiniLoading();
        let msg = {};
        msg[1] = this.getRoomId();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.GET_ACCOUNT_INFO, msg);
    },

    //job call get jackpot
    CallRequestGetJackpotInfo() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.GET_JACKPOT, msg);
        this.schedule(() => {
            this.sendRequestOnHub(cc.MethodHubName.GET_JACKPOT, msg);
        }, 15);
    },

    //callserver bao open game và lấy thông tin cược lần trước
    CallRequestBuyFree() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = this.getLineData ();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.BUY_FREE, msg);
    },
    
    CallRequestSpin() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = this.getLineData ();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.SPIN, msg);
    },
    
    CallRequestSpinTry() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = this.getLineData ();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.SPIN_TRY, msg);
    },
    
    CallSelectRooomFree(freespinType) {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[2] = freespinType;
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.SELECT_INPUT_FREE, msg);
    },

    CallLeaveGame() {
        let msg = {};
        msg[1] = this.getRoomId();
        msg[20] = this.getGameId();
        msg[40] = this.getGameId();
        this.sendRequestOnHub(cc.MethodHubName.LEAVE, msg);
    },

    sendRequestOnHub: function (method, data) {
        cc.log("sendRequestOnHub "+method)
        cc.log(data)
        switch (method) {
            case cc.MethodHubName.GET_ROOM_INFO:
                //fake join same tay du
                require("SendRequest").getIns().MST_Client_Slot_Get_Room_Config(data);
                break;
            case cc.MethodHubName.SPIN:
                require("SendRequest").getIns().MST_Client_Slot_Spin(data);
                break;
            case cc.MethodHubName.SPIN_TRY:
                require("SendRequest").getIns().MST_Client_Slot_Spin_Try(data);
                break;
            case cc.MethodHubName.BUY_FREE:
                require("SendRequest").getIns().MST_Client_Slot_Buy_Free(data);
                break;
            case cc.MethodHubName.GET_ACCOUNT_INFO:
                //send get accountInfo
                require("SendRequest").getIns().MST_Client_Slot_Open_Game(data);
                require("SendRequest").getIns().MST_Client_Slot_Get_Account_Info(data);
                break;
            case cc.MethodHubName.GET_JACKPOT:
                require("SendRequest").getIns().MST_Client_Slot_Get_Jackpot_Info(data);
                break;
            case cc.MethodHubName.LEAVE:
                require("SendRequest").getIns().MST_Client_Slot_Leave_Room(data);
                break;
            case cc.MethodHubName.SELECT_INPUT_FREE:
                require("SendRequest").getIns().MST_Client_Slot_Select_Type_Free(data);
                break;
        }
    },

    //khai báo lắng nghe phản hồi từ server
    ResponseServer(code, packet){

    },

    //lắng nghe call dổi room hoặc mới vào game
    SelectRoom(roomId) {
        this.setRoomId(roomId);
        if (roomId === 0) {
            //this.sendRequestOnHub(cc.MethodHubName.JOIN_TRY);
        } else {
            this.setRoomId(roomId);
            this.CallRequestGetJackpotInfo();
            this.CallRequestGetInfo();
        }
    },

    LeaveRoom(){
        this.unscheduleAllCallbacks();
    },

    //lang nghe wallet thay đổi số dư
    OnUpdateMoney(gold) {
        //this.menuView.UpdateMoney(gold);
    },
    
    setRoomId (roomId) {
        return this.roomId = roomId;
    },
    //set khi load game trong infullgame
    setGameId (gameId) {
        cc.log("setGameId "+gameId)
        return this.gameId = gameId;
    },

    setLineData (lineData) {
        return this.linedata = lineData;
    },

    getRoomId () {
        return this.roomId;
    },

    getGameId () {
        return this.gameId;
    },

    getLineData () {
        return this.linedata;
    },
});
