// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        HieuUng_Animation : cc.Animation,
        NhacNen_Animation : cc.Animation
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        //Check Sound
        this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
        this.music = cc.Tool.getInstance().getItem("@Music").toString() === 'true';
        this.changeHieuUng(this.sound);
        this.changeNhacNen(this.music);

        this.AudioController = require("AudioController").getIns();
        this.AudioController.enableSound(this.sound);
        this.AudioController.enableMusic(this.music);
    },

    changeHieuUng(enable)
    {
        let animationName = "";
        if(enable)
        {
            animationName = "On_Setting";
        }
        else
        {
            animationName = "Off_Setting";
        }
        this.HieuUng_Animation.play(animationName)
    },

    changeNhacNen(enable)
    {
        let animationName = "";
        if(enable)
        {
            animationName = "On_Setting";
        }
        else
        {
            animationName = "Off_Setting";
        }
        this.NhacNen_Animation.play(animationName)
    },

    onClick_ChangeSound()
    {
        this.sound = !this.sound;
        cc.Tool.getInstance().setItem("@Sound", this.sound);
        this.changeHieuUng(this.sound);
        this.AudioController.enableSound(this.sound);
    },

    onClick_ChangeMusic()
    {
        this.music = !this.music;
        cc.Tool.getInstance().setItem("@Music", this.music);
        this.changeNhacNen(this.music);
        this.AudioController.enableMusic(this.music);
    },

    onClick_Close()
    {
        cc.log("CLOSE SETTING POPUP");
        require("ThanTaiSpinController").getIns().mainView.Destroy_SettingView();
    },


    // update (dt) {},
});
