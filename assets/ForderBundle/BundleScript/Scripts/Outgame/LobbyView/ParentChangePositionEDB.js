// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initNodeMove(node){
        if(!cc.sys.isNative)return
        this.nodeMove = node;
    },
    resignBegan(edb){
        if(!cc.sys.isNative || edb == null)return
        let eventBegan = new cc.Component.EventHandler();
        eventBegan.target = this.node; 
        eventBegan.component = "ParentChangePositionEDB";
        eventBegan.handler = "editBegan";
        eventBegan.customEventData = "";
        edb.editingDidBegan.push(eventBegan);
    },
    resignEnded(edb){
        if(!cc.sys.isNative || edb == null)return
        let eventEnd = new cc.Component.EventHandler();
        eventEnd.target = this.node; 
        eventEnd.component = "ParentChangePositionEDB";
        eventEnd.handler = "editEnd";
        eventEnd.customEventData = "";
        edb.editingDidEnded.push(eventEnd);
    },


    resignNext(edb , edbNext = ""){
        if(!cc.sys.isNative || edb == null)return
        let eventNext = new cc.Component.EventHandler();
        eventNext.target = this.node; 
        eventNext.component = "ParentChangePositionEDB";
        eventNext.handler = "editNext";
        eventNext.customEventData = edbNext;
        edb.editingReturn.push(eventNext);
        edb.returnType = 5;
    },

    resetEmitNext(edb){
        if(!cc.sys.isNative || edb == null)return;
        edb.editingReturn.length = 0;
    },
    editBegan(event , data){
        // cc.log(event);
         Global.UIManager.checkAndChangePositionEDB(event , this.nodeMove|| this.node )
     },
     editEnd(){
        Global.UIManager.endNodeEDB()
    },
    editNext(event , data){
        if(!cc.sys.isNative)return
        this.scheduleOnce(()=>{
            let edbNext = this[data]
            if(edbNext)edbNext.focus();
        } , 0.2)
        
    }


   

    // update (dt) {},
});
