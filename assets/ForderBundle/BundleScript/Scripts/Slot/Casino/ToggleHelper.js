

cc.Class({
    extends: cc.Component,

    properties: {
        img : cc.Node,
        myToggle : cc.Toggle,
    },

    ClickToggle(toggle, data) {
        if(toggle.isChecked) {
            this.img.active = false;
        } else {
            this.img.active = true;
        }
    },

    Active() {
        if(this.myToggle.isChecked) {
            this.img.active = false;
        } else {
            this.img.active = true;
        }
    },

    Select() {
        this.myToggle.isChecked = true;
        this.Active();
    },

    UnSelect() {
        this.myToggle.isChecked = false;
        this.Active();
    },
});
