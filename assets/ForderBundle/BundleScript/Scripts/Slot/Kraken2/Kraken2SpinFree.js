// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor() {
        this.targetAngle = 0;
        this.indexRotation = 0;
        this.RunAnim = false;
        this.cacheTodoList = null;
        this.speed = 0;
        this.angle = 0;
    },

    properties: {
        wheel : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    ShowSpinFree (numberSpin, todolistCall) {
        this.indexRotation = Global.RandomNumber(4,6);
        this.RunAnim = true;
        this.targetAngle = this.GetAngleSpin(numberSpin);
        this.cacheTodoList = todolistCall;
    },

    GetAngleSpin(numberSpin){
        let angleTarget = 0;
        switch(numberSpin){
            case 5:
                angleTarget = 252;
                break;
            case 6:
                angleTarget = 322;
                break; 
            case 8:
                angleTarget = 36;
                break; 
            case 10:
                angleTarget = 288;
                break;
            case 12:
                angleTarget = 0;
                break;
        }
        return angleTarget;
    },

    EndSpin(){
        this.RunAnim = false;
        if(this.cacheTodoList != null)
            this.cacheTodoList.DoWork();
        this.cacheTodoList = null;
    },

    update(dt) {
        if(this.RunAnim){
            if(dt < 1/60)
                dt = 1/60;
            if(this.indexRotation > 3)
                this.speed += 360 * dt;
            else
                this.speed -= 150 * dt;
            if(this.speed < 30)
                this.speed = 30;
            this.angle += this.speed * dt;
            if(this.angle >= 360) {
                this.angle = 0;
                this.wheel.angle = 0;
                this.indexRotation -= 1;
            }
            if(this.indexRotation <= 0){
                if( Math.abs(this.angle - this.targetAngle) <= 2) {
                    this.stateSpin = 0;
                    this.EndSpin();
                    //end
                }
            }
            if(this.wheel != null)
                this.wheel.angle = this.angle;
        }
    },
});
