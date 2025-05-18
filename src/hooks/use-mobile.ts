import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const SMALL_MOBILE_BREAKPOINT = 480

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isSmallMobile: boolean;
  isLandscape: boolean;
  isHighDPI: boolean;
  isPrefersReducedMotion: boolean;
  isTouch: boolean | null;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isSmallMobile: false,
    isLandscape: false,
    isHighDPI: false,
    isPrefersReducedMotion: false,
    isTouch: null
  })

  React.useEffect(() => {
    // Function to update all device info
    const updateDeviceInfo = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      setDeviceInfo({
        isMobile: windowWidth < MOBILE_BREAKPOINT,
        isTablet: windowWidth >= MOBILE_BREAKPOINT && windowWidth < TABLET_BREAKPOINT,
        isSmallMobile: windowWidth < SMALL_MOBILE_BREAKPOINT,
        isLandscape: windowWidth > windowHeight,
        isHighDPI: window.devicePixelRatio >= 2,
        isPrefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0 || false
      })
    }
    
    // Initial check
    updateDeviceInfo();
    
    // Set up event listeners
    window.addEventListener('resize', updateDeviceInfo);
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', updateDeviceInfo);
    window.matchMedia('(orientation: landscape)').addEventListener('change', updateDeviceInfo);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.matchMedia('(prefers-reduced-motion: reduce)').removeEventListener('change', updateDeviceInfo);
      window.matchMedia('(orientation: landscape)').removeEventListener('change', updateDeviceInfo);
    }
  }, [])
  
  return deviceInfo
}
