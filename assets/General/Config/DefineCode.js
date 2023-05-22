

var actionEffectClose = function (node, func) {
    let action1 = cc.fadeOut(0.1);
    let action2 = cc.scaleTo(0.15, 0.4)//.easing(cc.easeBackIn());
    let action3 = cc.spawn(action1, action2);
    let action_1 = cc.fadeIn(0);
    let action_2 = cc.scaleTo(0, 1);
    let action_3 = cc.spawn(action_1, action_2);
    let action = cc.sequence(action3, action_3, cc.callFunc(() => {
    }), cc.callFunc(func));
    node.runAction(action);
};
