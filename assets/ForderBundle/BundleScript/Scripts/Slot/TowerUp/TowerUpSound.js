cc.Class({
    extends: require("SlotSoundControl"),

    ctor(){
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
    },

    PlaySound(resSound) {
        if(this.isPlaySound)
            this.soundManager.playEffect("SoundTowerUp", resSound);
    },

    PlayBackgroundMusic() {
        if(this.isPlayMusic)
            this.soundManager.playMusicBackground("SoundTowerUp", this.bgLink, 1);
    },

    PlaySpinStart() {
        this.PlaySound(this.spinStart);
    },

    
});