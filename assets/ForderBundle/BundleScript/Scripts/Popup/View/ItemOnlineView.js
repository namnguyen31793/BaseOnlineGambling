
cc.Class({
    extends: cc.Component,

    ctor(){
        this.timeCount = 0;
        this.isCheckTime = false;
        this.status = 0;
        this.deltaTime = 0;
        this.type = 0;
        this.isCheck = false;
    },

    properties: {
        timeLb : cc.Label,
        nodeNotify : cc.Node,
        isSpine : cc.Boolean,
        listSpriteItem :{
            default : [],
            type : cc.SpriteFrame,
        },
        imgItem : cc.Sprite,
        spineItem : sp.Skeleton,
        isCheckNumb : false,
    },

    start(){
        require("OnlineControl").getIns().GetStatus();
        this.scheduleOnce(()=>{
            require("OnlineControl").getIns().GetStatus();
        } , 5)
        if(this.isCheckNumb) {
            this.isCheck = true;
            Global.showLuckyBonus = false;
            require("SendRequest").getIns().MST_Client_Gift_Card_Get_Info();
        }
    },

    UpdateNumbOfScratch(numb) {
        if(numb > 0) {
            if(this.isCheck) {
                this.isCheck = false;
                Global.showLuckyBonus = true;
            }
            this.nodeNotify.active = true;
        } else {
            Global.showLuckyBonus = false;
            this.nodeNotify.active = false;
        }
    },

    ShowViewOnline (type, countTime) {
        this.resetUI();
        this.status = type;
        this.SetUIByType(type);
        if(type == 0){
            //end
        }else if(type == 1){
            this.timeLb.node.active = true;
            this.isCheckTime = true;
            this.timeCount = countTime;
            this.deltaTime = 0;
            this.UpdateViewCount(countTime);
        }else if(type == 2){
            this.timeLb.string = "";
            this.timeLb.node.active = true;
            this.nodeNotify.active = true;
        }
    },

    SetUIByType(type){
        this.type = type;
        if(this.isSpine){
            if(type == 0){
                this.spineItem.setSkin('online-hetqua');
            }else if(type == 1){
                this.spineItem.setSkin('online-demgio');
            }else if(type == 2){
                this.spineItem.setSkin('online-moqua');
            }
        }else{
            this.imgItem.spriteFrame = this.listSpriteItem[type];
        }
    },

    UpdateViewCount(count){
        if(count <= 0)
            this.isCheckTime = false;
        this.timeLb.string = this.TimeConvert(count);
    },

    TimeConvert(numb) {
		let minute = parseInt(numb / 60);
		let second = parseInt(numb - minute * 60);
		let strMinute = minute.toString();
		if(minute < 10) strMinute = "0"+minute;
		let strSecond = second.toString();
		if(second < 10) strSecond = "0"+second;
		return strMinute+":"+strSecond;
	},

    update (dt) {
        if(this.isCheckTime){
            this.deltaTime += dt;
            if(this.deltaTime >=1){
                this.deltaTime = 0;
                this.timeCount -= 1;
                this.UpdateViewCount(this.timeCount);
            }
            if(this.timeCount <= 0){
                require("OnlineControl").getIns().GetStatus();
            }
        }
    },

    resetUI(){
        this.isCheckTime = false;
        this.timeLb.string = "";
        this.timeLb.node.active = false;
        this.nodeNotify.active = false;
    },

	ClickMissionOnlineTakeReward(){
        if(this.status != 2)
            return;
        let msgData = {};
        require("SendRequest").getIns().MST_Client_Event_Mission_Online_Account_TakeReward (msgData);
	},
});
