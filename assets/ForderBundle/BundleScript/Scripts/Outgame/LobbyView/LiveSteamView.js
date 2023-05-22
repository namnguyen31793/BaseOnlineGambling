import List from "List";

cc.Class({
  extends: cc.Component,
  ctor() {
    this.listUser = null;
    this.room = null;
    this.dataLike = null;
    this.listRandomChatStr = ["hay quá", "phải like thôi", "đả đảo bhmedia", "nhạc nghe được đấy", "chán quá",
    "tìm gấu đây", "em nè anh", "ai game không", "chánnnn", "u là trời", "sao ít view thế", "spam hoài", 
    "thích thế đấy", "pằng pằng", "cs chính tả đây", "wibu never die", "up tiktok đây", "ai lq ko", "tốc chiến đi",
    "hacker đây", "bố xin mày", "ko ai donate à", "nhạt nhẽo quá", "im hết coi", "đổi nhạc đi", "bắn cá đê"];
    this.listValueDonate = [5000,10000,20000,30000,50000,100000];
    this.currentSelectValue = 5000;
  },

  properties: {
    TitleChannel : cc.Label,
    ViewChannelLb : cc.Label,
    LiveChatView :  require("ChatView"),
    TopDonateView :  require("TopDonateLiveControl"),
    lbLike : cc.Label,
    lbDislike : cc.Label,
    btnLike:cc.Toggle,
    btnDislike:cc.Toggle,
    animDonate : cc.Animation,
    btnHideDonate : cc.Node,
    listLbValue : [cc.Node],
  },

  start() {
    this.schedule(() => {
      if(this.listUser != null) {
        this.SetViewChannel(this.listUser.GetCount());
        this.room.listUser = this.listUser;
      }
    }, 1);
    // this.EventRoom();
  },

  SetTitleChannel(title){
      this.TitleChannel.string = title;
      this.UpdateTopDonate();
  },

  SetViewChannel(number){
    this.ViewChannelLb.string = Global.Helper.formatNumber(number+1);
  },

  ResetChat(){
    this.LiveChatView.resetChat();
  },

  // let data[1] = {
  //  AccountId : 0,
  // 	Nickname : "Vip123",
  // 	Gold : 1000,
  // }
  InitTopDonate(data){
      this.TopDonateView.SetupTopDonate(data);
  },

  OnJoinRoom() {
    // this.scheduleOnce(()=>{
    //   let data = {
    //     Nickname : Global.MainPlayerInfo.nickName,
    //     ChatContent : "đã vào phòng",
    //     Type :	2,	//1 chat, 2 thong bao thoat va vao phong, 3 thong bao donate
    //     }
    //   this.LiveChatView.addChat(data);
    // }, 0.5)
    this.scheduleOnce(()=>{
      this.EventRoom();
    }, 1)
  },

  OnQuitRoom() {
    this.unscheduleAllCallbacks();
  },

  SetListUser(listUser, room, dataLike) {
    this.dataLike = dataLike;
    this.listUser = listUser;
    this.room = room;
    this.UpdateLike();
    if(this.dataLike.state == 1) {
      this.btnLike.isChecked = true;
      this.btnDislike.isChecked = false;
    } else if(this.dataLike.state == 2) {
      this.btnLike.isChecked = false;
      this.btnDislike.isChecked = true;
    } else {
      this.btnLike.isChecked = false;
      this.btnDislike.isChecked = false;
    }
    this.room.UpdateView();
  },

  UpdateLike() {
    this.lbLike.string = Global.Helper.formatNumber(this.dataLike.like);
    this.lbDislike.string = Global.Helper.formatNumber(this.dataLike.dislike);
    this.room.dataLike = this.dataLike;
  },

  EventRoom() {
    let timeWait = Global.RandomNumber(1,6);
    this.scheduleOnce(()=>{
      let r = Global.RandomNumber(0,100);
      let user = this.GetRandomUser();
      if(r < 40) {
        //chat
        let data = {
              Nickname : user.nickName,
              ChatContent : this.GetRandomChat(),
              Type :	1,	//1 chat, 2 thong bao thoat va vao phong, 3 thong bao donate
          }
        this.LiveChatView.addChat(data);
      } else if(r < 60) {
        //add user
        let newUser = this.CreateRandomUser();
        this.listUser.Add(user);
        let data = {
          Nickname : newUser.nickName,
          ChatContent : "đã vào phòng",
          Type :	2,	//1 chat, 2 thong bao thoat va vao phong, 3 thong bao donate
          }
        this.LiveChatView.addChat(data);
        this.SetViewChannel(this.listUser.GetCount());
      } else if(r < 70) {
        //remove user
        if(user != null) {
          let data = {
            Nickname : user.nickName,
            ChatContent : "đã thoát phòng",
            Type :	2,	//1 chat, 2 thong bao thoat va vao phong, 3 thong bao donate
            }
            this.listUser.RemoveAt(user.index);
            this.LiveChatView.addChat(data);
            this.SetViewChannel(this.listUser.GetCount());
        }
      } else if(r < 100) {
        //donate
        let donate = this.GetRandomDonate();
        let data = {
          Nickname : user.nickName,
          ChatContent : Global.Helper.formatNumber(donate),
          Type :	3,	
          }
          this.LiveChatView.addChat(data);
          this.listUser.listValue[user.index].totalDonate += donate;
          this.UpdateTopDonate();
      }
      this.EventRoom();
  }, timeWait)

  },

  GetRandomUser() {
    if(this.listUser.GetCount() == 0)
      return null;
    let index = Global.RandomNumber(0, this.listUser.GetCount());
    let user = this.listUser.Get(index);
    user.index = index;
    return user;
  },

  GetRandomDonate() {
    let c = Global.RandomNumber(0,100);
    if(c < 40)
      return this.listValueDonate[0];
    if(c < 60)
      return this.listValueDonate[1];
    if(c < 75)
      return this.listValueDonate[2];
    if(c < 85)
      return this.listValueDonate[3];
    if(c < 93)
      return this.listValueDonate[4];
    return this.listValueDonate[5];
  },

  CreateRandomUser() {
    let id = Global.RandomNumber(1000,50000);
    let r = Global.RandomNumber(0,100);
    let donate = 0;
    if(r > 50) {
        donate = Global.RandomNumber(0,101) * 1000;
    }
    let user = {
        nickName : "Vip"+id,
        id : id,
        totalDonate : donate
    };
    return user;
  },

  GetRandomChat() {
    return this.listRandomChatStr[Global.RandomNumber(0, this.listRandomChatStr.length)];
  },

  ClickLike() {
    if(this.btnLike.isChecked) {
      this.dataLike.like += 1;
      this.dataLike.state = 1;
      if(this.btnDislike.isChecked) {
        this.dataLike.dislike -= 1;
        this.btnDislike.isChecked = false;
      }
    } else {
      this.dataLike.state = 0;
      this.dataLike.like -= 1;
    }
    this.UpdateLike();
  },

  ClickDislike() {
    if(this.btnDislike.isChecked) {
      this.dataLike.dislike += 1;
      this.dataLike.state = 2;
      if(this.btnLike.isChecked) {
        this.dataLike.like -= 1;
        this.btnLike.isChecked = false;
      }
    } else {
      this.dataLike.state = 0;
      this.dataLike.dislike -= 1;
    }
    this.UpdateLike();
  },

  ClickShowDonate() {
    this.btnHideDonate.active = true;
    this.animDonate.play("ShowDonate");
  },

  ClickHideDonate() {
    this.btnHideDonate.active = false;
    this.animDonate.play("HideDonate");
  },

  ClickSelectValue(event , data) {
    for(let i = 0; i < this.listLbValue.length; i++) {
      this.listLbValue[i].color = new cc.Color(0,122,255);
    }
    event.getComponentInChildren(cc.Label).node.color = cc.Color.WHITE;
    this.currentSelectValue = parseInt(data);
  },

  ClickConfirmDonate() {
    this.ClickHideDonate();
    this.dataLike.currentDonate += this.currentSelectValue;
    let data = {
      Nickname : Global.MainPlayerInfo.nickName,
      ChatContent : Global.Helper.formatNumber(this.currentSelectValue),
      Type :	3,	
      }
      this.LiveChatView.addChat(data);
      this.UpdateTopDonate();
  },

  UpdateTopDonate() {
    let listAll = new List();
    listAll.CloneOtherList(this.listUser);
    let me = {
      nickName : Global.MainPlayerInfo.nickName,
      id : Global.MainPlayerInfo.accountId,
      totalDonate : this.dataLike.currentDonate
    }
    listAll.Add(me);
    let listTop = [];
    let index1 = this.GetTopInList(listAll.listValue);
    listTop[0] = {
      AccountId : listAll.Get(index1).id,
      Nickname : listAll.Get(index1).nickName,
      Gold : listAll.Get(index1).totalDonate
    }
    listAll.RemoveAt(index1);

    let index2 = this.GetTopInList(listAll.listValue);
    listTop[1] = {
      AccountId : listAll.Get(index2).id,
      Nickname : listAll.Get(index2).nickName,
      Gold : listAll.Get(index2).totalDonate
    }
    listAll.RemoveAt(index2);

    let index3 = this.GetTopInList(listAll.listValue);
    listTop[2] = {
      AccountId : listAll.Get(index3).id,
      Nickname : listAll.Get(index3).nickName,
      Gold : listAll.Get(index3).totalDonate
    }
    this.InitTopDonate(listTop);
  },

  GetTopInList(list) {
    let max = 0;
    let index = 0;
    for(let i = 0; i < list.length; i++) {
      if(list[i].totalDonate >= max) {
        max = list[i].totalDonate;
        index = i;
      }
    }
    return index;
  },

  onDestroy() {
    Global.LiveStreamView = null;
  },

  Reset(){
    cc.log("Reset ");
    this.TitleChannel.string = "";
    this.ViewChannelLb.string ="";
    this.lbLike.string ="";
    this.lbDislike.string ="";
  },
});
