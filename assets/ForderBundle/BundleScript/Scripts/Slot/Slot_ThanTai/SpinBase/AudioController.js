var AudioController = cc.Class({
    statics: {
        getIns() {
            if (this.self == null)
            {
                this.self = new AudioController();
                this.self.Setup();
            }
            return this.self;
        }
    },

    Setup()
    {
      
    },

    setAudioPool(audioPool)
    {
        this.audioPool = audioPool;        
    },

    playSound(clipType) {
        if (!this.soundState) return;
        var audioClip = this.audioPool.getAudioClip(clipType);
        if (audioClip !== null) {
            return audioClip.play();
        }
    },
    playSound_Direct(audioSource,isLoop = false)
    {
        if (!this.soundState) return;
        if(audioSource !== null)
        {
            if(isLoop)
                audioSource.loop = true;
            return audioSource.play();
        }
    },
    stopSound(clipType) {
        if (!this.soundState) return;
        var audioClip = this.audioPool.getAudioClip(clipType);
        if (audioClip !== null) {
            return audioClip.stop();
        }
    },
    playMusic(clipType) {
        if (!this.musicState) return;
        var audioClip = this.audioPool.getAudioClip(clipType);
        if (audioClip !== null) {
            return audioClip.play();
        }
    },
    stopMusic(clipType) {
        if (!this.musicState) return;
        var audioClip = this.audioPool.getAudioClip(clipType);
        if (audioClip !== null) {
            return audioClip.stop();
        }
    },
    enableMusic(enable) {
        this.musicState = enable;
        this.audioPool.enableMusic(enable);
    },
    enableSound(enable) {
        this.soundState = enable;
        this.audioPool.enableSound(enable);
    },

    setBackgroundMusic(newMusicClip) {
        this.audioPool.setBackgroundMusic(newMusicClip);
    },

    playBackgroundMusic()
    {
        this.audioPool.playBackgroundMusic();
    },
    stopBackgroundMusic()
    {
        this.audioPool.stopBackgroundMusic();
    },

    playBonusBackgroundMusic()
    {
        this.audioPool.playBonusBgMusic();
    },

    getSoundState()
    {
        return this.soundState;
    }


});

module.exports = AudioController;
