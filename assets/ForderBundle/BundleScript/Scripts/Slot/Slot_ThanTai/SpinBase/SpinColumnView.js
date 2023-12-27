var slotsConfig = require('SlotsConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        nodeParentWildUpper: cc.Node,
        nodeWild: cc.Node,
        spriteIcons: [cc.Sprite],
        skeletonIcons: [sp.Skeleton],
      
        itemSlot_Array: {
            default: [],
            type:  require("SlotItem")
        },
    },



  
    onLoad () {
       
        this.animCol = this.node.getComponent(cc.Animation);
        if(this.nodeWild != null)
            this.nodeParentWild = this.nodeWild.parent;
        this.listStickyWilds = [];//chua sticky wild sau khi tao ra

        var nodeName = this.node.name;         
        var parts = nodeName.split('_'); // Tách chuỗi theo dấu "_"
        if (parts.length === 2) {
            this.colId = parseInt(parts[1]) - 1; // Giá trị số là phần tử thứ 1 (index 1) 
        }
        this.spinController = this.GetSpinController();

        this.icons = this.spinController.getIconView().icons;
        this.freespinIcons = this.spinController.getIconView().fsIcons;
        this.skeletonDataIcons = this.spinController.getIconView().skeletonDataIcons;
        this.skeletonDataIconsFs = this.spinController.getIconView().skeletonDataIconsFs;
        this.icons_Blur = this.spinController.getIconView().icons_blur;

        if(this.nodeWild != null)
        this.skeletonWild = this.nodeWild.getComponent(sp.Skeleton);    

        for(let i=0;i< this.itemSlot_Array.length;i++)
        {
            this.itemSlot_Array[i].SlotItem_SetupParent(this);
        }

    },

    GetSpinController()
    {
        return  require("SlotControllerFactory").getIns().GetCurrentSlotController();
    },

    randomAllIcon: function () {
        //Tat Expand WILD
        if(this.nodeWild != null)
            this.nodeWild.active = false;
        //xem có stickyWild ko thì xoá đi
        if(this.listStickyWilds != null)
        this.listStickyWilds.forEach(function (stickyWild) {
            stickyWild.destroy();
        });

        for (var i = 0; i < 4; i++) {
            this.randomIcon(i);
        }
    },

    randomIcon(indexIcon)
    {
         //neu la freespin mode thi lay icon freespin
         if (this.freeSpinController && this.freeSpinController.getStateFreeSpin()) 
        {
            var length = this.freespinIcons.length;
            do {
                var iconId = Math.floor((Math.random() * length) + 1);
            }
            while (iconId === 2 || iconId === 3);
            this.setIcon(parseInt(indexIcon.toString()), iconId);
        } else {
            length = this.icons.length;
            do
            {               
                iconId = Math.floor((Math.random() * length)+ 1);
            }
            while(this.icons[iconId-1] === null)
            this.setIcon(parseInt(indexIcon.toString()), iconId);
          
        }
    },

    setIcon(indexIcon, iconId)
    {
        if (this.freeSpinController && this.freeSpinController.getStateFreeSpin() && this.freespinIcons && this.skeletonDataIconsFs ) {
            
        }
        else
        {
           
            this.spriteIcons[indexIcon].enabled = true;
            this.spriteIcons[indexIcon].spriteFrame = this.icons[iconId - 1];   
           
        }
    },


    randomIcon_Blur(indexIcon)
    {
         //neu la freespin mode thi lay icon freespin
         if (this.freeSpinController && this.freeSpinController.getStateFreeSpin()) 
        {
            var length = this.freespinIcons.length;
            do {
                var iconId = Math.floor((Math.random() * length) + 1);
            }
            while (iconId === 2 || iconId === 3);
            this.setIcon_Blur(parseInt(indexIcon.toString()), iconId);
        } else {
            length = this.icons.length;
            iconId = Math.floor((Math.random() * length));

            this.setIcon_Blur(parseInt(indexIcon.toString()), iconId);
        }
    },

    setIcon_Blur(indexIcon, iconId)
    {
        if (this.freeSpinController && this.freeSpinController.getStateFreeSpin() && this.freespinIcons && this.skeletonDataIconsFs ) {
            
        }
        else
        {            
        
            this.spriteIcons[indexIcon].enabled = true;
            this.spriteIcons[indexIcon].spriteFrame = this.icons_Blur[iconId - 1];
        }
    },
    spin: function (isNearWin = false) {
     
        this.Column_ResetEffect();
        //Tat Expand WILD
        if(this.nodeWild != null)
        this.nodeWild.active = false;
        
        let seft = this;

        let callBack = ()=>{
          
            seft.animCol.off("finished" , callBack);
            if(seft.spinController.getIsFastSpin())
                this.fastStop();
            else
            {
                this.stop();
            }
           }
           this.animCol.on("finished" ,callBack );
           this.animCol.play("columnSpin");


    },
    finishSpin: function () {
        this.spinController.stopSpinFinish();
        this.playSoundWhenStop();
       
        
    },
    playSoundWhenStop()
    {
        switch (this.colId) {
            case 0:
                require("AudioController").getIns().playSound(cc.AudioTypes.STOP_SPIN_1);
                break;
            case 1:
                require("AudioController").getIns().playSound(cc.AudioTypes.STOP_SPIN_2);
                break;
            case 2:
                require("AudioController").getIns().playSound(cc.AudioTypes.STOP_SPIN_3);
                break;
            case 3:
                require("AudioController").getIns().playSound(cc.AudioTypes.STOP_SPIN_4);
                break;
            case 4:
                require("AudioController").getIns().playSound(cc.AudioTypes.STOP_SPIN_5);
                break;
        }
    },

    stop:  function () {
      
        this.isFastSpin = false;
        this.haveWild = false;
       
        let callBack = ()=>{  
           this.animCol.off("finished" , callBack);
           this.Item_FinishColumnSpin();
           }
           this.animCol.on("finished" ,callBack );
           this.animCol.play("columnStop_Normal");


        this.setData();
    },

    fastStop:  function () {
        this.isFastSpin = true;
        this.haveWild = false;      
        let callBack = ()=>{  
            this.animCol.off("finished" , callBack);
                this.Item_FinishColumnSpin();
            }
            this.animCol.on("finished" ,callBack );
            this.animCol.play("columnStop_Fast");
 
        this.setData();
    },
    setData: function () {
      
        let spinData =  this.spinController.getLastSpinResponseData();
        let matrix = spinData[2];
        let parts = matrix.split("|");
   
        let firstMatrix = parts[0];
      
        let itemArrays = cc.Tool.getInstance().convertStringArrayToIntArray(firstMatrix);

        this.matrixData = cc.Tool.getInstance().listToMatrix(itemArrays, 5);
  
        for (var i = 1; i <= 3; i++) {
            //var iconId = this.matrixData[this.colId][i - 1];
            var iconId = this.matrixData[i - 1][this.colId];           
            //iconId = 0 la co WILD trong cot
            if (iconId === 1) {
                this.haveWild = true;
            }
            this.setIcon(i, iconId);
        }
    },
   
    // goi khi quay xong tat ca 
    Item_FinishSpin()
    {
        this.itemSlot_Array.forEach(function (itemSlot) {
            itemSlot.FinishSpin();
        });
    },
     // ham goi khi quay xong cot 
     Item_FinishColumnSpin()
     {
        this.itemSlot_Array.forEach(function (itemSlot) {
            itemSlot.FinishColumnSpin();
        });
     },
     Column_ResetEffect()
     {

     },
     ShowAnimation_Item()
     {

     }

});
