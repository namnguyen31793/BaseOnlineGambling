

cc.Class({
    extends: cc.Component,

    properties: {
        logs: {
            default: null,
            type: cc.Label
        },
        camera: {
            default: null,
            type: cc.Camera
        },

        iconSprite : cc.Sprite,
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    captureScreen (captureScreenFilePath) {

      

        let node = new cc.Node();
        node.parent = cc.director.getScene();
        let camera = node.addComponent(cc.Camera);
        camera.backgroundColor = cc.Color.TRANSPARENT
        camera.clearFlags = cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL | cc.Camera.ClearFlags.COLOR

        // Set the CullingMask of the screenshot you want
        camera.cullingMask = 0xffffffff;

        // Create a new RenderTexture and set this new RenderTexture to the camera's targetTexture so that the camera content will be rendered to this new RenderTexture
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        // If the Mask component is not included in the screenshot, you don't need to pass the third parameter.
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;

        // Render the camera once, updating the content once into RenderTexture
        camera.render();


        let picData = texture.readPixels();
        cc.log(picData);
        
        let success = false;
        if (jsb.saveImageData) {
            // CocosCreator 2.0.2+ support jsb.saveImageData 
            success = jsb.saveImageData(picData, width, height, captureScreenFilePath);
        }
        return success;
    },

    onLoad () {
        this.initPlugin();
    },
    
    initPlugin() {
        this.initPluginShare();
    },

    initPluginShare() {
        if ('undefined' == typeof sdkbox) {
            this.log('sdkbox is undefined');
            return;
        }

        if ('undefined' == typeof sdkbox.PluginShare) {
            this.log('sdkbox.PluginShare is undefined');
            return;
        }

        const self = this;
        sdkbox.PluginShare.setListener({
            onShareState(response) {
                let str = 'onSharestate:';
                switch(response.platform) {
                    case sdkbox.SocialPlatform.Platform_Unknow: { str += "unknow"; break; }
                    case sdkbox.SocialPlatform.Platform_Twitter: { str += "twitter"; break; }
                    case sdkbox.SocialPlatform.Platform_Facebook: { str += "facebook"; break; }
                    case sdkbox.SocialPlatform.Platform_SMS: { str += "sms"; break; }
                    case sdkbox.SocialPlatform.Platform_Mail: { str += "mail"; break; }
                    case sdkbox.SocialPlatform.Platform_Native: { str += "native"; break; }
                    case sdkbox.SocialPlatform.Platform_Select: { str += "select"; break; }
                    case sdkbox.SocialPlatform.Platform_All: { str += "all"; break; }
                    default: { str += response.platform; break; }
                }

                str += ':';
                switch (response.state) {
                    case sdkbox.SocialShareState.SocialShareStateNone: { str += "none"; break; }
                    case sdkbox.SocialShareState.SocialShareStateUnkonw: { str += "unknow"; break; }
                    case sdkbox.SocialShareState.SocialShareStateBegin: { str += "begin"; break; }
                    case sdkbox.SocialShareState.SocialShareStateSuccess: { str += "success"; break; }
                    case sdkbox.SocialShareState.SocialShareStateFail: { str += "failed"; break; }
                    case sdkbox.SocialShareState.SocialShareStateCancelled: { str += "cancel"; break; }
                    case sdkbox.SocialShareStateSelectShow: { str += "select show"; break; }
                    case sdkbox.SocialShareStateSelectCancelled: { str += "select cancel"; break; }
                    case sdkbox.SocialShareStateSelected: { str += "selected"; break; }
                    default: { str += response.state; break; }
                }

                str += ':';
                str += response.error;
                self.log(str);
            }
        });
        sdkbox.PluginShare.init();
    },

    onButton1() {
        const shareInfo = {};
        shareInfo.text = "#sdkbox(www.sdkbox.com) - the cure for sdk fatigue - from js - " + this.generateRandomStr();
        shareInfo.title = "sdkbox";
        this.captureScreenFilePath = jsb.fileUtils.getWritablePath() + "render_to_sprite_image.png";
        shareInfo.image = this.captureScreenFilePath;
        // shareInfo.image = "https://w88.gg/wp-content/uploads/2020/12/luu-y-khi-choi-game-slot-la-gi.jpg";
        shareInfo.link = "http://www.sdkbox.com";
        shareInfo.platform = sdkbox.SocialPlatform.Platform_Select;
        shareInfo.showDialog = false;
        sdkbox.PluginShare.share(shareInfo);
        /*
        const width = cc.visibleRect.width;
        const height = cc.visibleRect.height;
        let texture = new cc.RenderTexture(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
        // texture.initWithSize(width, height);
        const backupRenderer = this.camera.targetTexture;
        this.camera.targetTexture = texture;
        this.camera.render();
        this.camera.targetTexture = backupRenderer;
        let picData = texture.readPixels();

        let success = false;
        if (cc.sys.isNative && jsb.saveImageData) {
            // CocosCreator 2.0.2+ support jsb.saveImageData 
            success = jsb.saveImageData(picData, width, height, captureScreenFilePath);
        }
        this.iconSprite.spriteFrame.setTexture(texture.getSprite().texture);
        this.captureScreenFilePath = jsb.fileUtils.getWritablePath() + "capturetest.png";
        if (success) {
            this.log("save image data success, file: " + this.captureScreenFilePath);
        } else {
            this.captureScreenFilePath = null;
            this.log("save image data failed!");
        }*/
       

    },

    onButton2() {
        sdkbox.PluginShare.setFileProviderAuthorities("com.sdkbox.test.app.fileprovider");

        const shareInfo = {};
        shareInfo.title = "title";
        shareInfo.text = "down game ngay tai";
        this.captureScreenFilePath = jsb.fileUtils.getWritablePath() + "render_to_sprite_image.png";
        shareInfo.image = this.captureScreenFilePath;
        shareInfo.link = "www.sdkbox.com";
        sdkbox.PluginShare.nativeShare(shareInfo);
    },

    onButton3() {
        this.captureScreenFilePath = jsb.fileUtils.getWritablePath() + "capturetest.png";
        // this.captureScreenFilePath = "/mnt/sdcard/screenshot.png";
        if (this.captureScreen(this.captureScreenFilePath)) {
            this.log("save image data success, file: " + this.captureScreenFilePath);
        } else {
            this.captureScreenFilePath = null;
            this.log("save image data failed!");
        }
    },

    generateRandomStr() {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z'];

        const max = Math.floor(Math.random()*5) + 5; //generate [5, 10)
        let str = '';
        for (let i = 0; i < max; i++) {
            str += alphabet[Math.floor(Math.random()*26)]
        }

        return str;
    },

    log(s) {
        cc.log(s);
        let lines = this.logs.string.split('\n');
        while (lines.length > 5) {
            lines.shift();
        }
        lines.push(s);
        this.logs.string = lines.join('\n');
    },

});
