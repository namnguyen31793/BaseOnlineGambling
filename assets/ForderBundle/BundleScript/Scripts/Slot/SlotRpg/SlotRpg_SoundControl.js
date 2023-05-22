cc.Class({
    extends: cc.Component,
    ctor() {
        this.soundManager = null;
        this.isPlayMusic = true;
        this.isPlaySound = true;
        this.bgLink = "";
        this.clickLink = "";
        this.spinLink = "";
        this.winMoneyLink = "";
        this.bigWinLink = "";
        this.spinStart = "";
        this.spinStop = "";
        this.jackpotLink = "";
        this.freeLink = "";
        this.bonusStart = "";
        this.bonusEnd = "";
    },

    properties: {
    },

    Init() {
        this.soundManager = require('SoundManager1').getIns();
        this.SetLink();
        this.isPlayMusic = false;
        this.isPlaySound = false;
    },

    SetLink() {
        this.bgLink = Sound.SOUND_SLOT.SLOT_SHOCKDEER;
        this.clickLink = Sound.SOUND_SLOT.CLICK;
        this.spinLink = Sound.SOUND_SLOT.WHEEL;
        this.winMoneyLink = Sound.SOUND_SLOT.GET_PRIZE;
        this.bigWinLink = Sound.SOUND_SLOT.BIGWIN;
        this.spinStart = Sound.SOUND_SLOT.SPIN;
        this.spinStop = Sound.SOUND_SLOT.STOP;
        this.freeLink = Sound.SOUND_SLOT.FREESPIN;
        this.jackpotLink = Sound.SOUND_SLOT.JACKPOT;
        this.bonusStart = Sound.SOUND_SLOT.BONUS_START;
        this.bonusEnd = Sound.SOUND_SLOT.BONUS_END;
    },

    PlayBackgroundMusic() {
        if(this.isPlayMusic)
            this.soundManager.playMusicBackground(this.bgLink);
    },

    ChangeStateMusic(state) {
        
        this.isPlayMusic = state;
        if(this.isPlayMusic)
            this.PlayBackgroundMusic();
        else 
            this.StopBackgroundMusic();
    },

    ChangeStateSound(state) {
        this.isPlaySound = state;
        if(!this.isPlaySound)
            this.StopSound();
    },

    StopBackgroundMusic() {
        this.soundManager.stopMusicBackground();
    },

    StopSound() {
        this.soundManager.stopEffect(this.clickLink);
        this.soundManager.stopEffect(this.spinLink);
        this.soundManager.stopEffect(this.winMoneyLink);
        this.soundManager.stopEffect(this.bigWinLink);
        this.soundManager.stopEffect(this.spinStart);
        this.soundManager.stopEffect(this.spinStop);
        this.soundManager.stopEffect(this.freeLink);
        this.soundManager.stopEffect(this.jackpotLink);
        this.soundManager.stopEffect(this.bonusStart);
        this.soundManager.stopEffect(this.bonusEnd);
    },

    StopAll() {
        this.soundManager.stopAll();
    },

    PlayClick() {
        this.PlaySound(this.clickLink);
    },

    PlaySpin() {
        this.PlaySound(this.spinLink);
    },

    StopSpin() {
        this.soundManager.stopEffect(this.spinLink);
    },

    PlayWinMoney() {
        this.PlaySound(this.winMoneyLink);
    },

    PlayBigWin() {
        this.PlaySound(this.bigWinLink);
    },

    PlaySpinStart() {
        // this.PlaySound(this.spinStart);
    },

    PlaySpinStop() {
        // this.PlaySound(this.spinStop);
    },

    PlayFreeSpin() {
        this.PlaySound(this.freeLink);
    },

    PlayJackpot() {
        this.PlaySound(this.jackpotLink);
    },

    PlayBonusStart() {
        this.PlaySound(this.bonusStart);
    },

    PlayBonusEnd() {
        this.PlaySound(this.bonusEnd);
    },

    PlaySound(resSound) {
        if(this.isPlaySound)
            this.soundManager.playEffect(resSound);
    },
});
