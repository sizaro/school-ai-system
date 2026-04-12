const router = express.Router();

router.post("/performance", addPerformance);
router.get("/performance/:student_id/:term_id", fetchPerformance);

export default router;
