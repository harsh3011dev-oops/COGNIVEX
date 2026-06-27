const multer = require('multer');

const MAX_FILE_SIZE_BYTES = parseInt(process.env.QUIZ_MAX_FILE_MB, 10) * 1024 * 1024 || 10 * 1024 * 1024;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
            return;
        }
        cb(new Error('Only PDF files are allowed.'), false);
    },
});

function handleUpload(req, res, next) {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    success: false,
                    error: 'PDF must be under 10MB.',
                    code: 'FILE_TOO_LARGE',
                });
            }
            return res.status(400).json({
                success: false,
                error: err.message || 'Upload failed.',
                code: 'UPLOAD_ERROR',
            });
        }

        if (err) {
            return res.status(400).json({
                success: false,
                error: err.message || 'Upload failed.',
                code: 'UPLOAD_ERROR',
            });
        }

        next();
    });
}

module.exports = { handleUpload };
