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
  
       // sfdsfdsf();
        
        cc.log("this.idCache: "+this.idCache);
        if(this.idCache == 1){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleFree");
        }  
        else if(this.idCache == 2){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleBoom");
        }   
        else if(this.idCache == 3){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleHeart");
        }else if(this.idCache == 4){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleKeoThach");
        }
        else if(this.idCache == 5){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleLuc");
        }
        else if(this.idCache == 6){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleLam");
        }
        else if(this.idCache == 7){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleTao");
        }
        else if(this.idCache == 8){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleDao");
        }
        else if(this.idCache == 9){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleDuaHau");
        }
        else if(this.idCache == 10){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleNho");
        }
        else if(this.idCache == 11){
            this.icon.node.getComponent(cc.Animation).play("AnimScaleChuoi");
        }
        else
            this.icon.node.getComponent(cc.Animation).play("AnimScaleItem");
    },

    ShowEffectBoom() {
        //this._super();
    //    cc.log(">>>>  ShowEffectBoom: "+this.idCache);
     //   this.icon.node.getComponent(cc.Animation).play("animMinNo");
      this.icon.node.getComponent(cc.Animation).play("AnimScaleBoom");
        this.multi.node.active = false;
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
        this.icon.node.scale = 1;

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
