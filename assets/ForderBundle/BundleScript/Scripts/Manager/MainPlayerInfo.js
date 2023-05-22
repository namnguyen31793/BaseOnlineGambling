cc.Class({
    extends: cc.Component,
	ctor() {
		this.accountId =  null;
		this.userName = null;
		this.nickName = null;
		this.vipLevel = 0;
		this.ingameBalance = 0;
		this.diamondBalance = 0;
		this.phoneNumber = null;
		this.vipPoint = 0;
		this.timeCountTx = -1;
		this.listMail = null;
		this.numbetMailNotRead = 0;
		this.realMoneyBalance = 0;
		this.level = 0;
		this.spriteAva = null;
		this.vip = 0;
	},

	SetAvatar(spriteAva) {
		this.spriteAva = spriteAva;
	},

	SetUpInfo(userProperties)	{
		this.accountId = userProperties.AccountId;
		this.userName = userProperties.UserName;
		this.nickName = userProperties.NickName;
		this.ingameBalance = userProperties.IngameBalance;
		this.diamondBalance = userProperties.Diamond;
		this.phoneNumber = userProperties.PhoneNumber;
		this.vipLevel = userProperties.VipLevel;
		this.vipPoint = userProperties.VipPoint;
		this.realMoneyBalance = userProperties.RealMoneyBalance;
	},

	SetUpMail(listMail, numbetMailNotRead) {
		if (Global.GameConfig.FeatureConfig.MailFeature != Global.Enum.EFeatureStatus.Open) {
			this.listMail = [];
			return;
		}
		this.listMail = listMail;
		this.numbetMailNotRead = numbetMailNotRead;
	},

	UpdateNewMail(mail) {
		if (Global.GameConfig.FeatureConfig.MailFeature != Global.Enum.EFeatureStatus.Open) {
			this.listMail = [];
			return;
		}
		let newListMail = [];//new MailObject[listMail.Length + 1];
		newListMail [0] = mail;
		for (let i = this.listMail.length; i > 0; i--) {
			newListMail [i] = this.listMail [i-1];
		}
		this.listMail = newListMail;
		this.numbetMailNotRead += 1;
	},

	SetUpDiamond(diamondBalance) {
		this.diamondBalance = diamondBalance;
	},

	SetupMoney(inGameBalance) {
		this.ingameBalance = inGameBalance;
	},

	SetVip(vipLevel) {
		this.vipLevel = vipLevel;
	},

	SetVipPoint(vipPoint) {
		this.vipPoint = vipPoint;
	},

	onLoad() {
        Global.MainPlayerInfo = this;
    },

    onDestroy(){
		Global.MainPlayerInfo = null;
	},
});