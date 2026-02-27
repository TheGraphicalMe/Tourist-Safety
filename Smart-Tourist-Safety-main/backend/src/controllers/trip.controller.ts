import { Request, Response, NextFunction } from 'express';
import { Trip } from '../models/Trip.model';

// Create a new trip
export const createTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { startLocation, startDate, endDate, monitoringStart, monitoringEnd, destinations, stays, emergencyContact } = req.body;

    const trip = await Trip.create({
      user: userId,
      startLocation,
      startDate,
      endDate,
      monitoringStart,
      monitoringEnd,
      destinations,
      stays,
      emergencyContact,
    });

    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
};

// Get all trips for the logged-in user
export const listTrips = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const trips = await Trip.find({ user: userId }).sort({ startDate: -1 });
    res.json(trips);
  } catch (err) {
    next(err);
  }
};

// Get trip by ID
export const getTripById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (err) {
    next(err);
  }
};

// Update a trip
export const updateTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updated = await Trip.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Trip not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete a trip
export const deleteTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await Trip.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Trip not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
