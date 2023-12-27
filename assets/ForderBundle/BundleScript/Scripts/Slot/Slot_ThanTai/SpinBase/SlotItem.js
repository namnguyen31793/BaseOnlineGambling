// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    ctor()
    {
        this.ParentColumn = null;
    },

    properties: {
        slotItem_Img : cc.Sprite,
        slotItem_Animation : sp.Skeleton,
    },
    onLoad()
    {
        this.itemAnimation = this.node.getComponent(cc.Animation);     
        this.SetupWhenOnLoad();
    },
    SetupWhenOnLoad()
    {
        this.slotItem_Img.node.active = true
        this.slotItem_Animation.node.active = false;
    },
    SlotItem_SetupParent(parentColumn)
    {
        this.ParentColumn = parentColumn;
    },

    SlotItem_Setup(itemId,parentColumn,itemIndex = 0)
    {
        this.ParentColumn = parentColumn;
        this.itemId = itemId;
        this.AfterSetup(itemIndex);
        this.SetItem_Img();
        this.SetItem_Animation();
        this.FinishSetup();
    },

    AfterSetup(itemIndex)
    {
        // danh cho nhung game xu ly item theo quy dinh
        this.itemIndex =  itemIndex;
    },
    ResetInfo()
    {
        this.ParentColumn = null;
        this.itemId = -1;
    },
    Item_ResetEffect()
    {

    },
    FinishSetup()
    {

    },

    SetItem_Img()
    {
      
    },

    SetItem_Animation()
    {
    
    },

    FinishSpin()
    {

    },
     // goi khi cot quay xong 
     FinishColumnSpin()
     {
 
     }

    
    
});
