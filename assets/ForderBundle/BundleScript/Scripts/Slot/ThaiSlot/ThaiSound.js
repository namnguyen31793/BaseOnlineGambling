cc.Class({
    extends: require("SlotSoundControl"),

    SetLink() {
        this._super();
        this.bgLink = Sound.SOUND_SLOT.ALICE_JUMP_BG;
    },


    Init() {
        this.soundManager = require('SoundManager2').getIns();
        this.SetLink();
    },

    SetLink() {
        this._super();
        this.bgLink = "BG";
        this.spinStart = "Spin";
        this.freeLink = "StartFree";
        this.winMoneyLink = "Win";
    },

    PlaySound(resSound) {
        if(this.isPlaySound)
            this.soundManager.playEffect("SoundThaiSlot", resSound);
    },

    PlayBackgroundMusic() {
        if(this.isPlayMusic)
            this.soundManager.playMusicBackground("SoundThaiSlot", this.bgLink, 1);
    },

    PlaySpinStart() {
        this.PlaySound(this.spinStart);
    },

    
});