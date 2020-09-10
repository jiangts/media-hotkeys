$(() => {
  let mm, lastPlayed, medias = $('video, audio'), hotkeys = {}
  addEventListener('playing', e => {
    lastPlayed = e.target
  }, true)
  setInterval(() => {
    medias = $('video, audio')
  }, 333)

  const togglePlayPause = () => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    if(media.paused) await media.play()
    else media.pause()
  }

  const jump = (sec) => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.currentTime += sec
  }

  const playbackRate = (rate) => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.playbackRate += rate
  }

  const seekPercent = (percent) => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.currentTime = media.duration * percent / 100
  }

  const toggleMute = () => async e => {
    let media = lastPlayed || medias[0]
    if(!media) return
    media.muted = !media.muted
  }

  hotkeys['space'] = togglePlayPause();
  hotkeys['k'] = togglePlayPause();
  hotkeys['j'] = jump(-10);
  hotkeys['l'] = jump(10);
  hotkeys['left'] = jump(-5);
  hotkeys['right'] = jump(5);
  hotkeys['<'] = playbackRate(-0.25);
  hotkeys['>'] = playbackRate(0.25);
  for(let i = 0; i < 10; i++) {
    hotkeys[i+''] = seekPercent(i * 10);
  }
  hotkeys['m'] = toggleMute();

  Mousetrap.bind('ctrl+m', () => {
    mm = !mm
    mm ? bindAll() : unbindAll()
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
})
