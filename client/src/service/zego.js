import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

let zegoInstance = null;

const requestMediaPermission = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.error('Failed to get media permission', error);
        return false;
    }
};

export const joinRoom = async (roomId, userId, userName, container, onJoinCallback, onLeaveCallback) => {
    if (!container) throw new Error('Container element is required');

    const appId = parseInt(process.env.REACT_APP_ZEGO_APP_ID);
    const appSign = process.env.REACT_APP_ZEGO_APP_SIGN;

    if (zegoInstance) {
        try {
            zegoInstance.destroy();
            zegoInstance = null;
        } catch (error) {
            console.error('Error cleaning up zego instance', error);
        }
    }

    let hasPermission = false;
    try {
        hasPermission = await requestMediaPermission();
    } catch (error) {
        console.warn('Permission error', error);
    }

    // असं करा
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appId,
        appSign,
        roomId,
        userId.toString(),
        userName || `User_${userId}`
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    await new Promise(resolve => setTimeout(resolve, 100));

    zp.joinRoom({
        container: container,
        scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
        turnOnCameraWhenJoining: hasPermission,
        turnOnMicrophoneWhenJoining: hasPermission,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showTextChat: true,
        showUserList: true,
        onJoinRoom: () => {
            if (onJoinCallback) onJoinCallback();
        },
        onLeaveRoom: () => {
            if (onLeaveCallback) onLeaveCallback();
        },
        onError: (error) => {
            console.error('ZEGO room error', error);
        },
    });

    zegoInstance = zp;
    return zp;
};

export const leaveRoom = (onLeaveCallback) => {
    if (!zegoInstance) {
        if (onLeaveCallback) onLeaveCallback();
        return;
    }
    try {
        zegoInstance.destroy();
    } catch (error) {
        console.error('Error leaving zego room', error);
    } finally {
        zegoInstance = null;
        if (onLeaveCallback) onLeaveCallback();
    }
};

export const getZegoInstance = () => zegoInstance;

export const hasUserJoined = () => zegoInstance !== null;