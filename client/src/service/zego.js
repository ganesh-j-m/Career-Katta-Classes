export const joinRoom = async (roomId, userId, userName, container, onJoinCallback, onLeaveCallback) => {
    if (!container) throw new Error('Container element is required');

    const appId = parseInt(process.env.REACT_APP_ZEGO_APP_ID);
    const appSign = process.env.REACT_APP_ZEGO_APP_SIGN;

    let hasPermission = false;
    try {
        hasPermission = await requestMediaPermission();
    } catch (error) {
        console.warn('Permission error', error);
    }

    const zp = ZegoUIKitPrebuilt.create(
        ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId,
            appSign,
            roomId,
            userId.toString(),
            userName || `User_${userId}`
        )
    );

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