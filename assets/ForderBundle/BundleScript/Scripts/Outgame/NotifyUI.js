cc.Class({
    extends: cc.Component,
    ctor() {
        this.listNotifyDefault = [];
        this.listNotifyCashOut = [];
        this.index = -1;
        this.countTime = 0;
        this.isUpdateTime = true;
        this.SPEED = 50;
        this.TIME_DISTANCE = 5;
    },

    properties: {
        description : cc.RichText,
        boxNotify : cc.Node,
        startObj : cc.Node,
        endObj : cc.Node,
    },

    start() {
        if(this.isUpdateTime)
            this.ActiveNotify(false);
    },

    UpdateListNotify(content, speed) {
        this.listNotifyDefault.length = 0;
        let notify = {
            Notify : content,
            Speed : speed,
        };
        this.listNotifyDefault[0] = notify;
        Global.listNotifyDefault = this.listNotifyDefault;
        this.Notify ();
    },

    Notify() {
        // if(!this.isUpdateTime)
        //     return;
        this.countTime = 0;
        if (this.listNotifyDefault.length == 0)
            if(this.listNotifyCashOut.length > 0) {
                this.isUpdateTime = false;
                this.Show(null, null);
                return;
            }
            else
                return;
        this.isUpdateTime = false;
        let index = Global.RandomNumber (0, this.listNotifyDefault.length);
        if(this.listNotifyDefault.length == 1)
            this.index = 0;
        cc.log(this.listNotifyDefault);
        this.Show (this.listNotifyDefault [this.index].Notify, this.listNotifyDefault[this.index].Speed);
    },

    AddNotify(content, speed, repeat) {
        for(let i = 0; i < repeat; i++)
            this.listNotifyCashOut[this.listNotifyCashOut.length] = {
                Notify : content, 
                Speed : speed,
            };
    },

    Show(text, speed) {
        this.ActiveNotify (true);
        if(this.listNotifyCashOut.length > 0) {
            let notify = this.listNotifyCashOut[0];
            text = notify.Notify;
            speed = notify.Speed;
            this.listNotifyCashOut.splice(0,1);
        }

        this.description.string = text;
        this.description.node.setPosition(this.startObj.getPosition());
        this.scheduleOnce(this.funSche =  ()=>{
            let duration = this.description.node.width / (this.SPEED * speed);
            let action1 = cc.moveTo(duration , cc.v2(this.endObj.getPosition().x - this.description.node.width, this.endObj.getPosition().y));
            let action2 = cc.callFunc(()=>{ 
                this.isUpdateTime = true;
				this.ActiveNotify(false);
            });
            this.description.node.runAction(cc.sequence(action1 , action2));
        } , 0)
    },

    ActiveNotify(isActive) {
        this.boxNotify.active = isActive;
    },

    update(dt) {
        if(!this.isUpdateTime)
            return;
        this.countTime += dt;
        if(this.countTime > this.TIME_DISTANCE) {
            this.Notify();
        }
    },

    onDestroy() {
        this.unschedule(this.funSche);
    }
});
