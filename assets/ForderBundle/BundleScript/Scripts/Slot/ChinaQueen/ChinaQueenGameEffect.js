
cc.Class({
    extends: require("SlotGameEffect"),

    ctor() {
        this.toDoList = null;
        this.isShowBigWin = false;
        this.isShowCurtain = false;
    },

    properties: {
        drgCharacter : dragonBones.ArmatureDisplay,
        imagejackpot : cc.Sprite,
        listImagejackpot : {
            default: [],
            type: cc.SpriteFrame,
        },
        objTextFree : cc.Node,
        isBattle : {
            default: false,
        },
    },
    

    onLoad() {
        this.toDoList = this.node.addComponent("ToDoList");
    },

    ShowWinMoney(winMoney) {
        this._super(winMoney);
        if(this.isShowCurtain)
            return;
        this.isShowBigWin = true;
        this.toDoList.CreateList();
        if(!this.isBattle) {
            this.toDoList.AddWork(()=>this.drgCharacter.playAnimation("bigwin", 0),false);
            this.toDoList.Wait(1.6);
            this.toDoList.AddWork(()=>{
                this.drgCharacter.playAnimation("waiting", 0);
                this.isShowBigWin = false;
            },false);
        } else {
            this.isShowBigWin = false;
        }
        
        this.toDoList.Play();
    },

    PlayAnimPullCurtain(){
        if(this.isShowBigWin)
            return;
        this.isShowCurtain = true;
        this.toDoList.CreateList();
        if(!this.isBattle) {
            this.toDoList.AddWork(()=>{
                this.drgCharacter.playAnimation("active", 0);
            },false);
            this.toDoList.Wait(1.2);
            this.toDoList.AddWork(()=>{
                this.drgCharacter.playAnimation("waiting", 0);
                this.isShowCurtain = false;
            },false);
        }
        this.toDoList.Play();
    },

    SetTypeJackpot(type){
        this.imagejackpot.spriteFrame = this.listImagejackpot[type];
    },

    ShowNotifyFree(freeSpinTurn) {
        this.freeObj.active = true;
        this.lbFree.string = freeSpinTurn + "Lượt";
        this.objTextFree.active = true;
    },

    ShowNotifyWinFree(num) {
        this.freeObj.active = true;
        this.lbFree.string = "+" + Global.Helper.formatNumber(num);
        this.objTextFree.active = false;
    },

    HideNotifyWinFree(){
        this.freeObj.active = false;
    },
});
