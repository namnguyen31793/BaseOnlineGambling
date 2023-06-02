

cc.Class({
    extends: cc.Component,

    properties: {
      content:cc.Label,
      time:cc.Label,
    },

    onClickButtonYes(){
      this.Hide();
      cc.log("click yes");
      if(this.yesEvent != null)
        this.yesEvent();
      this.ClearEvent();
	  },

    onClickButtonNo(){
      this.Hide();
      if(this.noEvent != null)
        this.noEvent();
      this.ClearEvent();
    },

    ClearEvent() {
      this.noEvent = null;
      this.yesEvent = null;
    },
    
    Hide() {
      this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
    },

    show(message, yesEvent, noEvent){
      this.node.setSiblingIndex(this.node.parent.children.length-1);
      this.node.active = true;
      this.node.getComponent(cc.Animation).play("ShowPopup");
      this.time.node.active = false;
      this.content.string = message;
      this.yesEvent = yesEvent;
      this.noEvent = noEvent;
      this.content.node.y = -13;
	  },

    showTime(message, endTime, gameId, yesEvent, noEvent) {
      this.node.setSiblingIndex(this.node.parent.children.length-1);
      this.node.active = true;
      this.node.getComponent(cc.Animation).play("ShowPopup");
      this.time.node.active = true;
      this.content.string = message;
      this.yesEvent = yesEvent;
      this.noEvent = noEvent;
      this.content.node.y = 22;
      this.endDate = this.convertTime(endTime);
      this.CalculatorTime();
    },

    convertTime(str){
      let arr = str.split(" ");
      let timeConvert = arr[0].split("/").reverse().join("-") + "T" + arr[1] + "+07:00";
      return  new Date(timeConvert);
  },

    CalculatorTime() {
      this.countTime = (this.endDate.getTime()-require("SyncTimeControl").getIns().GetCurrentTimeServer())/1000;
      // if(this.countTime>0) {
      //   this.isCountTime = true;
      // } else {
      //   this.isCountTime = false;
      // }
    },

    TimeConvert(numb) {
      let minute = parseInt(numb / 60);
      let second = parseInt(numb - minute * 60);
      let strMinute = minute.toString();
      if(minute < 10) strMinute = "0"+minute;
      let strSecond = second.toString();
      if(second < 10) strSecond = "0"+second;
      this.time.string = strMinute+":"+strSecond;
    },

    update(dt) {
      if(this.countTime > 0) {
          this.countTime -= dt;
          if(this.countTime <= 0) {
              this.countTime = 0;
              if(this.noEvent != null)
                this.noEvent();
              this.Hide();
          }
          this.TimeConvert(this.countTime);
      }
    },

    onDestroy(){
      Global.ConfirmPopup = null;
    },
});
