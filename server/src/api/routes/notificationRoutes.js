import { Router } from "express";
import {
  allAnnouncements,
  editAnnouncement,
  mine,
  read,
  send,
} from "../controllers/notificationController.js";
import { authenticate, allowRoles } from "../middleware/auth.js";
const router = Router();
router.use(authenticate);
router.get("/mine", allowRoles("farmer"), mine);
router.patch("/:id/read", allowRoles("farmer"), read);
router.post("/", allowRoles("staff", "technician", "admin"), send);
router.get("/announcements", allowRoles("staff", "technician", "admin"), allAnnouncements);
router.patch("/announcements/:id", allowRoles("staff", "technician", "admin"), editAnnouncement);
export default router;
