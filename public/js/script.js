const socket = io('/');

const myPeer = new Peer(undefined, {
    host: '/',
    port: '4040'
});

const peer = {};

const gridVideo = document.getElementById('show-video-grid');
const showVideo = document.createElement('video');
showVideo.muted = true;

const media = {video: true, audio: true};

function addVideoStream (video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    gridVideo.append(video);
}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    })
    call.close('close', () => {
        video.remove();
    })
    peer[userId] = call
}

// const openMediaDevices = async (constraints) => {
//     return await navigator.mediaDevices.getUserMedia(constraints);
// }

// try {
//     const stream = openMediaDevices(media);
//     addVideoStream(showVideo, stream);
// } catch (error) {
//     console.log(error);
// }

// const startStream = async () => {
//     const stream = await navigator.mediaDevices.getUsermedia(media);
//     addVideoStream(showVideo, stream);
// }

// startStream();


navigator.mediaDevices.getUserMedia(media)
    .then( (stream) => {
        addVideoStream(showVideo, stream);

        myPeer.on('call', call => {
            const video = document.createElement('video');
            call.answer(stream);
            call.on('stream', (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            })
        })

        socket.on('user-joined', (userId) => {
            connectToNewUser(userId, stream);
            console.log(`User joined: ${userId}`);
        })
    })



socket.on('user-left', (userId) => {
    if (peer[userId]) peer[userId].close();
    console.log(`User ${userId} left`);
})
myPeer.on('open', (id) => {
    socket.emit('join', VIDEO_ID, id);
})

 


// socket.on('user-joined', (userId) => {
//     console.log(`User joined: ${userId}`);
// })



// const openMediaDevices = async (constraints) => {
//     return await navigator.mediaDevices.getUserMedia(constraints);
// }

// try {
//     const stream = openMediaDevices({'video':true,'audio':true});
//     console.log('Got MediaStream:', stream);
// } catch(error) {
//     console.error('Error accessing media devices.', error);
// }