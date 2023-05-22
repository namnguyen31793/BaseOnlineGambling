cc.Class({
    extends: require("SlotSoundControl"),
    ctor(){
        this.TakeExtraFree = "Sound/DragonFire/playButton";
        this.FreeEnd = "Sound/DragonFire/FreeSpinEnd";
    },

    SetLink() {
        this._super();
        
        this.bgLink = "Sound/DragonFire/BG";
        this.spinLink = "Sound/DragonFire/Spin";
        this.winMoneyLink = "Sound/DragonFire/winNormal";
        this.bigWinLink = "Sound/DragonFire/BigWin";
        this.freeLink = "Sound/DragonFire/FreeSpinStart";
    },
    
    StopSound() {
        this._super();
        this.soundManager.stopEffect(this.TakeExtraFree);
        this.soundManager.stopEffect(this.FreeEnd);
    },

    PlayTakeExtraFree() {
        this.PlaySound(this.TakeExtraFree);
    },

    PlayFreeEnd() {
        this.PlaySound(this.FreeEnd);
    },
});