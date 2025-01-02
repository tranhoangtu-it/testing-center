import { useState, useEffect, useRef } from 'react';

interface UseFullscreenOptions {
  onExit?: () => void;
  onError?: (error: Error) => void;
}

export const useFullscreen = (options: UseFullscreenOptions = {}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Xử lý sự thay đổi trạng thái fullscreen
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Gọi callback khi thoát fullscreen
      if (!isCurrentlyFullscreen && options.onExit) {
        options.onExit();
      }
    };

    // Xử lý khi user chuyển tab hoặc cửa sổ khác
    const handleVisibilityChange = () => {
      if (document.hidden && isFullscreen && options.onExit) {
        options.onExit();
      }
    };

    // Đăng ký các event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup khi component unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFullscreen, options.onExit]);

  // Hàm vào chế độ toàn màn hình
  const enterFullscreen = async () => {
    try {
      if (elementRef.current) {
        await elementRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      if (options.onError) {
        options.onError(error as Error);
      }
    }
  };

  // Hàm thoát chế độ toàn màn hình
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      if (options.onError) {
        options.onError(error as Error);
      }
    }
  };

  // Hàm toggle chế độ toàn màn hình
  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  };

  return {
    elementRef,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};