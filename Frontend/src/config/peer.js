class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
          {
            urls: "turn:your-turn-server-url",
            username: "your-username",
            credential: "your-credential",
          },
        ],
      });

      // Listen for incoming ICE candidates
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate:", event.candidate);
          socket.emit('icecandidate', event.candidate); // Emit to signaling server
        }
      };

      // Handle incoming tracks from remote peer
      this.peer.ontrack = this.handleTrackEvent;
    }
  }

  handleTrackEvent = (event) => {
    const remoteStream = event.streams[0];
    if (remoteStream) {
      console.log("Received remote stream", remoteStream);
      // You can use this to update UI or state in your app
      this.setRemoteStream(remoteStream); // Update React state or similar
    }
  };

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  // Handle incoming ICE candidates from the other peer
  addIceCandidate(candidate) {
    if (this.peer) {
      this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }
}

export default new PeerService();
