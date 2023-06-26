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
        this.soundManager2 = null;
    },

    properties: {
		isBattle: false,
        BigWinSound : cc.AudioClip,
        BgMusicSound : cc.AudioClip
    },

    Init() {
        this.soundManager = require('SoundManager1').getIns();
        this.soundManager2 = require('SoundManager2').getIns();
        this.SetLink();
        if(this.isBattle) {
            this.isPlayMusic = false;
            this.isPlaySound = false;
        }
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
            if(this.BgMusicSound != null)
            {
                cc.audioEngine.playEffect(this.BgMusicSound,true);       
            }
            else
            {
            this.soundManager.playMusicBackground(this.bgLink, 0.3, ()=>{
                this.soundManager2.playMusicBackground("Slot", this.bgLink, 0.6);
            });
             }
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
        if(this.soundManager != null)
            this.soundManager.stopMusicBackground();
        if(this.soundManager2 != null)
            this.soundManager2.stopMusicBackground();
    },

    StopSound() {
        if(this.soundManager != null) {
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
        }
        
        if(this.soundManager2 != null) {
            this.soundManager2.stopEffect(this.clickLink);
            this.soundManager2.stopEffect(this.spinLink);
            this.soundManager2.stopEffect(this.winMoneyLink);
            this.soundManager2.stopEffect(this.bigWinLink);
            this.soundManager2.stopEffect(this.spinStart);
            this.soundManager2.stopEffect(this.spinStop);
            this.soundManager2.stopEffect(this.freeLink);
            this.soundManager2.stopEffect(this.jackpotLink);
            this.soundManager2.stopEffect(this.bonusStart);
            this.soundManager2.stopEffect(this.bonusEnd);
        }
       
    },

    StopAll() {
        if(this.soundManager != null)
            this.soundManager.stopAll();
        if(this.soundManager2 != null)
            this.soundManager2.stopAll();
    },

    PlayClick() {
        this.PlaySound(this.clickLink);
    },

    PlaySpin() {
        this.PlaySound(this.spinLink);
    },

    StopSpin() {
        if(this.soundManager != null)
            this.soundManager.stopEffect(this.spinLink);
        if(this.soundManager2 != null)
            this.soundManager2.stopEffect(this.spinLink);
    },

    PlayWinMoney() {
        this.PlaySound(this.winMoneyLink);
    },

    PlayBigWin() {
        //this.PlaySound(this.bigWinLink);        
        cc.audioEngine.playEffect(this.BigWinSound, false);         
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
        if(this.isPlaySound) {
            this.soundManager.playEffect(resSound, false, 1, ()=>{
                this.soundManager2.playEffect("Slot", resSound, false, 1 , true);
            });
        }
            
    },
    HandleMatrixSound(matrix, listLineWinData, winNormalValue, winBonusValue, bonusTurn,freeSpinLeft, totalWin, accountBalance, 
        currentJackpotValue, isTakeJackpot, extendMatrixDescription)
    {

    },
});
