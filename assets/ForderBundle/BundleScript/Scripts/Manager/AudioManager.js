

cc.Class({
    extends: cc.Component,
    ctor() {
        this.currentIndex1 = 0;
        this.currentIndex2 = 7;
      
        this.musicValue = 0;
        this.soundValue = 0;
    },
   
    properties: {
        audios : [cc.AudioSource],
        backgroundMusicAudio : cc.AudioSource,
      
    },

    start() {
        cc.game.addPersistRootNode(this.node);
        this.SetUpAudioStartGame();
    },

    SetUpAudioStartGame() {

        let isSound = cc.sys.localStorage.getItem(CONFIG.KEY_SOUND+"123465") || 1;
        this.soundValue = isSound;
        

        let isMusic = cc.sys.localStorage.getItem(CONFIG.KEY_MUSIC+"123465") || 1;
        this.musicValue = isMusic;
        this.SetUpMusic(isMusic);
        this.SetUpSound(isSound);
        this.SaveStatusAudio();
    },

    SetUpSound(value) {
        for (let i = 0; i < this.audios.length; i++) {
            this.audios [i].volume = value;
        }
        if (value == 0) {
            for (let i = 0; i < this.audios.length; i++) {
                this.audios [i].stop();
            }
        }
        this.SaveStatusAudio();
    },

    SetUpMusic(value) {
        this.backgroundMusicAudio.volume = value;
    },

    SaveStatusAudio() {
        cc.sys.localStorage.setItem(CONFIG.KEY_MUSIC+"123465" , this.musicValue);
        cc.sys.localStorage.setItem(CONFIG.KEY_SOUND+"123465" , this.soundValue);
    },

    ChangeValueMusic(value) {
        this.musicValue = value;
        this.SetUpMusic (value);
        this.SaveStatusAudio ();
    },

    ChangeValueSound (value) {
        this.soundValue = value;
        this.SetUpSound (value);
        this.SaveStatusAudio ();
    },

    GetValueMusic() {
        return this.musicValue;
    },

    GetValueSound() {
        return this.soundValue;
    },

    //music
    PlayMusicLogin() {
        cc.resources.load("Sound/LobbyMusic1" , cc.AudioClip , (err , pre)=>{ 
            this.backgroundMusicAudio.volume = 0.6;
             this.backgroundMusicAudio.clip = pre;
             this.backgroundMusicAudio.play();
             this.backgroundMusicAudio.loop = true;
         });
    },

    PlayMusicLobby() {
        cc.resources.load("Sound/LobbyMusic1" , cc.AudioClip , (err , pre)=>{ 
            this.backgroundMusicAudio.volume = 0.6;
             this.backgroundMusicAudio.clip = pre;
             this.backgroundMusicAudio.play();
             this.backgroundMusicAudio.loop = true;
         });
    },

    PlayMusicLobby2() {
        this.backgroundMusicAudio.volume = 1;
        Global.DownloadManager.LoadAssest("Lobby",cc.AudioClip,"Sound/LobbyMusic", (audio)=>{
            cc.log(audio);
            Global.AudioManager.backgroundMusicAudio.clip = audio;
            Global.AudioManager.backgroundMusicAudio.play();
            Global.AudioManager.backgroundMusicAudio.loop = true;
        });
    },
    PlayMusicLobby3() {
        this.backgroundMusicAudio.volume = 1;
        Global.DownloadManager.LoadAssest("Lobby3",cc.AudioClip,"LobbyMusic", (audio)=>{
            cc.log(audio);
            Global.AudioManager.backgroundMusicAudio.clip = audio;
            Global.AudioManager.backgroundMusicAudio.play();
            Global.AudioManager.backgroundMusicAudio.loop = true;
        });
    },

    PlayMusicInGame() {
        this.backgroundMusicAudio.volume = 1;
        Global.DownloadManager.LoadAssest("Fish",cc.AudioClip,"Fishing/Sound/InGameMusic" + Global.RandomNumber(1, 4), (audio)=>{
            Global.AudioManager.backgroundMusicAudio.clip = audio;
            Global.AudioManager.backgroundMusicAudio.play();
            Global.AudioManager.backgroundMusicAudio.loop = true;
        });
    },

    PlayMusicInGame3() {
        this.backgroundMusicAudio.volume = 1;
        Global.DownloadManager.LoadAssest("InGameFishUI3",cc.AudioClip,"Sound/InGameMusic" + Global.RandomNumber(1, 4), (audio)=>{
            Global.AudioManager.backgroundMusicAudio.clip = audio;
            Global.AudioManager.backgroundMusicAudio.play();
            Global.AudioManager.backgroundMusicAudio.loop = true;
        });
    },

    PlaySoundAsset(link)
    {
        Global.DownloadManager.LoadAssest("InGameFishUI3",cc.AudioClip,link, (audio)=>{
            Global.AudioManager.backgroundMusicAudio.clip = audio;
            Global.AudioManager.backgroundMusicAudio.play();
            Global.AudioManager.backgroundMusicAudio.loop = true;
        });
    },
   

    PlayMusicInGameSlot() {
        this.backgroundMusicAudio.stop();
    },

    //sound
    ClickButton() {
        this.PlayAudio1 ("ClickButton");
    },

    PlayStartJackpotAudio() {
        this.PlayFishAudio2 ("StartJackpot");
    },

    PlaySoundGun123() {
        this.PlayFishAudio1 ("GunMusic1");
    },

    PlaySoundGun456() {
        this.PlayFishAudio1 ("GunMusic4");
    },

    PlaySoundGun7() {
        this.PlayFishAudio1 ("GunMusic7");
    },

    PlaySoundGun8() {
        this.PlayFishAudio1 ("GunMusic8");
    },

    PlayFishBoomSound() {
        this.PlayFishAudio1 ("FishBoom");
    },

    PlayKillFish() {
        this.PlayAudio1 ("CoinMusic2");
    },

    PlayHightScore() {
        this.PlayFishAudio2 ("HightScore");
    },

    PlayMoneySound() {
        this.PlayAudio1 ("CoinMusic1");
    },

    PlayMegaWin() {
        this.PlayFishAudio2 ("KillJackpot");
    },

    //play
    PlayAudio1(clipName) {
        this.currentIndex1 += 1;
        if (this.currentIndex1 >= 6)
            this.currentIndex1 = 0;
            cc.resources.load("Sound/"+clipName, cc.AudioClip , (err , pre)=>{ 
            this.audios [this.currentIndex1].clip = pre;
            this.audios [this.currentIndex1].play ();
        });
    },

    PlayAudio2(clipName) {
        this.currentIndex2 += 1;
        if (this.currentIndex2 >= 9)
            this.currentIndex2 = 6;
            cc.resources.load("Sound/"+clipName, cc.AudioClip , (err , pre)=>{ 
            this.audios [this.currentIndex2].clip = pre;
            this.audios [this.currentIndex2].play ();
        });
    },

   

    PlayFishAudio1(clipName) {
        this.currentIndex1 += 1;
        if (this.currentIndex1 >= 6)
            this.currentIndex1 = 0;
            Global.DownloadManager.LoadAssest("Fish",cc.AudioClip,"Fishing/Sound/"+clipName, (audio)=>{
                Global.AudioManager.audios [Global.AudioManager.currentIndex1].clip = audio;
                Global.AudioManager.audios [Global.AudioManager.currentIndex1].play ();
        });
    },

    PlayFishAudio2(clipName) {
        this.currentIndex2 += 1;
        if (this.currentIndex2 >= 9)
            this.currentIndex2 = 6;
            Global.DownloadManager.LoadAssest("Fish",cc.AudioClip,"Fishing/Sound/"+clipName, (audio)=>{
                Global.AudioManager.audios [Global.AudioManager.currentIndex2].clip = audio;
                Global.AudioManager.audios [Global.AudioManager.currentIndex2].play ();
        });
    },

 


    onLoad() {
        Global.AudioManager = this;
    },
});
