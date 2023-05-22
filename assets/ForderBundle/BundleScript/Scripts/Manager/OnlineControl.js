var OnlineControl = cc.Class({
	statics: {
        getIns() {
            if (this.self == null) this.self = new OnlineControl();
            return this.self;
        }
    },

    ctor() {
        this.data = null;
    },

    InsertData(data) { 
        this.data = data;
        this.GetStatus();
    },
    //0-END, 1- COUNT_TIME, 2 - TAKE
    GetStatus(){
        var type = 0;
        var timeCount = 0;

        if(this.data == null){
            return;
        }
        if(this.data.Status)
            type = 0;
        else{
            timeCount = this.GetTimeRest();
            if(timeCount <= 0)
                type = 2;
            else
                type = 1;
        }
        if(Global.BtnOnline)
            Global.BtnOnline.ShowViewMissionOnline(type, timeCount);
    },

    GetTimeRest(){
        var dateEnd = new Date(this.data.EndTime);
        var time = parseInt( (dateEnd.getTime()- (new Date()).getTime())/ 1000);
        if(time < 0)
        time = 0
        cc.log("GetTimeRest "+time);
        return time;
    },
});
module.exports = OnlineControl;
