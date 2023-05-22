cc.Class({
    extends: cc.Component,
    ctor() {
        this.listToDo = []; 
        this.listCheck = [];
        this.index = 0;
        this.isRepeat = false;
    },

    CreateList() {
        this.listToDo = [];
        this.listCheck = [];
        this.index = 0;
        this.isRepeat = false;
        this.unscheduleAllCallbacks();
    },

    AddWork(event, checkCallBack) {
        this.listToDo[this.index] = event;
        this.listCheck[this.index]  = checkCallBack;
        this.index++;
    },

    Play() {
        this.index = 0;
        this.DoWork();
    },

    PlayRepeat() {
        this.isRepeat = true;
        this.Play();
    },

    DoWork() {
        if(this.index < this.listToDo.length) {
            this.listToDo[this.index++]();
            if(!this.listCheck[this.index-1]) {
                this.DoWork();
            } 
        } else {
            if(this.isRepeat) {
                this.Play();
            }
        }
        
    },

    StopWork() {
        this.CreateList();
        
    },

    Wait(time) {
        this.AddWork(()=>{
            this.scheduleOnce(()=>{
                this.DoWork();
            } , time);  
        }, true);
        
    },
});
