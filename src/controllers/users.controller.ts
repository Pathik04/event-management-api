// src/controllers/users.controller.ts
import { Request, Response, NextFunction } from 'express';
import db from '../db/index.js';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const user = await db.one(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
