// cate
const CLIENT_REGISTER = 0;

// type
const CLIENT_TYPE = 0;
const PUSH_OFFER = 2;
const ADD_CANDIDATE = 3;


var gateway = {
    reg: function (offer, topic_id, offset = 0) {
        //eyJ1c2VyX3V1aWQiOiI1ZmZkNDE0N2JkMTMyNWNmMjYwNDAyMWYwODA5OWUyMyIsImxvZ2luX3RpbWUiOjE2Njg0NzgzOTEsIm5vd190aW1lIjoxNjY5OTgzNzkwLCJyYW5fc3RyIjoiZDA3MTczNzI3NjFjMzY0MGU2NmRlYWI5YmYyODZhNzYiLCJzaWduIjoiZjc3NzI0YjZmMTc3MzczNmVhZWFkMTM2NzllNTE0NTcifQ==
        var downloadRequest = {
            cate: CLIENT_REGISTER,
            data: {
                type: CLIENT_TYPE,
                action: 0,
                sdp: offer,
                user_token: document.cookie,
                topic_id: topic_id,
                offset: offset,
            }
        };

        downloadRequest.data.sdp = transfer.b64Encode(JSON.stringify(offer));
        transfer.ws.send((JSON.stringify(downloadRequest)));
    },

    addCandidate: function (candidate) {
        var addCandidateRequest = {
            cate: ADD_CANDIDATE,
            data: {
                candidate: JSON.stringify(candidate),
            }
        };
        console.log(addCandidateRequest);
        transfer.ws.send((JSON.stringify(addCandidateRequest)));
    },
};
