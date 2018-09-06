11111111111111111111111111 Client {
server: 
   Server {
     nsps: { '/': [Object], '/chat_infra': [Object], '/chat_com': [Object] },
     parentNsps: Map {},
     _path: '/socket.io',
     _serveClient: true,
     parser: 
      { protocol: 4,
        types: [Array],
        CONNECT: 0,
        DISCONNECT: 1,
        EVENT: 2,
        ACK: 3,
        ERROR: 4,
        BINARY_EVENT: 5,
        BINARY_ACK: 6,
        Encoder: [Function: Encoder],
        Decoder: [Function: Decoder] },
     encoder: Encoder {},
     _adapter: [Function: Adapter],
     _origins: '*:*',
     sockets: 
      Namespace {
        name: '/',
        server: [Circular],
        sockets: [Object],
        connected: [Object],
        fns: [],
        ids: 0,
        rooms: [],
        flags: {},
        adapter: [Object] },
     eio: 
      Server {
        clients: [Object],
        clientsCount: 3,
        wsEngine: 'ws',
        pingTimeout: 5000,
        pingInterval: 25000,
        upgradeTimeout: 10000,
        maxHttpBufferSize: 100000000,
        transports: [Array],
        allowUpgrades: true,
        allowRequest: [Function: bound ],
        cookie: 'io',
        cookiePath: '/',
        cookieHttpOnly: true,
        perMessageDeflate: [Object],
        httpCompression: [Object],
        initialPacket: [Array],
        ws: [Object],
        _events: [Object],
        _eventsCount: 1 },
     httpServer: 
      Server {
        domain: null,
        _events: [Object],
        _eventsCount: 6,
        _maxListeners: undefined,
        _connections: 4,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        _unref: false,
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        keepAliveTimeout: 5000,
        _pendingResponseData: 0,
        maxHeadersCount: null,
        _connectionKey: '6::::3001',
        [Symbol(asyncId)]: 7 },
     engine: 
      Server {
        clients: [Object],
        clientsCount: 3,
        wsEngine: 'ws',
        pingTimeout: 5000,
        pingInterval: 25000,
        upgradeTimeout: 10000,
        maxHttpBufferSize: 100000000,
        transports: [Array],
        allowUpgrades: true,
        allowRequest: [Function: bound ],
        cookie: 'io',
        cookiePath: '/',
        cookieHttpOnly: true,
        perMessageDeflate: [Object],
        httpCompression: [Object],
        initialPacket: [Array],
        ws: [Object],
        _events: [Object],
        _eventsCount: 1 } },
  conn: 
   Socket {
     id: 'A51xD4zT7Txr-lSlAAAD',
     server: 
      Server {
        clients: [Object],
        clientsCount: 3,
        wsEngine: 'ws',
        pingTimeout: 5000,
        pingInterval: 25000,
        upgradeTimeout: 10000,
        maxHttpBufferSize: 100000000,
        transports: [Array],
        allowUpgrades: true,
        allowRequest: [Function: bound ],
        cookie: 'io',
        cookiePath: '/',
        cookieHttpOnly: true,
        perMessageDeflate: [Object],
        httpCompression: [Object],
        initialPacket: [Array],
        ws: [Object],
        _events: [Object],
        _eventsCount: 1 },
     upgrading: false,
     upgraded: true,
     readyState: 'open',
     writeBuffer: [],
     packetsFn: [],
     sentCallbackFn: [],
     cleanupFn: [ [Function], [Function] ],
     request: 
      IncomingMessage {
        _readableState: [Object],
        readable: false,
        domain: null,
        _events: {},
        _eventsCount: 0,
        _maxListeners: undefined,
        socket: [Object],
        connection: [Object],
        httpVersionMajor: 1,
        httpVersionMinor: 1,
        httpVersion: '1.1',
        complete: true,
        headers: [Object],
        rawHeaders: [Array],
        trailers: {},
        rawTrailers: [],
        upgrade: false,
        url: '/socket.io/?EIO=3&transport=polling&t=MMkYrWu',
        method: 'GET',
        statusCode: null,
        statusMessage: null,
        client: [Object],
        _consuming: true,
        _dumped: true,
        _query: [Object],
        res: [Object],
        cleanup: [Function: cleanup],
        read: [Function] },
     remoteAddress: '::1',
     checkIntervalTimer: null,
     upgradeTimeoutTimer: null,
     pingTimeoutTimer: 
      Timeout {
        _called: false,
        _idleTimeout: 30000,
        _idlePrev: [Object],
        _idleNext: [Object],
        _idleStart: 8348,
        _onTimeout: [Function],
        _timerArgs: undefined,
        _repeat: null,
        _destroyed: false,
        [Symbol(asyncId)]: 363,
        [Symbol(triggerAsyncId)]: 315 },
     transport: 
      WebSocket {
        readyState: 'open',
        discarded: false,
        socket: [Object],
        writable: true,
        perMessageDeflate: [Object],
        supportsBinary: true,
        _events: [Object],
        _eventsCount: 4 },
     _events: 
      { close: [Array],
        data: [Function: bound ],
        error: [Function: bound ] },
     _eventsCount: 3 },
  encoder: Encoder {},
  decoder: Decoder { reconstructor: null, _callbacks: { '$decoded': [Array] } },
  id: 'A51xD4zT7Txr-lSlAAAD',
  request: 
   IncomingMessage {
     _readableState: 
      ReadableState {
        objectMode: false,
        highWaterMark: 16384,
        buffer: [Object],
        length: 0,
        pipes: null,
        pipesCount: 0,
        flowing: true,
        ended: true,
        endEmitted: true,
        reading: false,
        sync: true,
        needReadable: false,
        emittedReadable: false,
        readableListening: false,
        resumeScheduled: false,
        destroyed: false,
        defaultEncoding: 'utf8',
        awaitDrain: 0,
        readingMore: false,
        decoder: null,
        encoding: null },
     readable: false,
     domain: null,
     _events: {},
     _eventsCount: 0,
     _maxListeners: undefined,
     socket: 
      Socket {
        connecting: false,
        _hadError: false,
        _handle: null,
        _parent: null,
        _host: null,
        _readableState: [Object],
        readable: false,
        domain: null,
        _events: [Object],
        _eventsCount: 10,
        _maxListeners: undefined,
        _writableState: [Object],
        writable: false,
        allowHalfOpen: true,
        _bytesDispatched: 4336,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _server: [Object],
        _idleTimeout: -1,
        _idleNext: null,
        _idlePrev: null,
        _idleStart: 2799,
        _destroyed: false,
        parser: null,
        on: [Function: socketOnWrap],
        _paused: false,
        read: [Function],
        _consuming: true,
        _httpMessage: null,
        _peername: [Object],
        _called: true,
        [Symbol(asyncId)]: 46,
        [Symbol(bytesRead)]: 7604,
        [Symbol(asyncId)]: 47,
        [Symbol(triggerAsyncId)]: 46 },
     connection: 
      Socket {
        connecting: false,
        _hadError: false,
        _handle: null,
        _parent: null,
        _host: null,
        _readableState: [Object],
        readable: false,
        domain: null,
        _events: [Object],
        _eventsCount: 10,
        _maxListeners: undefined,
        _writableState: [Object],
        writable: false,
        allowHalfOpen: true,
        _bytesDispatched: 4336,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _server: [Object],
        _idleTimeout: -1,
        _idleNext: null,
        _idlePrev: null,
        _idleStart: 2799,
        _destroyed: false,
        parser: null,
        on: [Function: socketOnWrap],
        _paused: false,
        read: [Function],
        _consuming: true,
        _httpMessage: null,
        _peername: [Object],
        _called: true,
        [Symbol(asyncId)]: 46,
        [Symbol(bytesRead)]: 7604,
        [Symbol(asyncId)]: 47,
        [Symbol(triggerAsyncId)]: 46 },
     httpVersionMajor: 1,
     httpVersionMinor: 1,
     httpVersion: '1.1',
     complete: true,
     headers: 
      { host: 'localhost:3001',
        connection: 'keep-alive',
        accept: '*/*',
        dnt: '1',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        referer: 'http://localhost:3001/',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        cookie: 'io=oGfIZuBAZ_OFIXM1AAAC' },
     rawHeaders: 
      [ 'Host',
        'localhost:3001',
        'Connection',
        'keep-alive',
        'Accept',
        '*/*',
        'DNT',
        '1',
        'User-Agent',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        'Referer',
        'http://localhost:3001/',
        'Accept-Encoding',
        'gzip, deflate, br',
        'Accept-Language',
        'en-US,en;q=0.9',
        'Cookie',
        'io=oGfIZuBAZ_OFIXM1AAAC' ],
     trailers: {},
     rawTrailers: [],
     upgrade: false,
     url: '/socket.io/?EIO=3&transport=polling&t=MMkYrWu',
     method: 'GET',
     statusCode: null,
     statusMessage: null,
     client: 
      Socket {
        connecting: false,
        _hadError: false,
        _handle: null,
        _parent: null,
        _host: null,
        _readableState: [Object],
        readable: false,
        domain: null,
        _events: [Object],
        _eventsCount: 10,
        _maxListeners: undefined,
        _writableState: [Object],
        writable: false,
        allowHalfOpen: true,
        _bytesDispatched: 4336,
        _sockname: null,
        _pendingData: null,
        _pendingEncoding: '',
        server: [Object],
        _server: [Object],
        _idleTimeout: -1,
        _idleNext: null,
        _idlePrev: null,
        _idleStart: 2799,
        _destroyed: false,
        parser: null,
        on: [Function: socketOnWrap],
        _paused: false,
        read: [Function],
        _consuming: true,
        _httpMessage: null,
        _peername: [Object],
        _called: true,
        [Symbol(asyncId)]: 46,
        [Symbol(bytesRead)]: 7604,
        [Symbol(asyncId)]: 47,
        [Symbol(triggerAsyncId)]: 46 },
     _consuming: true,
     _dumped: true,
     _query: { EIO: '3', transport: 'polling', t: 'MMkYrWu' },
     res: 
      ServerResponse {
        domain: null,
        _events: [Object],
        _eventsCount: 1,
        _maxListeners: undefined,
        output: [],
        outputEncodings: [],
        outputCallbacks: [],
        outputSize: 0,
        writable: true,
        _last: false,
        upgrading: false,
        chunkedEncoding: false,
        shouldKeepAlive: true,
        useChunkedEncodingByDefault: true,
        sendDate: true,
        _removedConnection: false,
        _removedContLen: false,
        _removedTE: false,
        _contentLength: null,
        _hasBody: true,
        _trailer: '',
        finished: true,
        _headerSent: true,
        socket: null,
        connection: null,
        _header: 'HTTP/1.1 200 OK\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Length: 103\r\nAccess-Control-Allow-Origin: *\r\nSet-Cookie: io=A51xD4zT7Txr-lSlAAAD; Path=/; HttpOnly\r\nDate: Thu, 06 Sep 2018 11:01:32 GMT\r\nConnection: keep-alive\r\n\r\n',
        _onPendingData: [Function: bound updateOutgoingData],
        _sent100: false,
        _expect_continue: false,
        statusMessage: 'OK',
        statusCode: 200,
        [Symbol(outHeadersKey)]: null },
     cleanup: [Function: cleanup],
     read: [Function] },
  onclose: [Function: bound ],
  ondata: [Function: bound ],
  onerror: [Function: bound ],
  ondecoded: [Function: bound ],
  sockets: 
   { 'A51xD4zT7Txr-lSlAAAD': 
      Socket {
        nsp: [Object],
        server: [Object],
        adapter: [Object],
        id: 'A51xD4zT7Txr-lSlAAAD',
        client: [Circular],
        conn: [Object],
        rooms: [Object],
        acks: {},
        connected: true,
        disconnected: false,
        handshake: [Object],
        fns: [],
        flags: {},
        _rooms: [] },
     '/chat_infra#A51xD4zT7Txr-lSlAAAD': 
      Socket {
        nsp: [Object],
        server: [Object],
        adapter: [Object],
        id: '/chat_infra#A51xD4zT7Txr-lSlAAAD',
        client: [Circular],
        conn: [Object],
        rooms: [Object],
        acks: {},
        connected: true,
        disconnected: false,
        handshake: [Object],
        fns: [],
        flags: {},
        _rooms: [],
        _events: [Object],
        _eventsCount: 5,
        nickname: 'scott' },
     '/chat_com#A51xD4zT7Txr-lSlAAAD': 
      Socket {
        nsp: [Object],
        server: [Object],
        adapter: [Object],
        id: '/chat_com#A51xD4zT7Txr-lSlAAAD',
        client: [Circular],
        conn: [Object],
        rooms: [Object],
        acks: {},
        connected: true,
        disconnected: false,
        handshake: [Object],
        fns: [],
        flags: {},
        _rooms: [],
        _events: [Object],
        _eventsCount: 2 } },
  nsps: 
   { '/': 
      Socket {
        nsp: [Object],
        server: [Object],
        adapter: [Object],
        id: 'A51xD4zT7Txr-lSlAAAD',
        client: [Circular],
        conn: [Object],
        rooms: [Object],
        acks: {},
        connected: true,
        disconnected: false,
        handshake: [Object],
        fns: [],
        flags: {},
        _rooms: [] },
     '/chat_infra': 
      Socket {
        nsp: [Object],
        server: [Object],
        adapter: [Object],
        id: '/chat_infra#A51xD4zT7Txr-lSlAAAD',
        client: [Circular],
        conn: [Object],
        rooms: [Object],
        acks: {},
        connected: true,
        disconnected: false,
        handshake: [Object],
        fns: [],
        flags: {},
        _rooms: [],
        _events: [Object],
        _eventsCount: 5,
        nickname: 'scott' },
     '/chat_com': 
      Socket {
        nsp: [Object],
        server: [Object],
        adapter: [Object],
        id: '/chat_com#A51xD4zT7Txr-lSlAAAD',
        client: [Circular],
        conn: [Object],
        rooms: [Object],
        acks: {},
        connected: true,
        disconnected: false,
        handshake: [Object],
        fns: [],
        flags: {},
        _rooms: [],
        _events: [Object],
        _eventsCount: 2 } },
  connectBuffer: [] } 