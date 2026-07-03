import type { SVGProps } from 'react'

// Lightweight line-icon set (stroke = currentColor). One consistent grid: 24×24.
type P = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconSearch = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Base>
)
export const IconFilter = (p: P) => (
  <Base {...p}>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </Base>
)
export const IconGrid = (p: P) => (
  <Base {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Base>
)
export const IconRows = (p: P) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
)
export const IconBox = (p: P) => (
  <Base {...p}>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="M3 8l9 5 9-5M12 13v8" />
  </Base>
)
export const IconTruck = (p: P) => (
  <Base {...p}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </Base>
)
export const IconUsers = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M17 19a5.5 5.5 0 0 0-2.5-4.6" />
  </Base>
)
export const IconTag = (p: P) => (
  <Base {...p}>
    <path d="M3 12V4h8l9 9-8 8-9-9Z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </Base>
)
export const IconSliders = (p: P) => (
  <Base {...p}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Base>
)
export const IconCart = (p: P) => (
  <Base {...p}>
    <path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H6" />
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
  </Base>
)
export const IconChevronDown = (p: P) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
)
export const IconChevronRight = (p: P) => (
  <Base {...p}>
    <path d="m9 6 6 6-6 6" />
  </Base>
)
export const IconArrowRight = (p: P) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
)
export const IconPlus = (p: P) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)
export const IconTrash = (p: P) => (
  <Base {...p}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </Base>
)
export const IconPencil = (p: P) => (
  <Base {...p}>
    <path d="M4 20h4L20 8l-4-4L4 16v4Z" />
    <path d="m14 6 4 4" />
  </Base>
)
export const IconSun = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
  </Base>
)
export const IconMoon = (p: P) => (
  <Base {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
  </Base>
)
export const IconCheck = (p: P) => (
  <Base {...p}>
    <path d="m5 12 5 5 9-11" />
  </Base>
)
export const IconClose = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)
export const IconBuilding = (p: P) => (
  <Base {...p}>
    <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 10h4a1 1 0 0 1 1 1v10M4 21h18" />
    <path d="M7.5 8h3M7.5 12h3M7.5 16h3" />
  </Base>
)
export const IconLayers = (p: P) => (
  <Base {...p}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </Base>
)
export const IconExternal = (p: P) => (
  <Base {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Base>
)
export const IconMenu = (p: P) => (
  <Base {...p}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Base>
)
export const IconInfo = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Base>
)
export const IconCube = (p: P) => (
  <Base {...p}>
    <path d="M21 7.5 12 2 3 7.5v9L12 22l9-5.5v-9Z" />
    <path d="M3 7.5 12 13l9-5.5M12 13v9" />
  </Base>
)
export const IconDoc = (p: P) => (
  <Base {...p}>
    <path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7l-4-4Z" />
    <path d="M14 3v4h4M9 13h6M9 17h4" />
  </Base>
)
export const IconDownload = (p: P) => (
  <Base {...p}>
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
  </Base>
)
export const IconUpload = (p: P) => (
  <Base {...p}>
    <path d="M12 15V3m0 0 4 4m-4-4L8 7M5 21h14" />
  </Base>
)
export const IconChevronLeft = (p: P) => (
  <Base {...p}>
    <path d="m15 6-6 6 6 6" />
  </Base>
)
export const IconPanelLeft = (p: P) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </Base>
)
