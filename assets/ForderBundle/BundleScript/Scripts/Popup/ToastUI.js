
cc.Class({
    extends: cc.Component,
    ctor() {
        this.timeShow = 0;
        this.isAction = false;
    },

    properties: {
        lbDescription : cc.RichText,
        bg : cc.Node,
    },

    show(message) {
        console.log("show toast");
        this.node.y = -300;
        this.node.opactity = 255
        this.lbDescription.string = message;
        this.node.setSiblingIndex(this.node.parent.children.length-1);
		this.node.active = true;
        this.scheduleOnce(()=>{
            this.bg.width = this.lbDescription.node.width + 40;
        } ,  0.01);
        this.timeShow = 0;
        this.isAction = false;
    },

    update(dt) {
        this.timeShow += dt;
        if(this.timeShow >= 3 && !this.isAction) {
            this.isAction = true;
            this.node.runAction(cc.fadeOut(0.5));
        }
        if(this.timeShow >= 3.5) {
            this.timeShow = 0;
            this.node.active = false;
        }
    },

    onDestroy() {
        Global.Toast = null;
    },
});
