// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gradientBot: cc.Node,
        gradientTop: cc.Node,
        tutorialSteps: {
            type: cc.Asset,
            default: null
        },
        indicator: cc.Node,
        tutorialText: {  
            type: cc.Asset,
            default: null
        },
        buttonSkip: cc.Node,
        timeDelayStart: 1,
        isDebug: false,
        dialog: require("TutorialDialog"),
        ParentObject : cc.Node,
        tutorialClick  : cc.Node,
    },

    setMainController(mainController)
    {
        this.mainController = mainController;
        this.mainController.setTutorialView(this);
        
    },
    onLoad()
    {
      this.finished = true;
    },
    onEnable()
    {
        this.dialog.node.active = false;
        this.gradientBot.active = false;
        this.gradientTop.active = false;
        this.tutorialClick.active = false;
        this.buttonSkip.active = false;
    },
    startTutorial()
    {
        var self = this;
        this.tutorialClick.active = true;
        this.finished = false;
        this.buttonSkip.active = true;
        this.scheduleOnce(function () {
            self.reset();
            self.run();            
        },this.timeDelayStart);
    },
    init()
    {
        this.flags = [];  
        this.listLockedObjects = [],
        this.listLockedObjectData = [],
        this.unlockAll();
       
    },
    unlockAll()
    {
        this._hideDialog();
        this._hideIndicator();
        this._unlockButton(),
        this._unlockTouch(),
        this._unlockAllObjects(),
        this.gradientBot.active = false;
        this.gradientTop.active = false;
        this.buttonSkip.active = false;
    },
    reset: function () {
        this.index = 0,
        this.flags = []
    },

    run: function () {
        // Loop through each step in the tutorial
        for (let i = this.index; i < this.tutorialSteps.json.Steps.length; i++) {
          this.currentStepData = this.tutorialSteps.json.Steps[i];
      
          // Check if step data exists
          if (!this.currentStepData) {
            console.error("Something wrong - missing step data!");
            break;
          }
      
          // Skip step marked as "_waitFor"
          if (this.currentStepData.command === "_waitFor") {
            break;
          }
      
          // Execute the current step's command
          this.resolve(this.currentStepData);
          this.index++;
      
          // Check if all steps have been completed
          if (this.index >= this.tutorialSteps.json.Steps.length) {
            this.hideTutorial();
            this.finished = true;
            return;
          }
        }
      
        // Update waiting trigger for the next step
        this.waitingTrigger = this.currentStepData.data.trigger;
      
        // Debug information about waiting trigger
        if (this.isDebug) {
          console.warn("%c waiting for: %s", "color:red;", this.waitingTrigger);
        }
    },
    trigger: function (triggerEvent) {
        // Check if there is a waiting trigger and if it matches the current event
        if (this.waitingTrigger && this.waitingTrigger.some(e => e === triggerEvent)) {
          // Trigger event matches, advance to next step
          this.index += 1;
      
          if (this.index < this.tutorialSteps.json.Steps.length) {
            this.run(); // Continue tutorial
          } else {
            this.hideTutorial(); // End tutorial
          }
        }
      
        // Handle specific trigger events
        switch (triggerEvent) {
          case "ON_CUTSCENE_CLOSE":
            if (this.jackpotReset) {
              this.runJackpot();
              this.jackpotReset = false;
            }
            break;
      
          case "GAME_RESET_SESSION":
            this._isSpinning = false;
            if (this.doActionAfterFinishSpin) {
              this._activeBet({ active: true });
              this.endTutorialData = true;
              this.finished = true;
              this.doActionAfterFinishSpin = false;
            }
      
            if (this.trialSessionCount >= this.maxDemoTime) {
              this.mainDirector.showPopupRedirect();
              this.trialSessionCount = 0;
            }
            break;
      
          case "NORMAL_GAME_RESTART":
            this.trialSessionCount += 1;
            break;
      
          case "SPIN_CLICK":
            this._isSpinning = true;
            break;
        }
      },

    resolve(t) {
        // Kiểm tra sự tồn tại và kiểu của lệnh
        //this.hasOwnProperty(t.command) && 
        if (typeof this[t.command] === "function") {
          // Thực thi lệnh
          if (this.isDebug) {
            console.warn(t.command, JSON.stringify(t.data, null, "\t"));
          }
          this[t.command](t.data);
        } else {
          // Báo lỗi
          console.error("Không tìm thấy lệnh " + t.command);
        }
      },

      _activeBet: function (t) {
        this.mainController.activeBetBtn(t.active);
    },
    _showDialog(data)
    {
        var subTitle = data.title,
        subContent = data.content,
        position = data.position,
        arrow = data.arrow,
        arrow2 = data.arrow2,
        backgroundReverse = data.backgroundReverse;
        
        title = this.getText(subTitle),
        content = this.getText(subContent);
        this.dialog.node.setPosition(position);
        this.dialog.show(title,content,arrow,arrow2);
        this.dialog.node.scale = .1;
        this.dialog.node.runAction(cc.sequence(cc.scaleTo(.2, 1.2), cc.scaleTo(.1, .9), cc.scaleTo(.1, 1)));
    },
    _hideDialog: function () {
        this.dialog.hide()
    },
    _showIndicator: function (data) {
        var rotation = data.rotation,
            position = data.position;
        this.indicator.active = true,
        this.indicator.angle = rotation,
        this.indicator.position = position,
        this.playIndicatorAnim(rotation)
    },
    _hideIndicator: function () {
        this.indicator.active = false,
        this.indicator.stopAllActions()
    },
    playIndicatorAnim: function (rotation) {
      
        this.indicator.stopAllActions();
        switch (rotation)
        {
        case 90:
            this.indicator.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.5, 50, 0), cc.moveBy(.5, -50, 0))));
            break;
        case -90:
            this.indicator.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.5, -50, 0), cc.moveBy(.5, 50, 0))));
            break;
        case 180:
            this.indicator.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.5, 0, 50), cc.moveBy(.5, 0, -50))));
            break;
        default:
            this.indicator.runAction(cc.repeatForever(cc.sequence(cc.moveBy(.5, 0, -50), cc.moveBy(.5, 0, 50))))
        }
    },
    getText: function (content) {
        return this.tutorialText && this.tutorialText.json && this.tutorialText.json[content] ? this.tutorialText.json[content] :content
    },
    _lockAtButton: function(t) {
        var e = t.objPath
          , i = cc.find(e);
        i ? this.doLockObject(i) : cc.warn("TutorialMgr cant find object with path " + e)
    },
    _lockAtObjects: function(t) {
        var e = this
          , i = t.listPath;
        this.listLockedObjects && this.listLockedObjects.length && this._unlockAllObjects(),
        i && i.length && (i.forEach(function(t) {
            var i = cc.find(t)
              , n = i.parent.convertToWorldSpaceAR(i.position);
            e.listLockedObjects.unshift(i),
            e.listLockedObjectData.unshift({
                lockObjectActive: i.active,
                lockObjectColor: i.color,
                lockObjectParent: i.parent,
                lockObjectLocalPos: i.position,
                lockObjectPosition: n,
                lockObjectIndex: i.getSiblingIndex(),
                lockObjetOpacity: i.opacity
            }),
            i.parent = e.node,
            i.setSiblingIndex(e.gradientTop.getSiblingIndex()),
            i.position = e.node.convertToNodeSpaceAR(n),
            i.active = true,
            i.color = cc.Color.WHITE,
            i.opacity = 255
        }),
        this.gradientBot.active = true,
        this.gradientBot.opacity = 0,
        this.gradientBot.runAction(cc.fadeTo(.1, 160)))
    },
    _unlockAllObjects: function() {
        var t = this;
        this.listLockedObjects && this.listLockedObjects.length && (this.gradientBot.active = !1,
        this.listLockedObjects.forEach(function(e, i) {
            var n = t.listLockedObjectData[i];
            e.parent = n.lockObjectParent,
            e.position = n.lockObjectLocalPos,
            e.setSiblingIndex(n.lockObjectIndex),
            e.active = n.lockObjectActive,
            e.color = n.lockObjectColor,
            e.opacity = n.lockObjetOpacity
        }),
        this.listLockedObjects = [],
        this.listLockedObjectData = [])
    },
    doLockObject: function(t) {
        this.lockObject && this._unlockButton(),
        this.lockObject = t,
        this.lockObjectActive = t.active,
        this.lockObjectColor = t.color,
        this.lockObjectParent = this.lockObject.parent,
        this.lockObjectLocalPos = this.lockObject.position,
        this.lockObjectPosition = this.lockObjectParent.convertToWorldSpaceAR(this.lockObjectLocalPos),
        this.lockObjectIndex = this.lockObject.getSiblingIndex(),
        this.lockObjetOpacity = this.lockObject.opacity,
        this.lockObject.parent = this.ParentObject,
        this.lockObject.setSiblingIndex(this.gradientTop.getSiblingIndex()),
        this.lockObject.position = this.node.convertToNodeSpaceAR(this.lockObjectPosition),
        this.lockObject.active = true,
        this.lockObject.color = cc.Color.WHITE,
        this.lockObject.opacity = 255,
        this.gradientBot.active = true,
        this.gradientBot.opacity = 0,
        this.gradientBot.runAction(cc.fadeTo(.1, 160))
    },
    _unlockButton: function() {
        this.lockObject && (this.gradientBot.active = false,
        this.lockObject.parent = this.lockObjectParent,
        this.lockObject.position = this.lockObjectLocalPos,
        this.lockObject.setSiblingIndex(this.lockObjectIndex),
        this.lockObject.active = this.lockObjectActive,
        this.lockObject.color = this.lockObjectColor,
        this.lockObject.opacity = this.lockObjetOpacity,
        this.lockObject = null)
    },
    _lockTouch: function (t) {
      this.gradientTop.opacity = t && t.gradient ? 180 : 0,
          this.gradientTop.active = true
          this.tutorialClick.active = true;
    },
    _unlockTouch: function() {
      this.gradientTop.active = false;
      this.tutorialClick.active = false;
    },
    onTutorialClick: function () {
      this.trigger("TUTORIAL_CLICK")
    },
    onTutorialFinish: function () {
      this.finished = true;

    },
    _forceSetBetValue: function (t) {
      this.mainController.reloadRoomID(parseInt(t));
    },
    
    _updateJackpot: function () {
      this.mainController.reloadJackpot();
    }, 
    _enableButton: function (t) {
      var e = t.objPath,
          i = cc.find(e);
      i && (i.getComponent(cc.Button).interactable = true)
    },
    _disableButton: function (t) {
      var e = t.objPath,
          i = cc.find(e);
      i && (i.getComponent(cc.Button).interactable = false)
    },
    _lockAtSymbol: function (t) {
      var e = t.x,
          i = t.y,
          n = t.path,
          o = void 0 === n ? "SlotTable/Table/Reel_" : n,
          a = t.extendPath,
          s = cc.find(o + i, this.mainDirector.currentGameMode).getComponent("SlotReel").getShowSymbol(e),
          r = null;
      (r = a ? cc.find(a, s) : s) && this.doLockObject(r)
   },
  _addBoolFlag: function (t) {
      var e = t.flag;
      this.flags.push(e)
  },
  _removeBoolFlag: function (t) {
      var e = t.flag;
      this.flags = this.flags.filter(function (t) {
          return t != e
      })
  },
  isContainFlag: function (t) {
    return this.flags.indexOf(t) >= 0
  },
  _resumeCurrentScript: function() {
    //this.mainDirector && this.mainDirector.currentGameMode.emit("RUN_CONTINUE_SCRIPT");
  },
  hideTutorial: function() {
    this.unlockAll(),
    this.flags = [],
    this._resumeCurrentScript()
  },
  skipTutorial: function (t) {
    
        this.index = this.tutorialSteps.json.Steps.length;
        this.endTutorialData = true,
            this.finished = true,
            this._activeBet({
                active: true
            });
        this.node.stopAllActions(),
        this.hideTutorial()
  },
});
