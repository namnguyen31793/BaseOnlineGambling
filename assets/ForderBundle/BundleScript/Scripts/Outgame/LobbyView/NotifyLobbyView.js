const List = require("../../Utils/List");

cc.Class({
    extends: cc.Component,
    ctor() {
        this.isInit = false;
        this.listItem = new List();
        this.lastNotify = null;
        this.speed = 100;
    },

    properties: {
        item : cc.Node,
        listWidget : [cc.Widget],
        mask : cc.Node,
    },

    Init() {
        if(this.isInit)
            return;
        this.isInit = true;
        this.item.active = false;
        this.listItem.Import(Global.listDataBigWinLive);
        cc.log(Global.listDataBigWinLive);
        this.schedule(() => {
            this.CreateNotify();
        }, 3);
    },

    CreateNotify() {
        if(this.listItem.GetCount()==0)
            return;
        let r = Global.RandomNumber(0, this.listItem.GetCount());
        let data = this.listItem.Get(r);
        if(data == null)
            return;
        this.listItem.RemoveAt(r);
        if(this.listItem.GetCount() == 0) {
            this.listItem.Import(Global.listDataBigWinLive);
        }
        let item = this.createItem();
        item.getComponent(cc.RichText).string = "<color=#08CA00>"+data.Nickname+"</color> thắng lớn <color=#FFFF00FF>"+
            Global.Helper.formatNumber(data.RewardBalance)+"</color> tại <color=#00D6FF>"+this.GetGameName(data.GameType)+"</color>";
        this.scheduleOnce(() => {
            item.x = this.CalculatorX() + item.width/2;
            let endPos = -cc.winSize.width/2 - item.width/2;
            this.lastNotify = item;
            item.runAction(cc.sequence(cc.moveTo(this.CalculatorTime(item.x, endPos), cc.v2(endPos,0)), cc.callFunc(()=>{
                this.poolItem.put(item);
            })));
        }, 0.1);
    },

    GetGameName(gameId) {
        return Global.MyLocalization.GetText("SLOT_"+gameId+"_"+CONFIG.MERCHANT);
    },

    CalculatorX() {
        if(this.lastNotify == null)
            return cc.winSize.width/2;
        else return (this.lastNotify.x + this.lastNotify.width/2 + 50);
    },

    CalculatorTime(startPos, endPos) {
        return Math.abs((endPos-startPos))/this.speed;
    },

    createItem(){
        let node = this.getItem();
        node.active = true;
        node.parent = this.item.parent;
        node.x = 9999;
        return node;
    },

    getItem(){
        let node = null;
        if(this.poolItem.size() > 0){
            node = this.poolItem.get();
        }else{
            node = cc.instantiate(this.item);
        }
        return node;
    },


    onLoad() {
        this.poolItem = new cc.NodePool();
    },

    onDestroy(){
        this.poolItem.clear();
    },

});
