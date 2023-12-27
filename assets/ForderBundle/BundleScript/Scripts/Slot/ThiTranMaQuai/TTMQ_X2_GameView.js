// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.isClicked = false;
    },

    properties: {
        lbiLastWin: cc.LabelIncrement,
        lbiX2: cc.LabelIncrement,

        btnClose: cc.Button,

        ItemArray: {
            default: [],
            type:  require("TTMQ_X2_SelectItem")
        },

        SelectBagContent : cc.Node,
        NextButtonContent  : cc.Node,
        StopBtn : cc.Node ,
        HuongDan_Panel : cc.Node  ,

        CharactorSkeleton : sp.Skeleton,

        Tip_Lb : cc.Label,

    },

   onEnable()
   {
       this.X2GameView_Setup();
       this.NextButtonContent.active = false;
       this.StopBtn.active = true;
       this.HuongDan_Panel.active = false;
       this.CharactorSkeleton.node.active = false;
       this.Tip_Lb.string = "TRỘM 1 TRONG 4 NGÔI MỘ";
   },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
       require("X2GameController").getIns().setX2GameView(this);   
       this.spinController = require("SlotControllerFactory").getIns().GetCurrentSlotController(); 
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
        if(this.isClicked)
            return;
        this.isClicked = true;
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
       
       
        this.ItemArray[selectedID].Handle_ShowReward(rewardValueArray[selectedID],true );
       
       
        if(!IsResult)
        {
            x2Reward = 0;
            this.Tip_Lb.string = "UI!! CHỌN SAI RỒI";
            this.spinController.audioPool.play_BonusFall_Fx_Sound();
        }
        else
        {
            this.spinController.audioPool.play_BonusWin_Fx_Sound();
            this.Tip_Lb.string = "CHÚC MỪNG BẠN ĐÃ CHỌN TRÚNG KHO BÁU";
            this.ShowAnimation_WinCharactor();
        }

        require("X2GameController").getIns().setBaseValue(x2Reward);
        if(IsResult == false || IsContunue == false)
        {     
            this.NextButtonContent.active = false;  
            this.StopBtn.active = true;

            this.scheduleOnce(()=>{
               this.onClick_Close();
            }, 3);
        }
        else
        {
          
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
        this.isClicked = false;
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

    ShowAnimation_WinCharactor()
    {
        this.CharactorSkeleton.node.active = true;
      
        this.CharactorSkeleton.setCompleteListener((trackEntry) => {
            if (this.CharactorSkeleton.animation.name === 'X2_ChucMung') {
            
                this.CharactorSkeleton.node.active = false;
             }
        });
   
        this.CharactorSkeleton.setAnimation(0,'X2_ChucMung',false);
    },


    // update (dt) {},
});
