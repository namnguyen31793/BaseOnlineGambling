cc.Class({
    extends: require("SlotSoundControl"),

    ctor(){
        this.boomEffect = "Sound/Zeus/boom";
    },
    properties: {
		reelSpin : cc.AudioClip,
      
       
    },
    SetLink() {
        this._super();
        this.bgLink = Sound.SOUND_SLOT.CHINA_FALL_BG;
    },

    StopSound() {
        this._super();
        this.soundManager.stopEffect(this.boomEffect);
    },

    PlayBoom() {
        this.PlaySound(this.boomEffect);
    },

    PlaySpinStart() {
        cc.audioEngine.playEffect(this.reelSpin, false);   
    },

    
});