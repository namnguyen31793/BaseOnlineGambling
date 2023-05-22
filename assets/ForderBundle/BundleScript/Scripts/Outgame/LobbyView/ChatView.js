// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: require("ParentChangePositionEDB"),
    

    properties: {
        scrListChat:cc.ScrollView,
        itemChat:cc.Prefab,
        edbChat:cc.EditBox,
    },

    start () {
        this._isStateWatting = false;
        this.resignBegan(this.edbChatTaiXiu);
        this.resignEnded(this.edbChatTaiXiu);
        this.poolChat = new cc.NodePool();
        this.content = this.scrListChat.content;
    },

    addChat(data){
        try {
    // let data = {
            //     Nickname : "Vip123",
            //     ChatContent : "Chat 1 cai gi do",
            //     Type :	1,	//1 chat, 2 thong bao thoat va vao phong, 3 thong bao donate
            //     Gold: 0
            // }
            let parentChat = this.scrListChat.content;
            if(parentChat.childrenCount > 25 ){
                this.poolChat.put(parentChat.children[0]);
            }
            let item = this.getChatPool();
            item.getComponent("ItemChat").initItem(data);
            // parentChat.addChild(item);
            item.parent = parentChat;
            if(!this.node.activeInHierarchy)
                return;
            if(!this._isStateWatting){
                this.scrListChat.stopAutoScroll();
                this.scrListChat.scrollToBottom(0.2);
                this._currentChatMiss = 0;
            }else{
                this._currentChatMiss++;
                // let lbStringMissChat = this.nodeMoveToChat.getComponentInChildren(cc.Label);
                // if(lbStringMissChat ) lbStringMissChat.string = this._currentChatMiss.toString();
            }
        } catch {
            
        }
        
    },

    setHistoryChat(packet){
        this.resetChat();
        //this.scrListChat.resetScr();
        let list = [];
        let length = packet.length;
        let sumHeight = 0;

        let i = length - 13 < 0 ? 0 : length - 13 ;
        let parentChat = this.scrListChat.content;
        for(i ; i < length ; i++){
            let item = this.getChatPool();
            let data = JSON.parse(packet[i]);
            item.getComponent("ItemChat").initItem(data);
            parentChat.addChild(item);
        }
        this.scrListChat.scrollToBottom(0.2);
    },

    getChatPool(){
        let node = null;
        if(this.poolChat.size() > 0){
            node = this.poolChat.get();
        }else{
            node = cc.instantiate(this.itemChat);
        }
        return node;
    },

    resetChat(){
        let children = this.scrListChat.content.children;
        let length = children.length;
        for(let i = 0 ; i < length ; i++){
            this.poolChat.put(children[0]);
        }
    },

    onClickBtnSendChat(){
        let str = this.edbChat.string;
        str = str.trim();
        if(str == ""){
            this.edbChat.string = "";
            return;
        } 
        let data = {
            Nickname : Global.MainPlayerInfo.nickName,
            ChatContent : str,
            Type :	1,
        }
      this.addChat(data);
        this.edbChat.string = "";
    },

    UserChat() {

    },
    
    update (dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        let contentHeight = this.content.height;

        if(this.content.y >= contentHeight - this.scrListChat.node.height/2 -10){
            this._isStateWatting = false;
        }else{
            this._isStateWatting = true;
        }
    

    },
});
