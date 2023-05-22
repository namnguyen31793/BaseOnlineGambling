cc.Class({
    extends: cc.Component,

    properties: {
        scrollMusic : cc.Slider,
        scrollSound : cc.Slider,
        barMusic : cc.Sprite,
        barSound : cc.Sprite,
        toggleSound : cc.Toggle,
        toggleMusic : cc.Toggle,
    },

    start() {
        this.scrollMusic.progress = Global.AudioManager.GetValueMusic();
        this.scrollSound.progress = Global.AudioManager.GetValueSound();
        this.barMusic.fillRange = 1 - this.scrollMusic.progress;
        this.barSound.fillRange = 1 - this.scrollSound.progress;
        if(this.scrollMusic.progress == 1) {
            this.toggleMusic.isChecked = false;
        } else {
            this.toggleMusic.isChecked = true;
        }
        if(this.scrollSound.progress == 1) {
            this.toggleSound.isChecked = false;
        } else {
            this.toggleSound.isChecked = true;
        }
        Global.AudioManager.ChangeValueMusic(Global.AudioManager.GetValueMusic());
        Global.AudioManager.ChangeValueSound(Global.AudioManager.GetValueSound());
    },

    show(){
        this.node.setSiblingIndex(this.node.parent.children.length-1);
        this.node.active = true;
        this.node.getComponent(cc.Animation).play("ShowPopup");
    },

    ClickChangeStatusSound(event, data) {
        if(this.toggleSound.isChecked) {
            Global.AudioManager.ChangeValueSound(0);
        } else {
            Global.AudioManager.ChangeValueSound(1);
        }
    },

    ClickChangeStatusMusic(event, data) {
        if(this.toggleMusic.isChecked) {
            Global.AudioManager.ChangeValueMusic(0);
        } else {
            Global.AudioManager.ChangeValueMusic(1);
        }
    },

    ChangeValueMusic(slider, event) {
        this.barMusic.fillRange = 1 - slider.progress;
        Global.AudioManager.ChangeValueMusic(slider.progress);
    },

    ChangeValueSound(slider, event) {
        this.barSound.fillRange = 1 - slider.progress;
        Global.AudioManager.ChangeValueSound(slider.progress);
    },

    Hide() {
        this.node.getComponent(cc.Animation).play("HidePopup");
        this.scheduleOnce(()=>{
            this.node.active = false;
            Global.UIManager.hideMark();
        } , 0.2);
    },

    onDestroy() {
        Global.SettingPopup = null;
    },
});
