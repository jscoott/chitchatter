import { Fragment, useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import { RoomContext } from 'contexts/RoomContext'
import { ShellContext } from 'contexts/ShellContext'
import { Peer, VideoStreamType } from 'models/chat'

import { PeerVideo } from './PeerVideo'

interface PeerWithVideo {
  peer: Peer
  videoStream?: MediaStream
  screenStream?: MediaStream
}

export interface SelectedPeerStream {
  peerId: string
  videoStreamType: VideoStreamType
  videoStream: MediaStream
}

export interface RoomVideoDisplayProps {
  userId: string
}

export const RoomVideoDisplay = ({ userId }: RoomVideoDisplayProps) => {
  const shellContext = useContext(ShellContext)
  const roomContext = useContext(RoomContext)
  const [selectedPeerStream, setSelectedPeerStream] =
    useState<SelectedPeerStream | null>(null)

  const { peerList } = shellContext
  const {
    peerVideoStreams,
    selfVideoStream,
    peerScreenStreams,
    selfScreenStream,
  } = roomContext

  const peersWithVideo: PeerWithVideo[] = peerList.reduce(
    (acc: PeerWithVideo[], peer: Peer) => {
      const videoStream = peerVideoStreams[peer.peerId]
      const screenStream = peerScreenStreams[peer.peerId]

      if (videoStream || screenStream) {
        acc.push({
          peer,
          videoStream,
          screenStream,
        })
      }

      return acc
    },
    []
  )

  const numberOfVideos =
    (selfVideoStream ? 1 : 0) +
    (selfScreenStream ? 1 : 0) +
    peersWithVideo.reduce((sum, peerWithVideo) => {
      if (peerWithVideo.videoStream) sum++
      if (peerWithVideo.screenStream) sum++

      return sum
    }, 0)

  useEffect(() => {
    if (!selectedPeerStream) return

    if (numberOfVideos < 2) {
      setSelectedPeerStream(null)
      return
    }

    const allMediaStreams = [
      ...Object.values(peerVideoStreams),
      ...Object.values(peerScreenStreams),
      selfVideoStream,
      selfScreenStream,
    ]

    for (const mediaStream of allMediaStreams) {
      if (mediaStream?.id === selectedPeerStream.videoStream.id) {
        return
      }
    }

    setSelectedPeerStream(null)
  }, [
    numberOfVideos,
    peerScreenStreams,
    peerVideoStreams,
    selectedPeerStream,
    selfScreenStream,
    selfVideoStream,
  ])

  const handleVideoClick = (
    peerId: string,
    videoStreamType: VideoStreamType,
    videoStream: MediaStream
  ) => {
    if (selectedPeerStream?.videoStream === videoStream) {
      setSelectedPeerStream(null)
    } else if (numberOfVideos > 1) {
      setSelectedPeerStream({ peerId, videoStreamType, videoStream })
    }
  }

  return (
    <Paper
      className="RoomVideoDisplay"
      elevation={3}
      square
      sx={{
        alignContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        width: '85%',
      }}
    >
      {selectedPeerStream && (
        <Box sx={{ height: 'calc(85% - 1em)', mb: 'auto' }}>
          <PeerVideo
            numberOfVideos={numberOfVideos}
            onVideoClick={handleVideoClick}
            userId={userId}
            selectedPeerStream={selectedPeerStream}
            videoStream={selectedPeerStream.videoStream}
            videoStreamType={selectedPeerStream.videoStreamType}
          />
        </Box>
      )}
      <Box
        sx={{
          alignContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          flexGrow: 1,
          flexWrap: selectedPeerStream ? 'nowrap' : 'wrap',
          overflow: 'auto',
          width: '100%',
          ...(selectedPeerStream && {
            height: '15%',
            maxHeight: '15%',
          }),
        }}
      >
        {selfVideoStream && (
          <PeerVideo
            isSelfVideo
            numberOfVideos={numberOfVideos}
            onVideoClick={handleVideoClick}
            userId={userId}
            selectedPeerStream={selectedPeerStream}
            videoStream={selfVideoStream}
            videoStreamType={VideoStreamType.WEBCAM}
          />
        )}
        {selfScreenStream && (
          <PeerVideo
            numberOfVideos={numberOfVideos}
            onVideoClick={handleVideoClick}
            userId={userId}
            selectedPeerStream={selectedPeerStream}
            videoStream={selfScreenStream}
            videoStreamType={VideoStreamType.SCREEN_SHARE}
          />
        )}
        {peersWithVideo.map(peerWithVideo => (
          <Fragment key={peerWithVideo.peer.peerId}>
            {peerWithVideo.videoStream && (
              <PeerVideo
                numberOfVideos={numberOfVideos}
                onVideoClick={handleVideoClick}
                userId={peerWithVideo.peer.userId}
                selectedPeerStream={selectedPeerStream}
                videoStream={peerWithVideo.videoStream}
                videoStreamType={VideoStreamType.WEBCAM}
              />
            )}
            {peerWithVideo.screenStream && (
              <PeerVideo
                numberOfVideos={numberOfVideos}
                onVideoClick={handleVideoClick}
                userId={peerWithVideo.peer.userId}
                selectedPeerStream={selectedPeerStream}
                videoStream={peerWithVideo.screenStream}
                videoStreamType={VideoStreamType.SCREEN_SHARE}
              />
            )}
          </Fragment>
        ))}
      </Box>
    </Paper>
  )
}
