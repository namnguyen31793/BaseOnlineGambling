// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        lbiLastWin: cc.LabelIncrement,
        lbiX2: cc.LabelIncrement,

        btnClose: cc.Button,

        ItemArray: {
            default: [],
            type:  require("ThanTai_X2_SelectItem")
        },

        SelectBagContent : cc.Node,
        NextButtonContent  : cc.Node,
        StopBtn : cc.Node ,
        HuongDan_Panel : cc.Node  
    },

   onEnable()
   {
       this.X2GameView_Setup();
       this.NextButtonContent.active = false;
       this.StopBtn.active = true;
       this.HuongDan_Panel.active = false;
   },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       require("X2GameController").getIns().setX2GameView(this);    
     },
     X2GameView_Setup()
     {
        let baseValue =  require("X2GameController").getIns().getBaseValue();
        this.lbiLastWin.setValue(baseValue);
        let nextWinValue = baseValue * 1.98;
        this.lbiX2.setValue(nextWinValue);
     },

    onClick_SelectItem(event,index)
    {
        let lastReward =  require("X2GameController").getIns().getBaseValue();
        if(lastReward <= 0)
            return;
        var ID = parseInt(index);
        let msg = {};
        msg[1] = lastReward;
        msg[2] = ID;
        msg[20] = require("ThanTaiSpinController").getIns().gameID;
        msg[40] = require("ThanTaiSpinController").getIns().gameID;
        Global.NetworkManager.sendRequest(Global.Enum.REQUEST_CODE.MSG_CLIENT_SLOT_SPIN_X2_GAME, msg, Global.Enum.NETWORK_TARGET_CODE.SLOT_MACHINE);
    },

    start () {

    },

    SetupRewardValue(packet)
    {
        let IsResult = packet[1];
        let boolArray = packet[2];
        let x2Reward = packet[3];
        let Current_Money = packet[4];
        let IsContunue = packet[5];
        let selectedID = packet[6];
        cc.log("selectedID: "+selectedID);
        let rewardValueArray = boolArray.map(jsonString => JSON.parse(jsonString));
        for(let i = 0;i< rewardValueArray.length;i++)
        {
            let isSelected = (selectedID == i);
            this.ItemArray[i].Handle_ShowReward(rewardValueArray[i],isSelected );
        }
       
        if(!IsResult)
            x2Reward = 0;

        require("X2GameController").getIns().setBaseValue(x2Reward);
        if(IsResult == false || IsContunue == false)
        {
            cc.log("IS FALSE");
            this.NextButtonContent.active = false;
            this.StopBtn.active = true;
        }
        else
        {
            cc.log("IS TRUE");
            this.X2GameView_Setup();
            this.NextButtonContent.active = true;
            this.StopBtn.active = false;
        }
          // update balance 
          require("BalanceController").getIns().updateRealBalance(Current_Money);
          require("BalanceController").getIns().updateBalance(Current_Money);
        

        
    },

    onClick_Close()
    {
        this.active = false;
        this.node.destroy();
    },

    onClick_NextTurn()
    {
        for(let i = 0;i< this.ItemArray.length;i++)
        {
            this.ItemArray[i].Handle_ResetUI();
        }
        this.NextButtonContent.active = false;
        this.StopBtn.active = true;
    },

    onClick_HuongDan()
    {
        this.HuongDan_Panel.active = true;
    },

    onClick_HuongDan_Close()
    {
        this.HuongDan_Panel.active = false;
    },


    onDestroy()
    {
        require("X2GameController").getIns().setX2GameView(null);
    },


    // update (dt) {},
});
