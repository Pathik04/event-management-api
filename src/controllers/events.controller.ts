import { Request, Response, NextFunction } from "express";
import db from "../db/index.js";
import { ApiError } from "../middlewares/ApiError.js";
import { upcomingComparator } from "../utils/comparators.js";

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, at, location, capacity } = req.body;

    if (!title || !at || !location || !capacity) {
      throw new ApiError(400, "Missing required fields");
    }

    if (capacity <= 0 || capacity > 1000) {
      throw new ApiError(400, "Capacity must be between 1 and 1000");
    }

    const result = await db.one(
      `INSERT INTO events (title, at, location, capacity)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [title, at, location, capacity]
    );

    res.status(201).json({ eventId: result.id });
  } catch (err) {
    next(err);
  }
}

export async function getEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const event = await db.oneOrNone("SELECT * FROM events WHERE id=$1", [id]);
    if (!event) throw new ApiError(404, "Event not found");

    const registrations = await db.any(
      "SELECT u.id, u.name, u.email FROM registrations r JOIN users u ON u.id=r.user_id WHERE r.event_id=$1",
      [id]
    );

    res.json({ ...event, registrations });
  } catch (err) {
    next(err);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    await db.tx(async (t) => {
      const event = await t.one("SELECT * FROM events WHERE id=$1 FOR UPDATE", [
        id,
      ]);

      if (new Date(event.at) < new Date())
        throw new ApiError(400, "Event is in the past");

      const dup = await t.oneOrNone(
        "SELECT 1 FROM registrations WHERE user_id=$1 AND event_id=$2",
        [userId, id]
      );
      if (dup) throw new ApiError(409, "Already registered");

      const { count } = await t.one(
        "SELECT COUNT(*) FROM registrations WHERE event_id=$1",
        [id],
        (r) => ({ count: Number(r.count) })
      );
      if (count >= event.capacity) throw new ApiError(400, "Event is full");

      await t.none(
        "INSERT INTO registrations (user_id, event_id) VALUES ($1,$2)",
        [userId, id]
      );
    });

    res.json({ message: "Registered" });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const result = await db.result(
      "DELETE FROM registrations WHERE user_id=$1 AND event_id=$2",
      [userId, id]
    );
    if (!result.rowCount) throw new ApiError(404, "Not registered");

    res.json({ message: "Cancelled" });
  } catch (err) {
    next(err);
  }
}

export async function listUpcoming(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const events = await db.any("SELECT * FROM events WHERE at > NOW()");
    events.sort(upcomingComparator);
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function stats(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const event = await db.oneOrNone(
      "SELECT capacity FROM events WHERE id=$1",
      [id]
    );
    if (!event) throw new ApiError(404, "Event not found");

    const { count } = await db.one(
      "SELECT COUNT(*) FROM registrations WHERE event_id=$1",
      [id],
      (r) => ({ count: Number(r.count) })
    );
    res.json({
      totalRegistrations: count,
      remainingCapacity: event.capacity - count,
      percentageUsed: Number(((count / event.capacity) * 100).toFixed(2)),
    });
  } catch (err) {
    next(err);
  }
}
