cc.Class({
  extends: cc.Component,


  onLoad() {
    // cc.director.
    let tile = cc.winSize.width / cc.winSize.height;
    // if (!cc.sys.isNative && !cc.sys.isMobile) {

    //   // cc.log(document.body.clientHeight + " mutil la " + cc.Canvas.instance.designResolution.width);
    //   if (document.body.clientHeight >= 720) {
    //     cc.Canvas.instance.designResolution = new cc.Size(document.body.clientWidth, document.body.clientHeight);
    //   } else {
    //     let mutil = cc.Canvas.instance.designResolution.height / document.body.clientHeight;
    //     cc.Canvas.instance.designResolution = new cc.Size(document.body.clientWidth * mutil, document.body.clientHeight * mutil);
    //   }


    //   cc.SizeCanvas = cc.Canvas.instance.designResolution;
    // }
    //  cc.log("nhau vao fit height");
    if (tile >= (16 / 9)) {
      //           cc.log("nhau vao fit height");
      cc.Canvas.instance.fitHeight = true;
      cc.Canvas.instance.fitWidth = false;
    } else {
      cc.Canvas.instance.fitHeight = false;
      cc.Canvas.instance.fitWidth = true;
      //        cc.log("nhau vao fit width");
    }
    //cc.NGWlog = cc.log;
  },
});
