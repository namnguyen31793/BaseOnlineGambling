cc.Class({
    extends: cc.Component,
    properties: {
        startRot : {
            default : 0,
        },
        
    },

    ChangeRotation() {
        this.wheel.ChangeRotation();
    },

    CheckRotation() {
        this.wheel.CheckRotation();
    },

    PlayEndRotation() {
        this.wheel.PlayEndRotation();
    },

    PlayEffect() {
        // this.wheel.PlayEffect();
    }
});
