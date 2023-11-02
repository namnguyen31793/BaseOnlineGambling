cc.Class({
    extends: require('SlotSound'),

    properties: {
        linkBgSound : {
            default : "Sound/BG",
        },
        clickLink: {
            default : "Sound/Click",
        },
        spinLink : {
            default : "Sound/Spin",
        },
        winMoneyLink: {
            default : "Sound/Win",
        },
        bigWinLink : {
            default : "Sound/BigWin",
        },
        spinStart: {
            default : "Sound/StartSpin",
        },
        spinStop : {
            default : "Sound/StopSpin",
        },
        jackpotLink : {
            default : "Sound/Jackpot",
        },
        freeLink : {
            default : "Sound/FreeSpin",
        },
        bonusStart : {
            default : "Sound/StartBonus",
        },
        bonusEnd : {
            default : "Sound/EndBonus",
        },
    },

    ChangeStateMusic(state) {
        
        this.isPlayMusic = state;
        if(this.isPlayMusic)
            this.PlayBackgroundMusic();
        else 
            this.StopBackgroundMusic();
    },

    PlayBackgroundMusic() {
        if(this.isPlayMusic)
            this.soundManager.playMusicBackground(this.linkBgSound, 0.3, ()=>{
                this.soundManager2.playMusicBackground("34", this.linkBgSound, 0.6);
            });
    },

    StopBackgroundMusic() {
        if(this.soundManager != null)
            this.soundManager.stopMusicBackground();
        if(this.soundManager2 != null)
            this.soundManager2.stopMusicBackground();
    },

    ChangeStateSound(state) {
        this.isPlaySound = state;
        if(!this.isPlaySound)
            this.StopSound();
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

    /*CALL AUDIO*/

    PlayAudioClick() {
        this.PlaySound(this.clickLink);
    },

    PlayAudioSpin() {
        this.PlaySound(this.spinLink);
    },

    PlayAudioSpinStart() {
        // this.PlaySound(this.spinStart);
    },

    PlayAudioSpinStop() {
        // this.PlaySound(this.spinStop);
    },

    PlayAudioFreeSpin() {
        this.PlaySound(this.freeLink);
    },

    PlayAudioBonusStart() {
        this.PlaySound(this.bonusStart);
    },

    PlayAudioBonusEnd() {
        this.PlaySound(this.bonusEnd);
    },

    PlayAudioWinMoney() {
        this.PlaySound(this.winMoneyLink);
    },

    PlayAudioBigWin() {      
        this.PlaySound(this.bigWinLink);   
    },

    PlayAudioJackpot() {
        this.PlaySound(this.jackpotLink);
    },

    StopSpin() {
        if(this.soundManager != null)
            this.soundManager.stopEffect(this.spinLink);
        if(this.soundManager2 != null)
            this.soundManager2.stopEffect(this.spinLink);
    },

    /*-------------------*/
    PlaySound(resSound) {
        if(this.isPlaySound) {
            this.soundManager.playEffect(resSound, false, 1, ()=>{
                this.soundManager2.playEffect("34", resSound, false, 1 , true);
            });
        }        
    },
});
