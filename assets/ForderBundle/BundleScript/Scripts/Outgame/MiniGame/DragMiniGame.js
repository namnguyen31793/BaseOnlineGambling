// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        _isMoveBtnMiniGame : false,
        _isTouch :false,
        _v2OffsetChange:null,
        _isDrag:false,
        checkShowMiniGame : true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        let offsetX = cc.winSize.width / 2;
        let offsety = cc.winSize.height/2;

        this.node.on(cc.Node.EventType.TOUCH_START , (touch)=>{
            this.node.setSiblingIndex(this.node.parent.children.length-1);
            let v2Touch = cc.v2(touch.getLocation());
             let target = v2Touch.subSelf(cc.v2(offsetX , offsety));
             this._v2OffsetChange = this.node.position.subSelf(target);
            this._isMoveBtnMiniGame = false;
            this._isTouch = true;
            if(this.checkShowMiniGame)
                Global.UIManager.checkShowMiniGame(this.node, false)
            //Global.BtnMiniGame.onClickItem(null,this.gameType , false);
        })

        this.node.on(cc.Node.EventType.TOUCH_MOVE , (touch)=>{
            if(this._isTouch && !this._isDrag ){
                let v2Touch = cc.v2(touch.getLocation()) ;
                let target = v2Touch.subSelf(cc.v2(offsetX , offsety));
                this.node.position = target.add(this._v2OffsetChange) ;
                this._isMoveBtnMiniGame = true;
            }
            
        })

        this.node.on(cc.Node.EventType.TOUCH_CANCEL , (touch)=>{
            this._isTouch = false;
            
          
          
            
            
        })

        this.node.on(cc.Node.EventType.TOUCH_END , (touch)=>{
            this._isTouch = false;
            
        })

    },

    start () {

    },
  
   

    // update (dt) {},
});
