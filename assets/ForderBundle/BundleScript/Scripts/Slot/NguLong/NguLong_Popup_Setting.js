cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotControl = null;
    },

    properties: {
        toggleAudio : cc.Toggle,
        toggleMusic : cc.Toggle,
    },

    CheckInfo() {
        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC+"123465") || 1;
        if(isMusic > 0) {
            this.toggleMusic.isChecked = true;
            
        } else {
            this.toggleMusic.isChecked = false;
        }
        this.ClickMusic(this.toggleMusic, null);
        let isAudio = cc.sys.localStorage.getItem(CONFIG.KEY_SOUND+"123465") || 1;
        if(isAudio > 0) {
            this.toggleAudio.isChecked = true;
        } else {
            this.toggleAudio.isChecked = false;
        }
        this.ClickAudio(this.toggleAudio, null);
    },

    Init(slotControl){
        this.slotControl = slotControl;
        this.CheckInfo();
    },

    ClickMusic(toggle, data) {
        this.slotControl.ChangeStateMusic(toggle.isChecked);
    },

    ClickAudio(toggle, data) {
        this.slotControl.ChangeStateSound(toggle.isChecked);
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
