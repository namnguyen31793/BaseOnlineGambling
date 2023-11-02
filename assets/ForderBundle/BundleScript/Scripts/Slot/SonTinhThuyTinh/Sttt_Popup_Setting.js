cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotControl = null;
    },

    properties: {
        toggleAudio : cc.Toggle,
        toggleMusic : cc.Toggle,
    },

    onLoad() {
        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC+"123465") || 1;
        if(isMusic > 0) {
            
        } else {
            if(this.toggleAudio) {
                this.toggleMusic.isChecked = false;
                this.ClickMusic(this.toggleMusic, null);
            }
        }
        let isAudio = cc.sys.localStorage.getItem(CONFIG.KEY_SOUND+"123465") || 1;
        if(isAudio > 0) {
            
        } else {
            if(this.toggleMusic) {
                this.toggleAudio.isChecked = false;
                this.ClickAudio(this.toggleAudio, null);
            }
        }
    },

    Init(slotControl){
        this.slotControl = slotControl;
    },

    ClickMusic(toggle, data) {
        this.slotControl.ChangeStateMusic(toggle.isChecked);

        this.toggleMusic.node.getChildByName("Background").active = !toggle.isChecked;
    },

    ClickAudio(toggle, data) {
        this.slotControl.ChangeStateSound(toggle.isChecked);

        this.toggleAudio.node.getChildByName("Background").active = !toggle.isChecked;
    },
    
    ShowRank(){
        //this.slotControl.menuView.ClickRank();
    },

    ShowHistory(){
        //this.slotControl.menuView.ClickRank();
    },

    Hide(){
        this.node.active = false;
    },
});
