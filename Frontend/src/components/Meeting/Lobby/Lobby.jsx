import React, { useEffect, useCallback, useState } from "react";
import peer from "../../../config/peer";
import { useSocket } from "../../../context/SocketProvider";
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const socket = useSocket();
  const navigate = useNavigate();  // Hook for navigation
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    const remoteMediaStream = new MediaStream();
    peer.peer.addEventListener("track", (ev) => {
      console.log("Received remote track");
      remoteMediaStream.addTrack(ev.track);
      setRemoteStream(remoteMediaStream);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  // New function to handle ending the call and navigating
  const handleEndCall = () => {
    // Stop all tracks of myStream
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }

    // Close peer connection
    if (peer.peer) {
      peer.peer.close();
    }

    // Navigate to /Meetings
    navigate("/meetings");
  };

  console.log("myStream", myStream);
  console.log("remoteStream", remoteStream);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-gray-800 mb-5">Room Page</h1>
      <h4 className={`text-lg ${remoteSocketId ? "text-green-600" : "text-red-600"} mb-5`}>
        {remoteSocketId ? "Connected" : "No one in room"}
      </h4>

      {/* Button Section */}
      <div className="space-x-4 mb-8">
        {myStream && (
          <button
            onClick={sendStreams}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Send Stream
          </button>
        )}
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Call
          </button>
        )}
        {myStream && (
          <button
            onClick={handleEndCall}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            End Call and Go to Meetings
          </button>
        )}
      </div>

      {/* Video Streams Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myStream && (
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">My Stream</h2>
            <video
              playsInline
              muted
              autoPlay
              className="rounded-lg border border-gray-300 shadow-md"
              ref={(video) => {
                if (video) {
                  video.srcObject = myStream;
                }
              }}
              style={{ width: "100%", maxHeight: "300px" }}
            />
          </div>
        )}
        {remoteStream && (
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Remote Stream</h2>
            <video
              playsInline
              autoPlay
              className="rounded-lg border border-gray-300 shadow-md"
              ref={(video) => {
                if (video) {
                  video.srcObject = remoteStream;
                }
              }}
              style={{ width: "100%", maxHeight: "300px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
