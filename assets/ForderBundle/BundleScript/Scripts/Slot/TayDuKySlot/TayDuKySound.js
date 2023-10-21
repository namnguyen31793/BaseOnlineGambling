cc.Class({
    extends: require("SlotSoundControl"),

    SetLink() {
        this._super();
        this.bgLink = Sound.SOUND_SLOT.TAY_DU_KI_BG;
        this.spinStart =  Sound.SOUND_SLOT.TAY_DU_KI_START_SPIN;
        this.spinStop =  Sound.SOUND_SLOT.TAY_DU_KI_STOP_SPIN;
        this.jackpotLink = Sound.SOUND_SLOT.TAY_DU_KI_JACKPOT;
        this.spinLink =  Sound.SOUND_SLOT.TAY_DU_KI_START_SPIN;
        this.bonusStart = Sound.SOUND_SLOT.TAY_DU_KI_BONUS;
        this.freeLink = Sound.SOUND_SLOT.TAY_DU_KI_FREESPIN;
    },

    
});