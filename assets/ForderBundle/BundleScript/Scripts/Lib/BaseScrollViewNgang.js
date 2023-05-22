cc.Class({
    extends: cc.Component,
    ctor() {
        this.startContentX = 0;
        this.startPosItem = 0;
        this.widthItem = 0;
        this.cacheScroll = false;
    },

    properties: {
        itemTemplate: { 
            default: null,
            type: cc.Prefab
        },
        nameComponentItem:{
            default:""
        },
        funtionSetInfo:{
            default:"initItem"
        },
        
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        spawnCount: {
            default:0,
            type : cc.Integer
        }, 

        spacing: {
            default : 0,
            type :cc.Integer
        }, 

        isViewBottomFirt:{
            default: false,
        },

        nodeMoveToChat:{
            default:null,
            type:cc.Node
        },

        _listInfo:[],
        _sumHeight:0,
        _isDragScr:true,
        _firtOffsetItem : 0,
        _currentChatMiss:0,
        _isStateWatting:false,
        _init : false,
    },

    // use this for initialization
    onLoad: function () {
        this._init = true;
    	this.content = this.scrollView.content;
        this.items = []; 
        this.updateTimer = 0;
        this.updateInterval = 0.05;
        this.lastContentPosX = 0;
        this._sumHeight = 0;
        this.bufferZone = 0;
        this.itemPool = new cc.NodePool();
        // this.node.on(cc.Node.EventType.TOUCH_START , (touch)=>{
        //     this.isTouch = 1;
        // })

        // this.node.on(cc.Node.EventType.TOUCH_MOVE , (touch)=>{
        //     this.isTouch = 1;
        // })
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL , (touch)=>{
        //     this.isTouch = 2;
        // })

        // this.node.on(cc.Node.EventType.TOUCH_END , (touch)=>{
        //     this.isTouch = 2;
        // })
    },
    getItemPool(){
        if(this.itemPool.size() > 0){
            return this.itemPool.get();
        }else{
            let node = cc.instantiate(this.itemTemplate);
            this.itemPool.put(node);
            return this.itemPool.get();
        }
    },
    resetScr(){
        if(!this._init) return;
        let length = this.content.childrenCount;
        let childs = this.content.children;
        for(let i = 0 ; i < length ; i++){
            this.itemPool.put(childs[0]);
        }
        this.items.length = 0;
        this._listInfo = [];
    },
    init: function (list , sumWidthToTal , _firtWidth) {
        //return;
        
        this.items.length = 0;
        let length = list.length;
        this._listInfo = list ;
        let firtWidth = 0;
        if(length > 0){
            firtWidth  = this._listInfo[0].width || _firtWidth;
        }
        this.firtWidth = firtWidth;
        let spawn = this.spawnCount;
        this.spawnCount = this.spawnCount < length ? this.spawnCount : length;
        
        this.bufferZone = this.scrollView.node.width / 2 + firtWidth;
        this.totalCount = length;
        this._sumHeight = 0;
        let contentWidth = (this.totalCount *   (this.spacing)  ) - this.spacing  + sumWidthToTal;
        this.content.width = contentWidth;
        let content = this.content;
        if(this.isViewBottomFirt){
            this._isStateWatting = false;
            let offsetPositin = contentWidth - this.scrollView.node.width/2;
            if(offsetPositin > 0)  content.x = offsetPositin;
            let start = length - spawn;
            if(start < 0) start = 0;
            let lastNodeHeight = null;
            let lastNodeY = null;
            
            for(let i = length - 1; i >= start ; i--){
                let data = this._listInfo[i];
                let item = this.getItemPool();
                content.insertChild(item , 0);
                let itemCp = item.getComponent(this.nameComponentItem);
                itemCp.itemID = i;
                itemCp[this.funtionSetInfo](data);
                this.items.push(item);
                if(i == (length - 1)){
                    item.setPosition(0, item.width/2 -contentWidth);
                }else{
                    item.setPosition(0, lastNodeY + lastNodeHeight/2 +item.width/2 + this.spacing );
                }
                lastNodeHeight = item.width;
                lastNodeY = item.x;
                this._sumHeight += (item.width + this.spacing);
            }
           
        }else{
            this._isStateWatting = true;
            let lastNodeHeight = null;
            let lastNodeY = null;
            content.x = this.scrollView.node.width/2;
            for (let i = 0 ; i < this.spawnCount; ++i) {
            
                let data = this._listInfo[i];

                let item = this.getItemPool();
                content.addChild(item);
               let itemCp = item.getComponent(this.nameComponentItem);
                itemCp.itemID = i;
                itemCp[this.funtionSetInfo](data);
                this.items.push(item);
                if(i == 0){
                    item.setPosition( - item.width/2,0);
                   
                }else{
                    item.setPosition(lastNodeY - lastNodeHeight/2 - item.width/2 - this.spacing , 0 );
                }
                lastNodeHeight = item.width;
                lastNodeY = item.x;
                this._sumHeight += (item.width + this.spacing);
            }
            
        }
       
    },

    getPositionInView: function (item) { 
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isLeft = this.content.x < this.lastContentPosX; // scrolling direction
        let offset = this._sumHeight ;
        let contentWidth = this.content.width;

       
            if(this.content.x >= contentWidth - this.scrollView.node.width/2 -10){
                this._isStateWatting = false;
                if(this.nodeMoveToChat){
                    this.nodeMoveToChat.active = false;
                }  
            }else{
                if(this.nodeMoveToChat){
                  if(!this.nodeMoveToChat.active) this.nodeMoveToChat.getComponentInChildren(cc.Label).string = "";
                    this.nodeMoveToChat.active = true;
                }  
                this._isStateWatting = true;
            }
        
    

        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isLeft) {
                
                if (viewPos.x < -buffer && items[i].x + offset  < 0) {
                    let firtItem = this.content.children[0];
                    let id = firtItem.getComponent(this.nameComponentItem).itemID;

                    if(id > 0){
                        items[i].setSiblingIndex(0);
                        this._sumHeight  -= items[i].width;
                        let item = items[i].getComponent(this.nameComponentItem);
                        let itemId = id - 1; // update item id
                        item.itemID = itemId;
                        item[this.funtionSetInfo](this._listInfo[itemId]);
                        items[i].x = firtItem.x + firtItem.width/2  + items[i].width/2 + this.spacing;
                        this._sumHeight  += items[i].width;
                        this.CheckItemInView(true);
                    }
                    
                } 
               
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.x > buffer && items[i].x - offset > -contentWidth) {
                    let lastNode = this.content.children[this.content.childrenCount - 1];
                    let id = lastNode.getComponent(this.nameComponentItem).itemID;
                    if(id < this.totalCount - 1){
                        
                        items[i].setSiblingIndex(this.content.childrenCount - 1);
                        this._sumHeight  -= items[i].width;
                        let item = items[i].getComponent(this.nameComponentItem);
                        let itemId = id + 1;
                        item.itemID = itemId;
                        item[this.funtionSetInfo](this._listInfo[itemId]);
                        items[i].x = lastNode.x - lastNode.width/2 - items[i].width/2 - this.spacing;
                        this._sumHeight  += items[i].width;      
                        this.CheckItemInView(true); 
                    }
                    
                    
                }
               
            }
        }
        // update lastContentPosY
        if(this.lastContentPosX == this.scrollView.content.x && !this.scrollView.isScrolling()) {
            this.CheckPosition();
          
        }
        this.cacheScroll = this.scrollView.isScrolling();
        this.lastContentPosX = this.scrollView.content.x;


    },

    CheckPosition() {
        let distance = this.content.x - this.startContentX;
        if(distance ==0)
            return;
        let index = distance/this.widthItem;
        let dolech = index - parseInt(index);
        let x = 0;
        if(dolech >= 0.5)
            x = this.startContentX + (parseInt(index) + 1) * this.widthItem;
        else x = this.startContentX + parseInt(index) * this.widthItem; 
        distance = this.content.x - this.startContentX;
        index = distance/this.widthItem;
        this.content.runAction(cc.moveTo(0.01, cc.v2(x, this.content.y)));
        this.scheduleOnce(()=>{
            distance = this.content.x - this.startContentX;
            index = distance/this.widthItem;
            this.CheckItemInView(false);
        } , 0.02);  
    },

    CheckItemInView(activeOutView) {
        try {
            let time = 0.05;
            let distance = this.content.x - this.startContentX;
            let index = distance/this.widthItem;
            let dolech = index - parseInt(index);
            let x = 0;
            if(dolech >= 0.5)
                index = parseInt(index) + 1;
            else index = parseInt(index);
            let items = this.content.children;
            let maxX = this.startPosItem - index * this.widthItem;
            let minX = this.startPosItem - (index+4) * this.widthItem;
            let listInView = [];
            for(let i = 0; i < items.length; i++) {
                if(items[i].x <= maxX + 20 && items[i].x >= minX - 20) {
                    listInView.push(items[i]);
                    items[i].children[0].active = true;
                    // items[i].getComponent("ItemLobby").SetIndexInView(i);
                }
                else if(items[i].x > maxX) {
                    items[i].children[0].active = activeOutView;
                    items[i].getComponent("ItemLobby").SetIndexInView(-1);
                    items[i].children[0].runAction(cc.spawn(cc.moveTo(time, cc.v2(-106, -13)), cc.scaleTo(time, 1, 0.49), cc.rotate3DTo(time, cc.v3(0, 41, 0))));
                } else if(items[i].x < minX) {
                    items[i].children[0].active = activeOutView;
                    items[i].getComponent("ItemLobby").SetIndexInView(-1);
                    items[i].children[0].runAction(cc.spawn(cc.moveTo(time, cc.v2(77, -10)), cc.scaleTo(time, 1, 0.45), cc.rotate3DTo(time, cc.v3(0, -52, 0))));
                }
            }
            listInView[0].children[0].runAction(cc.spawn(cc.moveTo(time, cc.v2(22, -16)), cc.scaleTo(time, 1, 0.65), cc.rotate3DTo(time, cc.v3(0, 37, 0))));
            listInView[0].getComponent("ItemLobby").SetIndexInView(0);
            listInView[1].children[0].runAction(cc.spawn(cc.moveTo(time, cc.v2(57, -17)), cc.scaleTo(time, 1.1, 0.85), cc.rotate3DTo(time, cc.v3(0, 23, 0))));
            listInView[1].getComponent("ItemLobby").SetIndexInView(1);
            listInView[2].children[0].runAction(cc.spawn(cc.moveTo(time, cc.v2(-15, -17)), cc.scaleTo(time, 0.95, 0.95), cc.rotate3DTo(time, cc.v3(0, 0, 0))));
            listInView[2].getComponent("ItemLobby").SetIndexInView(2);
            listInView[3].children[0].runAction(cc.spawn(cc.moveTo(time, cc.v2(-81, -14)), cc.scaleTo(time, 1, 0.82), cc.rotate3DTo(time, cc.v3(0, -36, 0))));
            listInView[3].getComponent("ItemLobby").SetIndexInView(3);
            listInView[4].children[0].runAction(cc.spawn(cc.moveTo(time, cc.v2(-42, -10)), cc.scaleTo(time, 1, 0.6), cc.rotate3DTo(time, cc.v3(0, -51, 0))));
            listInView[4].getComponent("ItemLobby").SetIndexInView(4);
        } catch {

        }
    },

    Test(numb) {
        this.startContentX = this.content.x;
        this.startPosItem = this.content.children[0].x;
        this.widthItem = this.content.children[0].width;

        this.content.x = this.content.x + numb * this.content.children[0].width;
        this.lastContentPosX = this.content.x;
        for(let i = 0; i < this.content.children.length; i++) {
            this.content.children[i].x = this.content.children[i].x - (numb -1) * this.content.children[i].width;
            let item = this.content.children[i].getComponent(this.nameComponentItem);
            let itemId = numb-1+i;
            item.itemID = itemId;
            item[this.funtionSetInfo](this._listInfo[itemId]);
        }
    },

    Test2() {
        this.CheckItemInView();
    },

    // getHeightItems(){
    //     let length = this.items.length;
    //     let sum = 0;
    //     for(let i = 0 ; i < length ; i++){
    //         sum += (this.items[i].width  + this.spacing );
    //     }

    //     return sum - this.spacing;
    // },
    // scrollEvent: function(sender, event) {
    // //    if(event == 9){
    // //         this._isDragScr = false;
    // //    }else{
    // //         this._isDragScr = true;
    // //    }
    // },

    addItem: function(info) {
        let add = 0;
        if(info.width != null){
            add = info.width;
        }else{
            add = this.firtWidth;
        }
        this._listInfo.push(info);
        this.content.width += (add + this.spacing);
        this.totalCount += 1;
        if(!this._isStateWatting){
            let nodeSet = null;
            let lastNode = this.content.children[this.content.childrenCount - 1];
            if(this.content.childrenCount < this.spawnCount){
                nodeSet = cc.instantiate(this.itemTemplate);
                this.content.addChild(item);
            }else{
                nodeSet = this.content.children[0];
            }
            if(lastNode == null){
                let id = 0;
                nodeSet.setSiblingIndex(this.content.childrenCount - 1);
                this._sumHeight  -= nodeSet.width;
                let item = nodeSet.getComponent(this.nameComponentItem);
                let itemId = id + 1;
                item.itemID = itemId;
                item[this.funtionSetInfo](info);
                nodeSet.x = - nodeSet.width/2;
                this._sumHeight  += nodeSet.width;
            }else{
                let id = lastNode.getComponent(this.nameComponentItem).itemID;
                nodeSet.setSiblingIndex(this.content.childrenCount - 1);
                this._sumHeight  -= nodeSet.width;
                let item = nodeSet.getComponent(this.nameComponentItem);
                let itemId = id + 1;
                item.itemID = itemId;
                item[this.funtionSetInfo](info);
                nodeSet.y = lastNode.y - lastNode.width/2 - nodeSet.width/2 - this.spacing;
                this._sumHeight  += nodeSet.width;
            }
           


            if(this.nodeMoveToChat)this.nodeMoveToChat.active = false;
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToBottom(0.2);
            this._currentChatMiss = 0;
        }else{
            if(this.nodeMoveToChat){
                this.nodeMoveToChat.active = true;
                this._currentChatMiss++;
                let lbStringMissChat = this.nodeMoveToChat.getComponentInChildren(cc.Label);
                if(lbStringMissChat ) lbStringMissChat.string = this._currentChatMiss.toString();
            }
        }

    },
    addListItem(listItem , heights){
        let length = listItem.length;
        this.content.width += (this.spacing * length   + heights );
        this.totalCount += length;
        this._listInfo = this._listInfo.concat(listItem);
    },

    onClickBtnMissChat(){
        this._isStateWatting = false;
        if(this.nodeMoveToChat){
            this.nodeMoveToChat.active = false;
            this.nodeMoveToChat.getComponentInChildren(cc.Label).string = "";
        }
        
        
        this._sumHeight = 0;
        let length = this._listInfo.length;
        let start = length - this.spawnCount;
        let count = this.spawnCount - 1;
        if(start < 0) start = 0;
        let listChild = this.content.children;
        let lastNode = null;
        let contentWidth = this.content.width;
        for(let i = length - 1; i >= start ; i--){
            let data = this._listInfo[i]
            let item = listChild[count];
            count--;
            let itemCp = item.getComponent(this.nameComponentItem);
            itemCp.itemID = i;
            itemCp[this.funtionSetInfo](data);
            if(i == (length - 1)){
                item.setPosition(0, item.width/2 -contentWidth);
            }else{
                
                item.setPosition(0, lastNode.x + lastNode.width/2 +item.width/2 + this.spacing );
            }
            lastNode = item
            this._sumHeight += (data.width + this.spacing);
        }
    
       

        this._currentChatMiss = 0;
        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToBottom(0.2);
    },

    removeItem: function() {
        this.content.width = (this.totalCount - 1) * (this.itemTemplate.width + this.spacing) + this.spacing; 
        this.totalCount = this.totalCount - 1;
        this.moveBottomItemToTop();
    },

    moveBottomItemToTop () {
        let offset = (this.itemTemplate.width + this.spacing) * this.items.length;
        let length = this.items.length;
        let item = this.getItemAtBottom();
        // whether need to move to top
        if (item.x + offset < 0) {
            item.x = item.x + offset;
            let itemComp = item.getComponent(this.nameComponentItem);
            let itemId = itemComp.itemID - length;
            itemComp.updateItem(itemId);
        }
    },

    getItemAtBottom () {
        let item = this.items[0];
        for (let i = 1; i < this.items.length; ++i) {
            if (item.x > this.items[i].x) {
                item = this.items[i];
            }
        }
        return item;
    },

    scrollToFixedPosition: function () {
        this.scrollView.scrollToOffset(cc.v2(0, 500), 2);
    },
    onDestroy(){
        this.itemPool.clear();
    }
});
