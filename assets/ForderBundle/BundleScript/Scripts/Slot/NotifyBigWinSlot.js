
cc.Class({
    extends: cc.Component,

    properties: {
       lbDescription : cc.RichText,
    },

    Show(y, timeMove) {
        this.node.x = -9999;
        if(Global.listBigWinData == null || Global.listBigWinData.length == 0)
            return;
        let data = Global.listBigWinData[Global.RandomNumber(0,Global.listBigWinData.length)];
        if(data.RewardBalance < 500000) {
            this.lbDescription.string = data.Nickname+" <color=#ffd800>BIGWIN</color> game <color=#ff7992>"+Global.MyLocalization.GetText("SLOT_"+data.GameType)+
            "</color> <color=#ffd800>"+Global.Helper.formatNumber(data.RewardBalance)+"</color>";
        } else {
            let r = Global.RandomNumber(0,100);
            if(r < 10) {
                this.lbDescription.string = data.Nickname+" <color=#ffd800>JACKPOT</color> game <color=#ff7992>"+Global.MyLocalization.GetText("SLOT_"+data.GameType)+
                "</color> <color=#ffd800>"+Global.Helper.formatNumber(data.RewardBalance)+"</color>";
            } else {
                this.lbDescription.string = data.Nickname+" <color=#ffd800>BIGWIN</color> game <color=#ff7992>"+Global.MyLocalization.GetText("SLOT_"+data.GameType)+
                "</color> <color=#ffd800>"+Global.Helper.formatNumber(data.RewardBalance)+"</color>";
            }
        }
        
        this.scheduleOnce(()=>{
            this.node.width = this.lbDescription.node.width + 30;
            this.node.x = -cc.winSize.width/2-this.lbDescription.node.width/2-50;
            this.node.y = y;
            this.node.runAction(cc.moveTo(timeMove, cc.v2(cc.winSize.width/2+this.lbDescription.node.width/2+50, y)));
        } , 0.1);
        let r = Global.RandomNumber(0,100);
        if(r < 80) {
            this.scheduleOnce(()=>{
                this.Show(y, timeMove);
            } , timeMove);
        } else {
            let wait = Global.RandomNumber(4,10);
            this.scheduleOnce(()=>{
                this.Show(y, timeMove);
            } , timeMove + wait);
        }
    },
    
});
