
cc.Class({
    extends: cc.Component,
    ctor() {
        this.parent = null
        this.pos = null;
    },

    properties: {
       
    },

    start () {
        this.parent = this.node.parent;
        this.pos = this.node.getPosition();
    },

    BackToParent() {
        this.node.parent = this.parent
        this.node.setPosition(this.pos);
    },

    onLoad() {
        Global.ContentMoneyView = this;
    },

    onDestroy(){
		Global.ContentMoneyView = null;
	},
});
