// 공통 타입 정의
export interface DragState {
  isDragging: boolean;
  draggedElem: HTMLElement | null;
  offsetX: number;
  offsetY: number;
  startParentRect: DOMRect | null;
  lastScrollX: number;
  lastScrollY: number;
}

export interface Position {
  left: number;
  top: number;
  right: number;
  bottom: number;
  position: string;
}

export interface OverlayConfig {
  showOverlay: boolean;
  overlayPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  overlayOpacity: number;
}

export interface ExtensionSettings {
  enabled: boolean;
  config: OverlayConfig;
}
