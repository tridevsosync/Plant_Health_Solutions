/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extracts Vimeo ID from Vimeo URL
 */
export function getVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:vimeo)\.com(?:\/channels\/(?:\w+\/)?|\/groups\/[^\/]*\/videos\/|video\/|\/)?(\d+)/);
  return match ? match[1] : null;
}

/**
 * Returns embed info and URL for any video source
 */
export function getVideoInfo(videoUrlOrLink: string): {
  type: "youtube" | "vimeo" | "direct" | "unknown";
  embedUrl: string;
  thumbnailUrl: string;
} {
  if (!videoUrlOrLink) {
    return { type: "unknown", embedUrl: "", thumbnailUrl: "" };
  }

  const clean = videoUrlOrLink.trim();

  // YouTube check
  const ytId = getYouTubeId(clean);
  if (ytId) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    };
  }

  // Vimeo check
  const vimeoId = getVimeoId(clean);
  if (vimeoId) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      thumbnailUrl: "",
    };
  }

  // Direct video file (Cloudinary, MP4, WebM)
  if (clean.match(/\.(mp4|webm|ogg|mov)$/i) || clean.includes("/video/upload/")) {
    return {
      type: "direct",
      embedUrl: clean,
      thumbnailUrl: "",
    };
  }

  return {
    type: "direct",
    embedUrl: clean,
    thumbnailUrl: "",
  };
}
