import { Request, Response } from 'express';
import db from '../database/db';
import { Plate, CreatePlateDTO } from '../types';

export const createPlate = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No se proporcionó una imagen' });
      return;
    }

    const { plate_number, date, description } = req.body as CreatePlateDTO;

    if (!plate_number || !date) {
      res.status(400).json({ error: 'Faltan campos requeridos: plate_number y date' });
      return;
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const stmt = db.prepare(`
      INSERT INTO plates (plate_number, image_path, date, description)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(plate_number, imagePath, date, description || null);

    const newPlate = db.prepare('SELECT * FROM plates WHERE id = ?').get(result.lastInsertRowid) as Plate;

    res.status(201).json(newPlate);
  } catch (error) {
    console.error('Error al crear matrícula:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getPlates = (req: Request, res: Response): void => {
  try {
    const { plate_number, date_from, date_to } = req.query;

    let query = 'SELECT * FROM plates WHERE 1=1';
    const params: any[] = [];

    if (plate_number) {
      query += ' AND plate_number LIKE ?';
      params.push(`%${plate_number}%`);
    }

    if (date_from) {
      query += ' AND date >= ?';
      params.push(date_from);
    }

    if (date_to) {
      query += ' AND date <= ?';
      params.push(date_to);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const plates = stmt.all(...params) as Plate[];

    res.json(plates);
  } catch (error) {
    console.error('Error al obtener matrículas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getPlateById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('SELECT * FROM plates WHERE id = ?');
    const plate = stmt.get(id) as Plate | undefined;

    if (!plate) {
      res.status(404).json({ error: 'Matrícula no encontrada' });
      return;
    }

    res.json(plate);
  } catch (error) {
    console.error('Error al obtener matrícula:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
