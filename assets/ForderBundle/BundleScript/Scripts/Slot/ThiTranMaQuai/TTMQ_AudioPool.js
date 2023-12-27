// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require('AudioPool'),

    properties: {
        musicBackground: cc.AudioSource,
        musicBonusBackground: cc.AudioSource,
        normalWin: cc.AudioSource,
        Jackpot: cc.AudioSource,        
        spin: cc.AudioSource,
        stopSpin1: cc.AudioSource,
        stopSpin2: cc.AudioSource,
        stopSpin3: cc.AudioSource,
        stopSpin4: cc.AudioSource,
        stopSpin5: cc.AudioSource,
        bonusClick: cc.AudioSource,
        bonusMiss: cc.AudioSource,
        bonusWin: cc.AudioSource,
        click: cc.AudioSource,
        freespin: cc.AudioSource,
        charactor_Smile: cc.AudioSource,
        biNgo_ChonHu: cc.AudioSource,
        showWinPopup : cc.AudioSource,
      
    },

    enableMusic: function (enable) {
        if (this.musicBackground) {
            if (enable) {
                if (!this.musicBackground.isPlaying) {
                    this.musicBackground.play();
                }
            } else {
                this.musicBackground.stop();
            }
        }
    },

    enableSound: function (enable) {
        if (this.normalWin) {
            this.normalWin.mute = !enable;        
            this.spin.mute = !enable;
            this.stopSpin1.mute = !enable;
            this.stopSpin2.mute = !enable;
            this.stopSpin3.mute = !enable;
            this.stopSpin4.mute = !enable;
            this.stopSpin5.mute = !enable;
            this.bonusClick.mute = !enable;
            this.bonusMiss.mute = !enable;
            this.bonusWin.mute = !enable;
            this.click.mute = !enable;
            this.freespin.mute = !enable;
            this.biNgo_ChonHu.mute = !enable;
        }
    },

    getAudioClip: function (clipType) {
        var audioClip;
        audioClip = null;
        switch (clipType) {
            case cc.AudioTypes.BACKGROUND:
                audioClip = this.musicBackground;
                break;
            case cc.AudioTypes.NORMAL_WIN:
                audioClip = this.normalWin;
                break; 
            case cc.AudioTypes.SPIN:
                audioClip = this.spin;
                break;
            case cc.AudioTypes.STOP_SPIN_1:
                audioClip = this.stopSpin1;
                break;
            case cc.AudioTypes.STOP_SPIN_2:
                audioClip = this.stopSpin2;
                break;
            case cc.AudioTypes.STOP_SPIN_3:
                audioClip = this.stopSpin3;
                break;
            case cc.AudioTypes.STOP_SPIN_4:
                audioClip = this.stopSpin4;
                break;
            case cc.AudioTypes.STOP_SPIN_5:
                audioClip = this.stopSpin5;
                break;
            case cc.AudioTypes.BONUS_CLICK:
                audioClip = this.bonusClick;
                break;
            case cc.AudioTypes.BONUS_MISS:
                audioClip = this.bonusMiss;
                break;
            case cc.AudioTypes.BONUS_WIN:
                audioClip = this.bonusWin;
                break;   
            case cc.AudioTypes.CLICK:
                audioClip = this.click;
                break;   
            case cc.AudioTypes.FREESPIN:
                audioClip = this.freespin;
                break;   
            case cc.AudioTypes.JACKPOT:
                audioClip = this.Jackpot;
                break;
            
        }
        return audioClip;
    },


    setBackgroundMusic: function (newMusicClip) {
        if (newMusicClip) {
            if (this.musicBackground) {
                this.musicBackground.stop();
            }
            this.musicBackground.clip = newMusicClip; // Gán âm nhạc mới
            this.musicBackground.loop = true; // Đặt âm nhạc nền để loop
            this.musicBackground.play();
        }
    },

    playBackgroundMusic: function () {
        if (this.musicBackground && this.musicBackground.clip) {
            this.musicBonusBackground.stop();
            this.musicBackground.loop = true; // Đặt âm nhạc nền để loop
            this.musicBackground.play();
        }
    },

    playBonusBgMusic()
    {
        if (this.musicBonusBackground && this.musicBonusBackground.clip) {            
            this.musicBackground.stop();
            this.musicBonusBackground.loop = true; // Đặt âm nhạc nền để loop
            this.musicBonusBackground.play();
        }
    },
    play_CharactorSmile_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.charactor_Smile);
    },
    play_Bonus_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.StartBonus);
    },
    play_BigWin_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.BigWin);
    },
    play_BonusFall_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.bonusMiss);
    },
    play_BonusWin_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.bonusWin);
    },
    play_ChonHu_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.biNgo_ChonHu);
    },
    play_ShowWinPopup_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.showWinPopup);
    },
    play_Jackpot_Fx_Sound()
    {
        require("AudioController").getIns().playSound_Direct(this.Jackpot);
    },

    // update (dt) {},
});
