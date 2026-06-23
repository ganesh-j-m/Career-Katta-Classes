import express from 'express';
import { body, validationResult } from 'express-validator';
import { getSession, createSession, leaveSession, endSession, JoinSession, listSession } from '../controllers/sessionControllers.js';
import { protect } from '../middleware/auth.js';
import { generateZegoToken } from '../utils/zegoToken.js';

const router = express.Router();

const handleValidationError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg
        });
    }
    next();
};

router.use(protect);

router.get('/list', listSession);

router.get('/zego-token', (req, res) => {
    try {
        const { roomId } = req.query;
        const userId = req.user.userId;
        const token = generateZegoToken(
            process.env.ZEGO_APP_ID,
            process.env.ZEGO_SERVER_SECRET,
            roomId,
            userId
        );
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/create', createSession);

router.post(
    '/join',
    [body('roomId').trim().notEmpty().withMessage('RoomId is required')],
    handleValidationError,
    JoinSession
);

router.post('/end/:sessionId', endSession);

router.post(
    '/leave',
    [body('roomId').trim().notEmpty().withMessage('RoomId is required')],
    handleValidationError,
    leaveSession
);

router.get('/:roomId', getSession);

export default router;