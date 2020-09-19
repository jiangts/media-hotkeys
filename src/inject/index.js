$(() => {
  let mm = true, lastPlayed, medias = $('video, audio'), hotkeys = {}
  addEventListener('playing', e => {
    lastPlayed = e.target
  }, true)
  setInterval(() => {
    medias = $('video, audio')
  }, 333)

  const fmtMSS = s => {
    s = Math.round(s)
    return (s-(s%=60))/60+(9<s?':':':0')+s
  }
  const notify = (msg) => {
    toastr.remove()
    toastr.info('', msg, {
      showDuration: 100,
      hideDuration: 100,
      positionClass: 'toast-top-center',
      toastClass: 'cool-toast',
      timeOut: 1000,
      // timeOut: 0,
      // extendedTimeOut: 0,
    })
  }


  const togglePlayPause = () => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    if(media.paused) {
      await media.play()
      notify(`Play (${fmtMSS(media.duration - media.currentTime)} remaining)`)
    }
    else {
      media.pause()
      notify(`Pause (${fmtMSS(media.duration - media.currentTime)} remaining)`)
    }
  }

  const jump = (sec) => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.currentTime += sec
    notify(`Time: ${fmtMSS(media.currentTime)} / ${fmtMSS(media.duration)}`)
  }

  const playbackRate = (rate) => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.playbackRate += rate
    notify(`Rate: ${media.playbackRate}x`)
  }

  const seekPercent = (percent) => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.currentTime = media.duration * percent / 100
    notify(`Time: ${fmtMSS(media.currentTime)} / ${fmtMSS(media.duration)}`)
  }

  const toggleMute = () => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.muted = !media.muted
    notify(media.muted ? 'Muted' : 'Unmuted')
  }

  const toggleFullscreen = () => e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    if (screenfull.isEnabled) {
      screenfull.toggle(media);
    }
  }

  // hotkeys['space'] = togglePlayPause();
  hotkeys['k'] = togglePlayPause();
  hotkeys['j'] = jump(-10);
  hotkeys['l'] = jump(10);
  hotkeys['left'] = jump(-5);
  hotkeys['right'] = jump(5);
  hotkeys['<'] = playbackRate(-0.25);
  hotkeys['>'] = playbackRate(0.25);
  hotkeys['f'] = toggleFullscreen();
  for(let i = 0; i < 10; i++) {
    hotkeys[i+''] = seekPercent(i * 10);
  }
  hotkeys['m'] = toggleMute();

  Mousetrap.bind('ctrl+m', () => {
    mm = !mm
    mm ? bindAll() : unbindAll()
    notify(mm ? 'Media hotkeys on' : 'Media hotkeys off')
  });

  const bindAll = () => {
    for(var k in hotkeys) {
      Mousetrap.bind(k, hotkeys[k])
    }
  }

  const unbindAll = () => {
    for(var k in hotkeys) {
      Mousetrap.unbind(k)
    }
  }

  if(mm) {
    bindAll()
  }
})
