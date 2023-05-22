cc.Class({
    extends: require("SlotSoundControl"),

    ctor(){
        this.CA_CHEP_BONUS = "Sound/CaChep/NhacNenBonusFree";
        this.CA_CHEP_START_BONUS = "Sound/CaChep/AnBonusSpinCaChep";
    },

    SetLink() {
        this._super();
        this.bgLink = Sound.SOUND_SLOT.CA_CHEP_BG;
        this.bonusStart = this.CA_CHEP_START_BONUS;
    },

    
});