// var songz = 'Chris Brown - Yo (Excuse Me Miss) (Official Video)'

function writeSong (string) {
  let container = document.getElementById('currentSong')
  let inline = document.querySelector('.inline')
  let i = 0
  let intervalId
  intervalId = setInterval(function () {
    inline.innerHTML += string.charAt(i++)
    // document.getElementById('currentSong').innerHTML += string.charAt(i++)
    if (inline.offsetWidth >= container.offsetWidth) {
      inline.innerText = inline.innerText.replace(inline.innerText.charAt(0), '')
    }

    if (i > string.length) {
      window.clearInterval(intervalId)
      // writeSong('hello world')
    }
  }, 100)
}

writeSong('Hello world')

/* Copyright 2011 Google Inc. All Rights Reserved. */
(function () {
  var d; var k = function (a) {
    return a.replace(/^\s+|\s+$/g, '')
  }; var t = function (a) {
    if (a && a.tagName) {
      var b = a.tagName.toLowerCase()
      if (b === 'input' || b === 'textarea') { return !0 }
    }
    if (document.designMode && document.designMode.toLowerCase() === 'on') { return !0 }
    for (; a; a = a.parentNode) {
      if (a.isContentEditable) { return !0 }
    }
    return !1
  }; var u = function (a, b) {
    var c = new XMLHttpRequest()
    c.open('GET', a, !0)
    c.onload = function () {
      var a = null
      this.status === 200 && (a = c.response)
      return b(a)
    }

    c.send()
  }; var v = /[0-9A-Za-z]/; var y = function () {
    u(chrome.runtime.getURL('content.min.css'), function (a) {
      var b = function (b) {
        this.K = b.instanceId
        this.J = a
        b = document.createElement('div')
        var c = document.createElement('a')
        c.target = '_blank'
        this.F = b.cloneNode(!1)
        this.B = document.createElement('audio')
        this.B.R = !0
        this.b = b.cloneNode(!1)
        this.b.id = 'gdx-bubble-host'
        this.D = this.b.createShadowRoot ? this.b.createShadowRoot() : this.b.webkitCreateShadowRoot()
        var f = document.createElement('style')
        f.innerHTML = this.J
        this.D.appendChild(f)
        this.a = b.cloneNode(!1)
        this.a.id = 'gdx-bubble-main'
        this.D.appendChild(this.a)
        this.g = b.cloneNode(!1)
        this.g.id = 'gdx-bubble-query-row'
        this.C = b.cloneNode(!1)
        this.C.id = 'gdx-bubble-query'
        this.i = b.cloneNode(!1)
        this.i.id = 'gdx-bubble-audio-icon'
        this.g.appendChild(this.C)
        this.g.appendChild(this.i)
        this.l = b.cloneNode(!1)
        this.l.id = 'gdx-bubble-meaning'
        this.f = b.cloneNode(!1)
        this.f.id = 'gdx-bubble-options-tip'
        this.f.innerHTML = 'Tip: Didn\'t want this definition pop-up? Try setting a trigger key in <a href="#">Extension Options</a>.'
        this.m = b.cloneNode(!1)
        this.m.id = 'gdx-bubble-more'
        this.h = c.cloneNode(!1)
        this.m.appendChild(this.h)
        this.c = b.cloneNode(!1)
        this.c.id = 'gdx-bubble-attribution'
        this.s = c.cloneNode(!1)
        this.v = b.cloneNode(!1)
        this.c.appendChild(this.s)
        this.c.appendChild(this.v)
        this.w = b.cloneNode(!1)
        this.w.id = 'gdx-bubble-close'
        this.a.appendChild(this.w)
        this.a.appendChild(this.g)
        this.a.appendChild(this.l)
        this.a.appendChild(this.f)
        this.a.appendChild(this.c)
        this.a.appendChild(this.m)
        this.A = b.cloneNode(!1)
        this.D.appendChild(this.A)
        this.I = w(b, 'up')
        this.H = w(b, 'down')
        x(this)
      }
        .bind(this)
      chrome.runtime.sendMessage({
        type: 'initialize'
      }, b)
    }
      .bind(this))
  }; var z = []
  d = y.prototype
  d.J = ''
  d.u = 0
  d.F = null
  d.B = null
  d.b = null
  d.D = null
  d.a = null
  d.g = null
  d.C = null
  d.i = null
  d.l = null
  d.f = null
  d.w = null
  d.m = null
  d.h = null
  d.c = null
  d.s = null
  d.v = null
  d.A = null
  d.I = null
  d.H = null
  d.o = null
  d.G = null
  var x = function (a) {
    a.G = a.N.bind(a)
    window.addEventListener('resize', a.j.bind(a))
    document.addEventListener('mouseup', a.P.bind(a))
    document.addEventListener('dblclick', a.L.bind(a))
    document.addEventListener('keydown', a.O.bind(a))
    a.w.onclick = a.j.bind(a)
    a.i.onclick = function () {
      this.B.play()
    }
      .bind(a)
    a.f.querySelector('a').onclick = function () {
      chrome.runtime.sendMessage({
        type: 'openOptionsPage'
      }, function () {})
      return !1
    }

    var b = function (a) {
      a.preventDefault()
      a.stopPropagation()
    }
    a.i.onmousedown = b
    a.w.onmousedown = b
    chrome.runtime.onMessage.addListener(D)
    chrome.runtime.onMessage.addListener(a.G)
  }

  var w = function (a, b) {
    var c = a.cloneNode(!1)

    var g = a.cloneNode(!1)
    a = a.cloneNode(!1)
    c.id = 'gdx-arrow-main'
    b === 'up' ? (g.id = 'gdx-bubble-arrow-inner-up',
    a.id = 'gdx-bubble-arrow-outer-up') : (g.id = 'gdx-bubble-arrow-inner-down',
    a.id = 'gdx-bubble-arrow-outer-down')
    c.appendChild(g)
    c.appendChild(a)
    return c
  }

  var E = function (a, b, c, g) {
    this.top = a
    this.right = b
    this.bottom = c
    this.left = g
  }

  var F = function (a) {
    a.a.style.left = '0'
    a.a.style.top = '0'
    var b = a.a.offsetWidth

    var c = a.a.offsetHeight

    var g = [window.pageXOffset, window.pageYOffset]

    var f = g[0]

    var e = [a.o.left + f, a.o.top + g[1]]

    var n = a.o.bottom - a.o.top

    var A = e[0] + (a.o.right - a.o.left) / 2
    g = f + document.documentElement.offsetWidth
    var l = A - b / 2
    l + b > g && (l = g - b)
    l < f && (l = f)
    var r = e[1] - c - 12 + 1

    var m = e[1] + n + 12 - 1
    a: if (b = new E(r, l + b, r + c, l),
    b.top < window.pageYOffset) { b = !1 } else {
      c = document.getElementsByTagName('embed')
      var B = document.getElementsByTagName('object')

      var p = [window.pageXOffset, window.pageYOffset]

      var C = p[0]
      p = p[1]
      for (var q = 0, L = c.length + B.length; q < L; q++) {
        var h = (q < c.length ? c[q] : B[q - c.length]).getBoundingClientRect()
        h = new E(h.top + p, h.right + C, h.bottom + p, h.left + C)
        if (b.bottom > h.top && h.bottom > b.top && b.left < h.right && h.left < b.right) {
          b = !1
          break a
        }
      }
      b = !0
    }
    b ? (m = a.H,
    m.style.top = e[1] - 12 + 'px') : (r = m,
    m = a.I,
    m.style.top = e[1] + n + 'px')
    e = A - 12
    m.style.left = e + 'px'
    e - 5 > f && e + 24 + 5 < g && a.A.appendChild(m)
    a.a.style.top = r + 'px'
    a.a.style.left = l + 'px'
  }
  y.prototype.M = function (a) {
    if (a.eventKey === this.u) {
      this.j()
      this.i.className = 'display-none'
      this.f.className = 'display-none'
      this.m.className = ''
      this.c.className = 'display-none'
      if (a.meaningObj) {
        var b = a.meaningObj
        this.g.className = ''
        this.C.innerHTML = b.prettyQuery
        this.l.innerHTML = b.meaningText
        b.audio && (this.B.src = b.audio,
        this.i.className = '')
        this.h.href = b.moreUrl
        this.h.innerHTML = 'More &raquo;'
        b.attribution && (b.type === 'translation' ? (this.v.innerHTML = b.attribution,
        this.s.className = 'display-none',
        this.v.className = '') : (this.F.innerHTML = b.attribution,
        b = this.F.getElementsByTagName('a')[0],
        this.s.href = b.href,
        this.s.innerHTML = b.innerHTML.replace('http://', ''),
        this.s.className = '',
        this.v.className = 'display-none'),
        this.c.className = '')
      } else {
        this.g.className = 'display-none',
        this.l.innerHTML = 'No definition found.',
        this.h.href = 'https://www.google.com/search?q=' + encodeURIComponent(a.sanitizedQuery),
        this.h.innerHTML = 'Search the web for "' + a.sanitizedQuery + '" \u00bb'
      }
      a.showOptionsTip && (this.f.className = '')
      document.documentElement.appendChild(this.b)
      F(this)
    }
  }

  var G = function (a, b) {
    b === a.u && (a.l.innerHTML = 'Dictionary is disabled for https pages.',
    a.h.href = 'https://support.google.com/TODO',
    a.h.innerHTML = 'More information \u00bb',
    a.m.className = '',
    a.g.className = 'display-none',
    a.f.className = 'display-none',
    a.c.className = 'display-none',
    document.documentElement.appendChild(a.b),
    F(a))
  }

  var H = function (a, b) {
    b = b.getBoundingClientRect()
    a.o = new E(b.top, b.right, b.bottom, b.left)
  }
  y.prototype.j = function () {
    this.u++
    var a = this.b
    a && a.parentNode && a.parentNode.removeChild(a)
    for (a = this.A; a && a.hasChildNodes();) { a.removeChild(a.childNodes[0]) }
  }

  y.prototype.O = function (a) {
    a.keyCode === 27 && this.j()
  }

  var I = function (a, b) {
    return b === 'none' || b === 'alt' && a.altKey || b === 'ctrl' && (window.navigator.platform.toLowerCase().indexOf('mac') !== -1 ? a.metaKey : a.ctrlKey) || b === 'shift' && a.shiftKey
  }

  var J = function (a, b) {
    for (b = b.target; b; b = b.parentNode) {
      if (b === a.b) { return !0 }
    }
    return !1
  }

  var K = function (a, b, c, g) {
    if (c === 'mouseup') { var f = g.popupSelect === 'true' && I(b, g.popupSelectKey) } else {
      c === 'dblclick' ? f = g.popupSelect === 'true' && I(b, g.popupSelectKey) ? !1 : g.popupDblclick === 'true' && I(b, g.popupDblclickKey) : (console.warn('Unexpected eventType: ' + c),
      f = !1)
    }
    if (f) {
      f = 0
      for (var e = z.length; f < e; f++) {
        if (location.href.match(z[f])) { return }
      }
      if (!t(b.target)) {
        f = null
        e = ''
        if (window.getSelection) {
          e = window.getSelection()
          if (e.rangeCount < 1) { return }
          f = e.getRangeAt(0)
          e = k(e.toString())
        } else {
          document.selection && (f = document.selection.createRange(),
          e = k(f.text))
        }
        if (!(!e || e.length === 1 && e.charCodeAt(0) <= 127 && !e.match(v) || c === 'dblclick' && e.indexOf(' ') !== -1)) {
          a.u++
          var n = a.u
          J(a, b) || H(a, f)
          g.enableHttps === 'false' && location.href.lastIndexOf('https', 0) === 0 ? G(a, n) : (window.setTimeout(function () {
            n === this.u && (this.l.innerHTML = 'Searching...',
            this.g.className = 'display-none',
            this.f.className = 'display-none',
            this.m.className = 'display-none',
            this.c.className = 'display-none',
            document.documentElement.appendChild(this.b),
            F(this))
          }
            .bind(a), 300),
          chrome.runtime.sendMessage({
            type: 'fetch_raw',
            eventKey: n,
            instanceId: a.K,
            query: e
          }, a.M.bind(a)))
        }
      }
    }
  }
  y.prototype.P = function (a) {
    J(this, a) || this.j()
    var b = function (b) {
      K(this, a, 'mouseup', b.options)
    }
      .bind(this)
    chrome.runtime.sendMessage({
      type: 'options'
    }, b)
  }

  y.prototype.L = function (a) {
    var b = function (b) {
      K(this, a, 'dblclick', b.options)
    }
      .bind(this)
    chrome.runtime.sendMessage({
      type: 'options'
    }, b)
  }

  var D = function (a, b, c) {
    a.type === 'get_selection' && (a = k(window.getSelection().toString())) && c({
      selection: a
    })
  }
  y.prototype.N = function (a) {
    a.type === 'hide' && a.instanceId === this.K && this.j()
  }

  var M = M || !1
  if (!M) {
    if (window.gdxBubbleInstance) {
      var N = window.gdxBubbleInstance
      chrome.runtime.onMessage.removeListener(D)
      chrome.runtime.onMessage.removeListener(N.G)
      N.j()
    }
    window.gdxBubbleInstance = new y()
  }
  ;
}
)()