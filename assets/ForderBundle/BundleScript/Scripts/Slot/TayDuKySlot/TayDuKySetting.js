// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor() {
        this.slotView = null;
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

    Init(slotView){
        this.slotView = slotView;
    },

    ClickMusic(toggle, data) {
        this.slotView.ChangeStateMusic(toggle.isChecked);

        this.toggleMusic.node.getChildByName("Background").active = !toggle.isChecked;
    },

    ClickAudio(toggle, data) {
        this.slotView.ChangeStateSound(toggle.isChecked);

        this.toggleAudio.node.getChildByName("Background").active = !toggle.isChecked;
    },
    
    ShowRank(){
        this.slotView.menuView.ClickRank();
    },

    ShowHistory(){
        this.slotView.menuView.ClickShowHistory();
    },

    Hide(){
        this.node.active = false;
    },
});
