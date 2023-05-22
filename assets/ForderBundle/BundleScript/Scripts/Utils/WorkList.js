const List = require("../Utils/List");
cc.Class({
    extends: cc.Component,
    ctor() {
        this.listToDo = null;
        this.isRepeat = false;
        this.countTime = 0;
        this.endTime = 0;
    },

    start() {
        this.CreateList();
    },

    CreateList() {
        this.listToDo = new List();
        this.isRepeat = false;
    },

    AddWork(event, checkCallBack) {
        var d = {
			Event : event,
			Check : checkCallBack,
		}
        this.listToDo.Add(d);
    },

    Play() {
        this.DoWork();
    },

    PlayRepeat() {
        this.isRepeat = true;
        this.Play();
    },

    DoWork() {
        if(this.listToDo.GetCount() > 0) {
            this.listToDo.Get(0).Event();
            if(!this.listToDo.Get(0).Check) {
                this.listToDo.RemoveAt(0);
                this.DoWork();
            }
        } else {
            if(this.isRepeat()) {
                this.Play();
            }
        }
        
    },

    StopWork() {
        this.CreateList();
    },

    update(dt) {
        if(this.endTime > 0) {
            this.countTime += dt;
            if(this.countTime >= this.endTime) {
                this.endTime = 0;
                this.DoWork();
            }
        }
    },

    onLoad() {
        Global.WorkList = this;
    },

    onDestroy() {
        Global.WorkList = null;
    },
});
