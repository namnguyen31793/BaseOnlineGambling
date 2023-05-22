

cc.Class({
    extends: require("SlotSoundControl"),

    SetLink() {
        this._super();
        this.bgLink = Sound.SOUND_SLOT.SLOT_TAMQUOC;
        //this.ChangeStateSound(false);
        this.ChangeStateMusic(false);
    },
});
