cc.Class({
    extends: require("SlotSoundControl"),

    ctor(){
        this.MAYA_BG = "Sound/Maya/BG",
        this.MAYA_BONUS = "Sound/Maya/Bonus";
        this.MAYA_START_BONUS = "Sound/Maya/StartBonus";
    },

    SetLink() {
        this._super();
        this.bgLink = this.MAYA_BG;
        this.bonusStart = this.MAYA_START_BONUS;
    },

    
});