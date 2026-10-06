import { pool } from "../../config/db.js";

export async function createAnnouncementWithNotifications({
  farmerIds,
  createdBy,
  recipientMode,
  recipientValue,
  message,
  type,
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [announcementResult] = await connection.query(
      `INSERT INTO announcements
       (created_by, recipient_mode, recipient_value, message, type)
       VALUES (?, ?, ?, ?, ?)`,
      [createdBy, recipientMode, recipientValue || null, message, type]
    );

    const announcementId = announcementResult.insertId;
    const values = farmerIds.map(farmerId => [
      farmerId, createdBy, announcementId, message, type,
    ]);

    if (values.length) {
      await connection.query(
        `INSERT INTO notifications
         (farmer_id, created_by, announcement_id, message, type)
         VALUES ?`,
        [values]
      );
    }

    await connection.commit();
    return { id: announcementId, count: values.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listAnnouncements() {
  const [rows] = await pool.query(
    `SELECT a.*, u.full_name AS created_by_name,
            COUNT(n.id) AS recipient_count
     FROM announcements a
     LEFT JOIN users u ON u.id = a.created_by
     LEFT JOIN notifications n ON n.announcement_id = a.id
     GROUP BY a.id, u.id
     ORDER BY a.created_at DESC`
  );
  return rows;
}

export async function updateAnnouncement(id, { message, type }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "UPDATE announcements SET message = ?, type = ? WHERE id = ?",
      [message, type, id]
    );

    if (!result.affectedRows) {
      await connection.rollback();
      return null;
    }

    await connection.query(
      "UPDATE notifications SET message = ?, type = ? WHERE announcement_id = ?",
      [message, type, id]
    );

    const [rows] = await connection.query(
      "SELECT * FROM announcements WHERE id = ?",
      [id]
    );

    await connection.commit();
    return rows[0] || null;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}