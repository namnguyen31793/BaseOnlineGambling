const List = require("../Utils/List");

cc.Class({
    extends: cc.Component,
    ctor() {
        this.listNotify = null;
        this.isPlay = false;
    },

    properties: {
        anim : cc.Animation,
        lbDescription : cc.Label,
    },

    start() {
        this.listNotify = new List();
    },

    AddNotify(content) {
        this.listNotify.Add(content);
        this.Play();
    },

    Play() {
        if(!this.isPlay && this.listNotify.GetCount() > 0) {
            this.isPlay = true;
            this.lbDescription.string = this.listNotify.Get(0);
            this.anim.play();
            this.listNotify.RemoveAt(0);
            this.scheduleOnce(()=>{
                this.isPlay = false;
                this.Play();
            } , 3);
        }
    },

    onLoad() {
        Global.NotifyVertically = this;
    },

    onDestroy() {
        Global.NotifyVertically = null;
    },

});
