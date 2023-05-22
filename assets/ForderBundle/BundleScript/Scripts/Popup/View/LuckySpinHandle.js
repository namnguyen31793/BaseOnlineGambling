cc.Class({
    extends: cc.Component,
    properties: {
        startRot : {
            default : 0,
        },
        wheel : require("FishingWheelView"),
        
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
