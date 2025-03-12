import { Router } from "express";

const router = Router();

router.use('/v1', (req, res) => {
    res.status(200).json('Success')
});

export default router;