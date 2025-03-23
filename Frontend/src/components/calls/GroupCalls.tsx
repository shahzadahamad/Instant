import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useEffect, useRef } from 'react';


const GroupCalls = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const appID = import.meta.env.VITE_ZEGO_CLOUD_APPID
    const serverSecret = process.env.VITE_ZEGO_CLOUD_SERVER_SECRECT;
    const token = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const zp = ZegoUIKitPrebuilt.create(token);
    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
      showScreenSharingButton: true,
      showLeaveRoomConfirmDialog: true,
    });
  }, [userID, userName, roomID]);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default GroupCalls
