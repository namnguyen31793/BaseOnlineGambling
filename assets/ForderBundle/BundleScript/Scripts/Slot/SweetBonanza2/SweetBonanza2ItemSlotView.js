cc.Class({
    extends: require("ItemSlotView"),

    ctor() {
        this.toDoList = null;
    },

    properties: {
        multi : cc.Label,
        icon : cc.Sprite,
    },

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    SetValueWild(value){
        this.multi.node.active = true;
        this.multi.string = value;
    },

    HideValueWild(){
        this.multi.node.active = false;
        this.multi.string = "";
    },

    ShowEffectWin() {
        //this._super();
        if(this.idCache == 1){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleFree");
        }else
            this.icon.node.getComponent(cc.Animation).play("AnimScaleItem");
    },

    PlayAnimation(animationName, color, timeScale) {
        //.node.color = color;
        //timeScale
        this.icon.node.getComponent(cc.Animation).play(animationName);
    },

    SetColorActive(color, useSpine) {
        this.isShowSpine = useSpine;
        if(!this.isShowSpine){
            this.icon.node.color = color;
        }else{
            this.skeleton.node.color = color;
        }
    },

    PlayAnimPreWin() {
        if(!this.isShowPreWin) {
            this.isShowPreWin = true;
            if(!this.isShowSpine){
                this.icon.node.getComponent(cc.Animation).play("StartPreWin");
            }else{
                this.skeleton.node.getComponent(cc.Animation).play("StartPreWin");
            }
        }
    },

    EndAnimPreWin() {
        this.isShowPreWin = false;
        if(!this.isShowSpine){
            this.icon.node.getComponent(cc.Animation).play("StopPreWin");
        }else{
            this.skeleton.node.getComponent(cc.Animation).play("StopPreWin");
        }
    },


    CloneImage(item, useSpine) {
        this.isShowSpine = useSpine;
        if(!this.isShowSpine){
            this.icon.spriteFrame = item.icon.spriteFrame;
        }else{
            this.skeleton.skeletonData = item.skeleton.skeletonData;
        }
    },

    
    SetImage(id, multi, ske, tex, sprBig, sprSmall, sprMask, animationName, isActiveAnim = true) {
        this.idCache = id;
        
        this.icon.spriteFrame = sprSmall;

        this.isShowSpine = false;
        this.level = 0;
        this.prizeValue = 0;
        this.sumPrize = 0;
        if(multi != null)
            this.SetValueWild("x"+multi);
        else
            this.HideValueWild();
        
        if(this.prize)
            this.prize.node.active = false;
        if(this.mask) {
            if(sprMask) {
                this.mask.spriteFrame = sprMask;
                this.mask.enabled = true;
            } else {
                this.mask.enabled = false;
            }
        }
        if(isActiveAnim)
            this.icon.node.getComponent(cc.Animation).play("id"+id);
    },

    playAnimWaitAfk(useSpine, animationName, color, timeScale){
        if(this.idCache == 0 || this.idCache > 8)
            return;
        let random =  Global.RandomNumber(0,100);
        if(random < 60)
            return;
        //.node.color = color;
        //timeScale
        this.icon.node.getComponent(cc.Animation).play(animationName);
    },

});
