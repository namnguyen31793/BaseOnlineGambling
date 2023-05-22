

cc.Class({
    extends: cc.Component,

    properties: {
        fullWidth : {
            default : true,
        },

        fullHeight : {
            default : true,
        },

        checkMin : {
            default : true,
        },

        keepRatio : {
            default : false,
        },
    },

    onLoad () {
        let ratio = this.node.width/this.node.height;
        let w = 0, h = 0;
        if(this.fullWidth) {
            w = cc.winSize.width;
            if(w < this.node.width) {
                if(this.checkMin) {
                    w = this.node.width;
                }
            }
            this.node.width = w;
        }
        if(this.fullHeight) {
            h = cc.winSize.height;
            if(h < this.node.height) {
                if(this.checkMin) {
                    h = this.node.height;
                }
            }
            this.node.height = h;
        }

        if(this.keepRatio) {
            let calW = h * ratio;
            if(calW >= w) {
                this.node.width = calW;
            } else {
                let calH = w/ratio;
                if(calH >= h) {
                    this.node.height = calH;
                }
            }
        }

        let cp = this.getComponent(cc.Sprite);
        if(cp){
            cp.sizeMode = 0;
        }

    },

    
});
