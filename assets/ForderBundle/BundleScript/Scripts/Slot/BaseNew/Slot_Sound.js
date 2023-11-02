// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
