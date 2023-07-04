cc.Class({
    extends: cc.Component,

	request(link, data, event) {
		cc.log(link);
		this.config_links = link;
		this.cors_url = "";
		var http = new XMLHttpRequest();
		http.open("POST", this.cors_url + this.config_links, true);
		http.setRequestHeader('Content-Type', 'application/json');
		http.setRequestHeader('client-version', CONFIG.VERSION);
		http.setRequestHeader('language', "eng");
		http.setRequestHeader('os-type', this.GetPlatFrom());;
		http.setRequestHeader('device-client-id', Global.deviceId);
		http.setRequestHeader('merchantid', CONFIG.MERCHANT);
		http.setRequestHeader('Authorization', Global.CookieValue);
		http.withCredentials = true;
		http.onreadystatechange = () => {//Call a function when the state changes.
		  if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
			  
			  try{
				//  cc.log(cc.sys.localstorge);
				//cc.log(getCookie(CONFIG.COOKIENAME));
			  } catch(err) {
				  
			  }
			 
			  //Global.CookieValue = this.getCookieV2(CONFIG.COOKIENAME);
			//  cc.log("cookie:"+Global.CookiValue);*/
			  event(http.responseText);
			 // return http.responseText;
			//this.reviceConfig(http.responseText);
		  }
		}
		
		http.send(JSON.stringify(data));
		var self = this;
		http.onerror = function () {
		  setTimeout(() => {
			self.request(link, data, event);
		  }, 500)
		}
	  },

	  requestGet(link, data, event) {
		  cc.log(link);
		  this.config_links = link;
		  this.cors_url = "";
		  var http = new XMLHttpRequest();
		  http.open("GET", this.cors_url + this.config_links, true);
		  http.setRequestHeader('Content-Type', 'application/json');
		  http.setRequestHeader('client-version', CONFIG.VERSION);
		  http.setRequestHeader('language', "eng");
		  http.setRequestHeader('os-type', this.GetPlatFrom());;
		  http.setRequestHeader('device-client-id', Global.deviceId);
		  http.setRequestHeader('merchantid', CONFIG.MERCHANT);
		  http.setRequestHeader('Authorization', Global.CookieValue);
		  http.withCredentials = true;
		  http.onreadystatechange = () => {//Call a function when the state changes.
			if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
				
				try{
				
				} catch(err) {
					
				}
			   
				event(http.responseText);
			  
			}
		  }
		  
		  http.send(JSON.stringify(data));
		  var self = this;
		  http.onerror = function () {
			setTimeout(() => {
			  self.requestGet(link, data, event);
			}, 500)
		  }
		},
	  
	getCookie(name)
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return arr[2];
		else
			return null;
	},

	  
	  getCookieV2(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		cc.log("decode:"+decodedCookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	},
	  
	  getCapcha(base64, node) {
        if (cc.sys.isNative) {
            const buffer = new Buffer(base64, 'base64');
            const len = buffer.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = buffer[i];
            }

            const extName = 'png';
            const randomFileName = 'base64_img.' + extName;
            const dir = `${jsb.fileUtils.getWritablePath()}${randomFileName}`;
            cc.loader.release(dir);
            if (jsb.fileUtils.writeDataToFile(bytes, dir)) {
                cc.loader.load(dir, (err, texture) => {
                    if (!err && texture) {
                        node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }
                });
            }
        } else {
            var src = 'data:image/png;base64,' + base64;
            var imgElement = new Image();
            imgElement.src = src;
            setTimeout(function () {
                var sprite = new cc.Texture2D();
                sprite.initWithElement(imgElement);
                sprite.handleLoadedTexture();
                var spriteFrame = new cc.SpriteFrame(sprite);
                node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }, 10);

        }
	},

	GetPlatFrom() {
        if (cc.sys.isBrowser) return "1";//CONFIG.SOURCE_ID_WEB;
        switch (cc.sys.os) {
             case cc.sys.OS_ANDROID:
                 return "3";//CONFIG.SOURCE_ID_ANDROID;
             case cc.sys.OS_IOS:
                 return "2";//CONFIG.SOURCE_ID_IOS;
             case cc.sys.OS_WINDOWS:
                 return "4";//CONFIG.SOURCE_ID_PC;
         }
    },

	onLoad() {
        Global.BaseNetwork = this;
	},
	
	onDestroy(){
		Global.BaseNetwork = null;
    },
});