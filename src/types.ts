// 공통 타입 정의
export interface CssPosition {
  left: string;
  top: string;
  right: string;
  bottom: string;
  position: string;
}

export interface OverlayOptions {
  zIndex?: number;
  backgroundColor?: string;
  color?: string;
  padding?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
  boxShadow?: string;
  backdropFilter?: string;
  border?: string;
}

export type StatusType = "success" | "info" | "active" | "error";

export interface DragState {
  isDragging: boolean;
  draggedElem: HTMLElement | null;
  offsetX: number;
  offsetY: number;
  startParentRect: DOMRect | null;
  lastScrollX: number;
  lastScrollY: number;
}
