import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Eye, ExternalLink, Download, FileSpreadsheet, Presentation, LayoutDashboard, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../lib/audio';
import { assetPreloader, AssetLoadState } from '../lib/assetPreloader';
import { EditorialSkeleton } from './EditorialSkeleton';
import { Project } from '../types';

interface ProjectMediaFrameProps {
  id?: string;
  project?: Project;
  mediaType?: string;
  type?: 'video' | 'image' | 'dashboard' | 'excel' | 'presentation' | 'app';
  title?: string;
  category?: string;
  imageUrl?: string;
  videoUrl?: string;
  posterUrl?: string;
  externalUrl?: string;
  downloadUrl?: string;
  accentColor?: string;
  className?: string;
}

export const ProjectMediaFrame: React.FC<ProjectMediaFrameProps> = ({
  id: propId,
  project,
  mediaType,
  type: propType,
  title: propTitle,
  category: propCategory,
  imageUrl: propImageUrl,
  videoUrl: propVideoUrl,
  posterUrl: propPosterUrl,
  externalUrl: propExternalUrl,
  downloadUrl: propDownloadUrl,
  accentColor = '#E0533C',
  className = '',
}) => {
  const id = project?.id || propId || 'project-media';
  const type = (mediaType || propType || (project?.videoUrl ? 'video' : 'image')) as 'video' | 'image' | 'dashboard' | 'excel' | 'presentation' | 'app';
  const title = project?.title || propTitle || '';
  const category = project?.category || propCategory || '';
  const imageUrl = project?.image || propImageUrl || '';
  const videoUrl = project?.videoUrl || propVideoUrl;
  const posterUrl = propPosterUrl || project?.image;
  const externalUrl = project?.externalUrl || propExternalUrl;
  const downloadUrl = propDownloadUrl;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearProximity, setIsNearProximity] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAssetCached, setIsAssetCached] = useState(false);
  const [loadProgress, setLoadProgress] = useState(25);
  const [loadState, setLoadState] = useState<AssetLoadState>('idle');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Near-proximity viewport detection (Lazy Render Buffer)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsNearProximity(true);
      return;
    }

    const isImageCached = assetPreloader.isCached(posterUrl || imageUrl);
    const isVideoCached = videoUrl ? assetPreloader.isCached(videoUrl) : true;
    if (isImageCached && isVideoCached) {
      setIsNearProximity(true);
      setIsAssetCached(true);
      setLoadState('loaded');
      setLoadProgress(100);
      return;
    }

    const proximityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearProximity(true);
            setLoadState('intersecting');
            proximityObserver.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: '350px 0px 350px 0px',
        threshold: 0.01,
      }
    );

    proximityObserver.observe(container);
    return () => proximityObserver.disconnect();
  }, [imageUrl, posterUrl, videoUrl]);

  // Staggered IntersectionObserver pre-loader once near-proximity is reached
  useEffect(() => {
    if (!isNearProximity) return;

    const container = containerRef.current;
    if (!container) return;

    const cleanup = assetPreloader.observeMediaElement(
      container,
      { image: posterUrl || imageUrl, video: videoUrl },
      (loaded, progress, state) => {
        setLoadProgress(progress);
        if (state) setLoadState(state);
        if (loaded) {
          setIsAssetCached(true);
        }
      }
    );

    return () => cleanup();
  }, [isNearProximity, imageUrl, posterUrl, videoUrl]);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
        audioManager.startVideoAudio();
      } else {
        audioManager.stopVideoAudio();
      }
    }
  };

  // IntersectionObserver to only autoplay videos when actually visible in viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getBadgeIcon = () => {
    switch (type) {
      case 'video':
        return <Play className="w-3.5 h-3.5" />;
      case 'excel':
        return <FileSpreadsheet className="w-3.5 h-3.5" />;
      case 'presentation':
        return <Presentation className="w-3.5 h-3.5" />;
      case 'dashboard':
        return <LayoutDashboard className="w-3.5 h-3.5" />;
      case 'app':
        return <Smartphone className="w-3.5 h-3.5" />;
      default:
        return <Eye className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full rounded-none overflow-hidden border border-white/15 bg-[#121216] group ${className}`}
    >
      {/* LOW-FIDELITY BLURRED PLACEHOLDER & SKELETON WITH CROSS-FADE */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-700 pointer-events-none ${
          isAssetCached ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          className="absolute inset-0 filter blur-xl opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`,
          }}
        />

        <EditorialSkeleton
          aspectRatio=""
          className="h-full"
          loadProgress={loadProgress}
          label={isNearProximity ? "DECODING_FRAME" : "PRE_BUFFERING"}
          state={loadState}
        />
      </div>

      {/* High-Resolution Media (Dynamically Mounted on Proximity) */}
      {isNearProximity && (
        <div
          className={`relative w-full h-full transition-opacity duration-700 ${
            isAssetCached ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {videoUrl && !videoError ? (
            <div className="relative w-full h-full overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl || imageUrl}
                muted
                loop
                playsInline
                onLoadedData={() => {
                  setVideoLoaded(true);
                  setIsAssetCached(true);
                  setLoadProgress(100);
                  setLoadState('loaded');
                }}
                onError={() => setVideoError(true)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {!videoLoaded && (
                <img
                  src={posterUrl || imageUrl}
                  alt={title}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                decoding="async"
                loading="lazy"
                onLoad={() => {
                  setIsAssetCached(true);
                  setLoadProgress(100);
                  setLoadState('loaded');
                }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            </div>
          )}
        </div>
      )}

      {/* Editorial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity pointer-events-none" />

      {/* Top Media Metadata Tag */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span
          className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest font-bold text-white rounded-none flex items-center gap-1.5 backdrop-blur-md shadow-md"
          style={{ backgroundColor: `${accentColor}DD` }}
        >
          {getBadgeIcon()}
          <span>{category}</span>
        </span>
        {type === 'video' && isVisible && (
          <span className="px-2 py-1 bg-emerald-500/80 text-white font-mono text-[9px] uppercase tracking-widest rounded-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE MOTION
          </span>
        )}
      </div>

      {/* Top Right Volume Control Button */}
      {videoUrl && !videoError && isNearProximity && (
        <button
          onClick={toggleSound}
          className="absolute top-4 right-4 z-30 px-2.5 py-1.5 bg-black/80 hover:bg-black text-white rounded-full flex items-center gap-1.5 border border-white/25 backdrop-blur-md transition-all shadow-xl hover:scale-105 cursor-pointer"
          title={isMuted ? "Turn Sound ON" : "Turn Sound OFF"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] font-mono uppercase font-bold text-rose-300">SOUND OFF</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-300">SOUND ON</span>
            </>
          )}
        </button>
      )}

      {/* Center Interactive Cursor Cue */}
      <motion.div
        animate={{ scale: isHovered ? 1 : 0.9, opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-mono text-[10px] tracking-widest uppercase font-bold shadow-2xl backdrop-blur-md border border-white/30"
          style={{ backgroundColor: `${accentColor}EE` }}
        >
          {downloadUrl ? (
            <>
              <Download className="w-5 h-5 mb-0.5" />
              <span>APK</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 mb-0.5" />
              <span>VIEW</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Bottom Frame Details */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-4">
        <div className="max-w-[70%]">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block mb-0.5">
            CASE STUDY // 2026
          </span>
          <h4 className="font-serif text-lg sm:text-xl font-medium text-white truncate group-hover:text-emerald-300 transition-colors">
            {title}
          </h4>
        </div>

        {downloadUrl ? (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-none flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD APK</span>
          </a>
        ) : externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-xs font-semibold uppercase tracking-wider rounded-none flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
          >
            <span>EXPLORE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : null}
      </div>
    </div>
  );
};
