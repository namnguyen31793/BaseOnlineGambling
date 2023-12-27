// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        content: cc.Label,
        arrow: cc.Node,
        arrow1: cc.Node
    },
    show(title,content,arrow,arrow1)
    {
        if(this.arrow)
            this.arrow.active = false;
        if(this.arrow1)
            this.arrow1.active = false;
        this.content.string = content;
        this.title.string = title;
        this.node.active = true;
        if(this.arrow && arrow !== null && arrow !== undefined)
        {
            this.arrow.active = true;
            this.arrow.scaleX = arrow.scaleX || 1;
            this.arrow.scaleY = arrow.scaleY || 1;
            this.arrow.angle = arrow.angle || 0;
            this.arrow.position = {
                x: arrow.x,
                y: arrow.y
            };
        }
        if(this.arrow1 && arrow1 !== null && arrow1 !== undefined)
        {
            this.arrow1.active = true;        
            this.arrow1.scaleX = arrow1.scaleX || 1;
            this.arrow1.scaleY = arrow1.scaleY || 1;
            this.arrow1.angle = arrow1.angle || 0;
            this.arrow1.position = {
                x: arrow1.x,
                y: arrow1.y
            };
        }
    },
   
    hide() {
        this.node.active = false;
    }

    // update (dt) {},
});
