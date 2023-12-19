var objAudioClip = {};

var SoundManager1 = cc.Class({
    extends: cc.Component,

    properties: {
    },
    statics: {
        getIns() {
            if (this.self == null) {
                this.self = new SoundManager1();
            }
            return this.self;
        }
    },
    stopMusicBackground() {
        this.isPlayMusic = false;
        if (this.currentCipMusicBackGround != null) {
            cc.audioEngine.stop(this.currentCipMusicBackGround);
        }
    },
    playMusicBackground(ResDefine, volume = 0.3, errorCallBack = null) {
        cc.log(ResDefine)
        this.isPlayMusic = true;
        cc.resources.load(ResDefine, cc.AudioClip, (err, clip) => {
            if (err) {
                if(errorCallBack != null) {
                    errorCallBack();
                }
                return;
            }
            if (this.currentCipMusicBackGround != null) {
                cc.audioEngine.stop(this.currentCipMusicBackGround);
            }
            if(this.isPlayMusic)
                this.currentCipMusicBackGround = cc.audioEngine.play(clip, true, volume);
        });
    },
    playEffect(ResDefine, isLoop = false, volume = 1, errorCallBack = null) {
        cc.resources.load(ResDefine, cc.AudioClip, (err, clip) => {
            if (err) {
                if(errorCallBack != null) {
                    errorCallBack();
                }
                return;
            }
            if (objAudioClip[ResDefine] != null) {
                cc.audioEngine.stop(objAudioClip[ResDefine]);
            }
            objAudioClip[ResDefine] = cc.audioEngine.play(clip, isLoop, volume);
        });
    },
    stopEffect(ResDefine) {
        if (objAudioClip[ResDefine] != null) {
            cc.audioEngine.stop(objAudioClip[ResDefine]);
        }
    },
    pasauseEffect(ResDefine) {
        if (objAudioClip[ResDefine] != null) {
            cc.audioEngine.pause(objAudioClip[ResDefine]);
        }
    },

    resumeEffect(ResDefine) {
        if (objAudioClip[ResDefine] != null) {
            cc.audioEngine.resume(objAudioClip[ResDefine]);
        }
    },

    stopAll() {
        // for(let temp in objAudioClip){
        //     if(objAudioClip[temp] != null ){

        //     }
        // }
        cc.audioEngine.stopAll();
        objAudioClip = {};
    },

});

export default SoundManager1;