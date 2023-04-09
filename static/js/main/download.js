let localConnection;
let receiveDataChannel;
let protoColMinSize = 26;
const downloadFileButton = document.querySelector('button#downloadFile');
const downloadAnchor = document.querySelector('a#download');
var wsUri = "wss://transfer.yuanshiziliaoku.com/download";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
const receiveProgress = document.querySelector('progress#receiveProgress');

async function downloadFile(id) {
    transfer.topic_id = id;
    downloadFileButton.disabled = true;
    if (downloadAnchor.href) {
        URL.revokeObjectURL(downloadAnchor.href);
        downloadAnchor.removeAttribute('href');
        downloadAnchor.textContent = "";
    }
    await transfer.createConnection();
}

function serialize(data) {
    var bufLen = protoColMinSize;
    if (!data.Data) {
        bufLen += 0;
    } else {
        bufLen += data.Data.length;
    }
    data.Version = 1;
    var protocolBuf = new ArrayBuffer(bufLen);
    const bufView = new DataView(protocolBuf);
    bufView.setUint8(0, data.Version);

    bufView.setUint8(1, data.Class);

    if (!data.ChunkSize) {
        data.ChunkSize = 0;
    }
    bufView.setBigUint64(2, BigInt(data.ChunkSize));


    if (!data.CurrentChunk) {
        data.CurrentChunk = 0;
    }
    bufView.setBigUint64(10, BigInt(data.CurrentChunk));

    if (data.Data && data.Data.length > 0) {
        bufView.setBigUint64(18, BigInt(data.Data.length));
    } else {
        bufView.setBigUint64(18, BigInt(0));
    }

    return protocolBuf;
}

function unSerialize(bytes) {

    var versionView = new DataView(bytes).getUint8(0);
    // 最小长度
    var classByteView = new DataView(bytes).getUint8(1);
    // chunk 长度
    var chunkSizeView = parseInt(new DataView(bytes).getBigUint64(2));
    var currentChunkView = parseInt(new DataView(bytes).getBigUint64(10));
    var bodyLenView = parseInt(new DataView(bytes).getBigUint64(18));
    var returnData = {
        Version: versionView,
        Class: classByteView,
        ChunkSize: (chunkSizeView),
        CurrentChunk: currentChunkView,
        PayloadLength: bodyLenView,
        Payload: [],
    };

    if (bodyLenView > 0) {
        returnData.Payload = new Uint8Array(bytes, protoColMinSize, bodyLenView);
    }

    return returnData;
}


var dataChannel = {
    chunkSize: 0,
    receiveBuffer: [],
    onopen: function () {
        console.log("onopen");
    },

    onclose: function () {
        console.log("onclose");
    },

    onmessage: function (event) {
        var data = unSerialize(event.data);
        // 握手
        if (data.Class == 0) {
            receiveProgress.max = data.ChunkSize - 1;
            this.chunkSize =data.ChunkSize;
            //确认
            receiveDataChannel.send(serialize({
                Class: 1,
            }));
        }

        // 接收
        if (data.Class == 2) {
            receiveProgress.value = data.CurrentChunk + 1;
            dataChannel.receiveBuffer.push((data.Payload));
            if (data.CurrentChunk == this.chunkSize ) {
                var byteSize = 0;
                console.log(data.CurrentChunk);
                for (i = 0; i < dataChannel.receiveBuffer.length; i++) {
                    if (dataChannel.receiveBuffer[i]) {
                        byteSize += dataChannel.receiveBuffer[i].length;
                    }
                }
                const received = new Blob((dataChannel.receiveBuffer));
                downloadAnchor.href = URL.createObjectURL(received);
                downloadAnchor.download = transfer.name;

                downloadAnchor.textContent =
                    `Click to download '${transfer.name}' (${received.size} bytes)`;
                downloadAnchor.style.display = 'block';
                dataChannel.receiveBuffer = [];
                downloadFileButton.disabled = false;
                if (receiveDataChannel) {
                    receiveDataChannel.close();
                }
                localConnection.close();
                if (transfer.ws) {
                    transfer.ws.close();
                }
                return;
            }
            receiveDataChannel.send(serialize({
                Class: 3,
                CurrentChunk: data.CurrentChunk,
            }));
            return;
        }
    },

    onError: function (error) {
        console.log(error);
    }
};

function receiveChannelCallback(event) {
    console.log('Receive Channel Callback');
    console.log(event.data);
}


var transfer = {
    offer: undefined,
    ws: undefined,
    name: "",
    topic_id: 0,
    b64Encode: function(str) {
        return btoa(encodeURIComponent(str));
    },
    close: function () {
        if (receiveDataChannel) {
            receiveDataChannel.close();
        }
        if (localConnection) {
            localConnection.close();
        }
        if (transfer.ws) {
            transfer.ws.close();
        }
    },
    onOpen: async function (evt) {
        var pcConfig = {
            'iceServers': [{
                'urls': 'stun:1.15.135.156:3478',
            }]
        };
        localConnection = new RTCPeerConnection(pcConfig);
        receiveDataChannel = localConnection.createDataChannel("receiveDataChannel")

        receiveDataChannel.binaryType = "arraybuffer";

        receiveDataChannel.addEventListener('open', dataChannel.onopen);
        receiveDataChannel.addEventListener('close', dataChannel.onclose);
        receiveDataChannel.addEventListener('message', dataChannel.onmessage);
        receiveDataChannel.addEventListener('error', dataChannel.onError);

        try {
            this.offer = await localConnection.createOffer();
        } catch (e) {
            console.log('Failed to create session description: ', e);
            return;
        }

        gateway.reg(this.offer, parseInt(transfer.topic_id), 0);

        localConnection.onicecandidate = async function(event) {
            if (event.candidate != null) {
                gateway.addCandidate(event.candidate);
            }
        }

        localConnection.onconnectionstatechange = function () {
            console.log(localConnection.connectionState);
            if (localConnection.connectionState == "closed") {
                transfer.close();
            }
        }

        try {
            await localConnection.setLocalDescription(this.offer);
        } catch (e) {
            console.log('Failed to create session description: ', e);
            return;
        }

        if (!transfer.topic_id) {
            alert("id 不能为空");
            return;
        }
    },

    onClose: async function(evt) {

    },

    onMessage: async function(evt) {
        console.log(evt.data);

        var data = JSON.parse(evt.data);
        console.log(data);
        if (data.Errno == -1) {
            downloadFileButton.disabled = false;
            alert(data.ErrMsg);
            return
        }

        if (data.Errno == 10005) {
            downloadFileButton.disabled = false;
            alert(data.ErrMsg);
            return
        }

        if (data.Cate == ADD_CANDIDATE) {
            var ice = JSON.parse(data.Data.Candidate);
            console.log(ice);
            localConnection.addIceCandidate(ice);
            return;
        }

        if (data.Cate != PUSH_OFFER) {
            alert("类型不能识别");
            return;
        }

        downloadFileButton.disabled = false;
        transfer.name = data.Data.Name;
        localConnection.setRemoteDescription(JSON.parse(data.Data.Sdp));
    },

    onError: async function(evt) {

    },

    createConnection: async function () {
        this.ws = new WebSocket(wsUri);
        this.ws.onopen = function (evt) {
            transfer.onOpen(evt);
        };
        this.ws.onclose = function (evt) {
            transfer.onClose(evt);
        };
        this.ws.onmessage = function (evt) {
            transfer.onMessage(evt);
        };
        this.ws.onerror = function (evt) {
            transfer.onError(evt);
        };
    }
};
