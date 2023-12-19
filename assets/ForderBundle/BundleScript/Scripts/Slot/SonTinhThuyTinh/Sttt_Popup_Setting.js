cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotControl = null;
    },

    properties: {
        toggleAudio : cc.Toggle,
        objAudio : cc.Node,
        toggleMusic : cc.Toggle,
        objMusic : cc.Node,
    },

    CheckInfo() {
        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC+"123465") || 1;
        if(isMusic > 0) {
            this.toggleMusic.isChecked = true;
            this.objMusic.active = false;
        } else {
            this.toggleMusic.isChecked = false;
            this.objMusic.active = true;
        }
        this.ClickMusic(this.toggleMusic, null);
        let isAudio = cc.sys.localStorage.getItem(CONFIG.KEY_SOUND+"123465") || 1;
        if(isAudio > 0) {
            this.toggleAudio.isChecked = true;
            this.objAudio.active = false;
        } else {
            this.toggleAudio.isChecked = false;
            this.objAudio.active = true;
        }
        this.ClickAudio(this.toggleAudio, null);
    },

    Init(slotControl){
        this.slotControl = slotControl;
        this.CheckInfo();
    },

    ClickMusic(toggle, data) {
        this.slotControl.ChangeStateMusic(toggle.isChecked);
        this.objMusic.active = !toggle.isChecked;
    },

    ClickAudio(toggle, data) {
        this.slotControl.ChangeStateSound(toggle.isChecked);
        this.objAudio.active = !toggle.isChecked;
    },
    
    ShowRank(){
        this.slotControl.slotMenu.ClickShowRank();
        this.Hide();
    },

    ShowHistory(){
        this.slotControl.slotMenu.ClickShowHistory();
        this.Hide();
    },

    Hide(){
        this.node.active = false;
    },
});
