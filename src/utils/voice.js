function voicePlay(text) {
    var msg = new SpeechSynthesisUtterance()
    msg.rate = 1 //播放语速
    msg.pitch = 100 //音调高低
    msg.text = text
    msg.volume = 1 //播放音量
    window.speechSynthesis.speak(msg)
}
