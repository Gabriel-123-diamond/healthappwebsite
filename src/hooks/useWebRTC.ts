'use client';

import { useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, collection, addDoc, getDoc, updateDoc } from 'firebase/firestore';

const servers = {
  iceServers: [
    { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }
  ],
  iceCandidatePoolSize: 10,
};

export function useWebRTC(appointmentId: string, isJoined: boolean, isMuted: boolean, isVideoOff: boolean) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isJoined) {
      const initializeRTC = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;

          const pc = new RTCPeerConnection(servers);

          // Add Local Tracks
          stream.getTracks().forEach(track => {
             if (track.kind === 'audio') track.enabled = !isMuted;
             if (track.kind === 'video') track.enabled = !isVideoOff;
             pc.addTrack(track, stream);
          });

          // Inbound remote tracks
          pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
            setRemoteStream(event.streams[0]);
          };

          peerConnection.current = pc;
          
          const callDoc = doc(db, 'calls', appointmentId);
          const callerCandidatesCol = collection(callDoc, 'callerCandidates');
          const calleeCandidatesCol = collection(callDoc, 'calleeCandidates');

          const callData = (await getDoc(callDoc)).data();

          if (!callData?.offer) {
            // WE ARE THE CALLER
            pc.onicecandidate = (event) => {
              if (event.candidate) {
                addDoc(callerCandidatesCol, event.candidate.toJSON());
              }
            };

            const offerDescription = await pc.createOffer();
            await pc.setLocalDescription(offerDescription);

            const offer = {
              sdp: offerDescription.sdp,
              type: offerDescription.type,
            };

            await setDoc(callDoc, { offer }, { merge: true });

            onSnapshot(callDoc, (snapshot) => {
              const data = snapshot.data();
              if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(data.answer);
                pc.setRemoteDescription(answerDescription);
              }
            });

            onSnapshot(calleeCandidatesCol, (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                  const candidate = new RTCIceCandidate(change.doc.data());
                  pc.addIceCandidate(candidate);
                }
              });
            });

          } else {
            // WE ARE THE CALLEE
            pc.onicecandidate = (event) => {
              if (event.candidate) {
                addDoc(calleeCandidatesCol, event.candidate.toJSON());
              }
            };

            const offerDescription = callData.offer;
            await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
              sdp: answerDescription.sdp,
              type: answerDescription.type,
            };

            await updateDoc(callDoc, { answer });

            onSnapshot(callerCandidatesCol, (snapshot) => {
              snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                  const candidate = new RTCIceCandidate(change.doc.data());
                  pc.addIceCandidate(candidate);
                }
              });
            });
          }
          
        } catch (error) {
          console.error('Error in WebRTC initialization', error);
        }
      };

      initializeRTC();
    }

    return () => {
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }
    };
  }, [isJoined, appointmentId]);

  useEffect(() => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
      stream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
    }
  }, [isMuted, isVideoOff]);

  return { localVideoRef, remoteVideoRef, remoteStream };
}
