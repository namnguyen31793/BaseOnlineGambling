cc.Class({
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
});
