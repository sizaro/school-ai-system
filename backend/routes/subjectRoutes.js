const router = express.Router();

router.post("/subjects", addSubject);
router.post("/subjects/assign", linkSubjectToClass);
router.get("/subjects/class/:class_id", fetchClassSubjects);

export default router;