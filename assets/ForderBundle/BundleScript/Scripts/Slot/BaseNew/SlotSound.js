cc.Class({
    extends: cc.Component,

    ctor() {
        this.soundManager = null;
        this.soundManager2 = null;
        this.isPlayMusic = true;
        this.isPlaySound = true;
    },

    Init() {
        this.soundManager = require('SoundManager1').getIns();
        this.soundManager2 = require('SoundManager2').getIns();
    },

    onLoad() {
        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC+"123465") || 1;
        if(isMusic > 0) {
            this.ChangeStateMusic(true);
            
        } else {
            this.ChangeStateMusic(false);
        }
        let isAudio = cc.sys.localStorage.getItem(CONFIG.KEY_SOUND+"123465") || 1;
        if(isAudio > 0) {
            this.ChangeStateSound(true);
            
        } else {
            this.ChangeStateSound(false);
        }
    },

    ChangeStateMusic(state) {

    },
    
    ChangeStateSound(state) {

    },
});
