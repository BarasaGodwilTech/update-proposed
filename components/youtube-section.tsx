"use client"

import { useState, useEffect, useRef } from "react"
import { Youtube, ThumbsUp, MessageSquare, Volume2, VolumeX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

// YouTube API Configuration
const YT_API_KEY = "AIzaSyBnhvlEoMzX9A_DIq5Lks74m_S5CBL9jXU"
const PLAYLIST_ID = "PL3UeMmSqW6uaESNSPkwr-RMrZJNiOUmYV"

interface Video {
  id: string
  title: string
  thumbnail: string
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function YouTubeSection() {
  const [volume, setVolume] = useState([0])
  const [isMuted, setIsMuted] = useState(true)
  const [player, setPlayer] = useState<any>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [currentVideoId, setCurrentVideoId] = useState("")
  const playerRef = useRef<HTMLDivElement>(null)

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    } else {
      initializePlayer()
    }

    fetchPlaylistVideos()
  }, [])

  const initializePlayer = () => {
    if (playerRef.current && window.YT) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: "100%",
        width: "100%",
        videoId: "",
        playerVars: {
          playsinline: 1,
          autoplay: 0,
          mute: 1,
          loop: 1,
          playlist: PLAYLIST_ID,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target)
            const videoData = event.target.getVideoData()
            if (videoData.video_id) {
              setCurrentVideoId(videoData.video_id)
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              const videoData = event.target.getVideoData()
              if (videoData.video_id) {
                setCurrentVideoId(videoData.video_id)
              }
            }
          },
        },
      })
    }
  }

  const fetchPlaylistVideos = async () => {
    try {
      let nextPageToken = ""
      let allVideos: Video[] = []

      do {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YT_API_KEY}&pageToken=${nextPageToken}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch videos")
        }

        const data = await response.json()

        allVideos = allVideos.concat(
          data.items.map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
          })),
        )

        nextPageToken = data.nextPageToken || ""
      } while (nextPageToken)

      setVideos(allVideos)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching playlist videos:", error)
      setLoading(false)
    }
  }

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute()
        player.setVolume(50)
        setVolume([50])
        setIsMuted(false)
      } else {
        player.mute()
        setVolume([0])
        setIsMuted(true)
      }
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    if (player) {
      const vol = newVolume[0]
      setVolume(newVolume)
      player.setVolume(vol)

      if (vol === 0) {
        player.mute()
        setIsMuted(true)
      } else {
        player.unMute()
        setIsMuted(false)
      }
    }
  }

  const otherVideos = videos.filter((video) => video.id !== currentVideoId).slice(0, 6)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-0 flex items-center gap-3">
            <Youtube className="w-8 h-8 text-red-600" />
            Tech Videos & Reviews
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <Button variant="ghost" size="sm" onClick={toggleMute} className="p-2 h-auto">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-20"
                disabled={!player}
              />
            </div>

            <Button variant="outline" asChild className="bg-red-600 text-white border-red-600 hover:bg-red-700">
              <a href="https://www.youtube.com/@Willstech.storeug" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4 mr-2" />
                Subscribe
              </a>
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video relative">
            <div ref={playerRef} className="w-full h-full" />
          </div>

          <div className="p-6 flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a
                href={`https://www.youtube.com/watch?v=${currentVideoId}&like=1`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`https://www.youtube.com/watch?v=${currentVideoId}#comments`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Comment
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-foreground mb-6">More Videos:</h3>

          {loading ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading videos...
              </div>
            </div>
          ) : otherVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherVideos.map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No additional videos available.</div>
          )}
        </div>
      </div>
    </section>
  )
}
