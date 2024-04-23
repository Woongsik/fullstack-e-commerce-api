import express from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })

import { passportAuthenticate } from '../misc/utils/AuthUtil';
import { uploadFile, deleteFileById } from '../controllers/filesController';

const router = express.Router();

router.post('/upload', passportAuthenticate(), upload.single('file'), uploadFile);
router.delete('/:imageId', passportAuthenticate(), deleteFileById);

export default router;
