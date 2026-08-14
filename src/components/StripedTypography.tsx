import React from 'react';

interface StripedTypographyProps {
  text: string;
  progress?: number; // 0 to 100
  color?: string;
  unfilledColor?: string;
  isVertical?: boolean;
  className?: string;
  height?: number;
}

export const StripedTypography: React.FC<StripedTypographyProps> = ({
  text,
  progress = 100,
  color = '#E0533C',
  unfilledColor = 'rgba(255, 255, 255, 0.18)',
  isVertical = false,
  className = '',
}) => {
  const safeId = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const basePatternId = `stripes-base-${safeId}`;
  const activePatternId = `stripes-active-${safeId}`;
  const maskId = `text-mask-${safeId}`;
  const clampedProgress = Math.max(0, Math.min(100, progress));

  if (isVertical) {
    // Vertical striped text: renders vertically along the spine, filling from top to bottom
    const charCount = text.length;
    const svgHeight = Math.max(380, charCount * 70);
    const svgWidth = 130;

    return (
      <div className={`relative inline-block select-none overflow-hidden ${className}`}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-h-[520px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* UNFILLED / BASE MUTED STRIPES */}
            <pattern
              id={basePatternId}
              width="100%"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="100%" height="5.5" fill={unfilledColor} />
              <rect x="0" y="5.5" width="100%" height="4.5" fill="transparent" />
            </pattern>

            {/* FILLED / ACTIVE VIBRANT COLOR STRIPES */}
            <pattern
              id={activePatternId}
              width="100%"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="100%" height="5.5" fill={color} />
              <rect x="0" y="5.5" width="100%" height="4.5" fill="transparent" />
            </pattern>

            {/* VERTICAL TEXT MASK */}
            <mask id={maskId}>
              <rect x="0" y="0" width="100%" height="100%" fill="black" />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(90, ${svgWidth / 2}, ${svgHeight / 2})`}
                fill="white"
                fontSize="115"
                fontWeight="900"
                fontFamily="'Space Grotesk', 'Playfair Display', Georgia, sans-serif"
                letterSpacing="0.08em"
              >
                {text.toLowerCase()}
              </text>
            </mask>
          </defs>

          {/* BASE UNFILLED STRIPED TEXT */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${basePatternId})`}
            mask={`url(#${maskId})`}
          />

          {/* PROGRESSIVELY FILLED STRIPED TEXT (from top to bottom) */}
          <rect
            x="0"
            y="0"
            width="100%"
            height={`${clampedProgress}%`}
            fill={`url(#${activePatternId})`}
            mask={`url(#${maskId})`}
            className="transition-all duration-100 ease-out"
          />
        </svg>
      </div>
    );
  }

  // Horizontal striped text: renders horizontally (like "work", "about"), filling from left to right
  const charLength = text.length;
  const svgWidth = Math.max(500, charLength * 125);
  const svgHeight = 220;

  return (
    <div className={`relative w-full select-none overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto max-h-[160px] sm:max-h-[220px] md:max-h-[280px]"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          {/* BASE MUTED STRIPES */}
          <pattern
            id={basePatternId}
            width="100%"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="100%" height="6.5" fill={unfilledColor} />
            <rect x="0" y="6.5" width="100%" height="5.5" fill="transparent" />
          </pattern>

          {/* ACTIVE VIBRANT COLOR STRIPES */}
          <pattern
            id={activePatternId}
            width="100%"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="100%" height="6.5" fill={color} />
            <rect x="0" y="6.5" width="100%" height="5.5" fill="transparent" />
          </pattern>

          {/* HORIZONTAL TEXT MASK */}
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <text
              x="0"
              y="68%"
              textAnchor="start"
              dominantBaseline="middle"
              fill="white"
              fontSize="200"
              fontWeight="900"
              fontFamily="'Space Grotesk', 'Playfair Display', Georgia, sans-serif"
              letterSpacing="-0.03em"
            >
              {text.toLowerCase()}
            </text>
          </mask>
        </defs>

        {/* BASE UNFILLED STRIPED TEXT */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={`url(#${basePatternId})`}
          mask={`url(#${maskId})`}
        />

        {/* PROGRESSIVELY FILLED ACTIVE STRIPED TEXT (from left to right) */}
        <rect
          x="0"
          y="0"
          width={`${clampedProgress}%`}
          height="100%"
          fill={`url(#${activePatternId})`}
          mask={`url(#${maskId})`}
          className="transition-all duration-100 ease-out"
        />
      </svg>
    </div>
  );
};
