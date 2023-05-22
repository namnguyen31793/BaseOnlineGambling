

cc.Class({
    extends: cc.Component,
    ctor() {
        this.countTime = 0;
        this.endDate = null;
    },

    properties: {
        gameId : {
            default : 1,
        },
        lbTime : cc.Label,
    },

    Init(startTime, endTime) {
        // let startDate = new Date(startTime)
        cc.log("init tour time:");
        this.endDate = new Date(endTime)
        cc.log(this.endDate);
        this.CalculatorTime();
    },

    CalculatorTime() {
        this.countTime = (this.endDate.getTime()-require("SyncTimeControl").getIns().GetCurrentTimeServer())/1000;
        if(this.countTime>0) {
            this.node.active = true;
            this.isCountTime = true;
        } else {
            this.node.active = false;
        }
    },

    UpdateTime() {
        this.CalculatorTime();
    },

    TimeConvert(numb) {
		let minute = parseInt(numb / 60);
		let second = parseInt(numb - minute * 60);
		let strMinute = minute.toString();
		if(minute < 10) strMinute = "0"+minute;
		let strSecond = second.toString();
		if(second < 10) strSecond = "0"+second;
		this.lbTime.string = strMinute+":"+strSecond;
	},

    update(dt) {
        if(this.countTime > 0) {
            this.countTime -= dt;
            if(this.countTime <= 0) {
                this.countTime = 0;
                this.node.active = false;
            }
            this.TimeConvert(this.countTime);
        }
    },
    
});
