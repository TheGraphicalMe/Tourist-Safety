// import { Request, Response, NextFunction } from 'express';
// import {Incident} from '../models/Incident.model';
// import { io } from '../server';


// export const reportIncident = async (req: Request, res: Response, next: NextFunction) => {
// try {
//     const userId = (req as any).userId;
//     const incident = await Incident.create({ ...req.body, reportedBy: userId });


//     // emit to sockets
//     io.emit('incident_reported', incident);


//     res.status(201).json(incident);
// } catch (err) {
// next(err);
// }
// };


// export const listIncidents = async (req: Request, res: Response, next: NextFunction) => {
// try {
// const incidents = await Incident.find().sort({ createdAt: -1 });
// res.json(incidents);
// } catch (err) {
// next(err);
// }
// };


// export const getIncident = async (req: Request, res: Response, next: NextFunction) => {
// try {
// const { id } = req.params;
// const incident = await Incident.findById(id);
// res.json(incident);
// } catch (err) {
// next(err);
// }
// };


// export const panicIncident = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).userId; // from auth middleware
//     const { location, description } = req.body;

//     if (!location?.lat || !location?.lng) {
//       return res.status(400).json({ message: "Location with lat & lng is required" });
//     }

//     const incident = new Incident({
//       reportedBy: userId,
//       type: "panic",
//       location,
//       description,
//     });

//     await incident.save();

//     res.status(201).json({ message: "Panic incident reported", incident });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// };

// export const emergencyNotify = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).userId;
//     const { location, description } = req.body;

//     if (!location?.lat || !location?.lng) {
//       return res.status(400).json({ message: "Location with lat & lng is required" });
//     }

//     const incident = new Incident({
//       reportedBy: userId,
//       type: "emergency",
//       location,
//       description,
//     });

//     await incident.save();

//     // TODO: Add notification logic (SMS/email/push) to authorities

//     res.status(201).json({ message: "Emergency incident reported", incident });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// };

// export const efirIncident = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).userId;
//     const { location, description, details } = req.body;

//     if (!location?.lat || !location?.lng) {
//       return res.status(400).json({ message: "Location with lat & lng is required" });
//     }

//     const incident = new Incident({
//       reportedBy: userId,
//       type: "efir",
//       location,
//       description,
//       // Optional extra details specific to E-FIR
//       details,
//       status: "reported",
//     });

//     await incident.save();

//     // TODO: Integrate with police database / send notifications

//     res.status(201).json({ message: "E-FIR submitted successfully", incident });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err });
//   }
// };

import { Request, Response, NextFunction } from 'express';
import { Incident } from '../models/Incident.model';
import { io } from '../server';

export const reportIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const incident = await Incident.create({ ...req.body, reportedBy: userId });

    io.emit('incident_reported', incident);
    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
};

export const listIncidents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    next(err);
  }
};

export const getIncident = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const incident = await Incident.findById(id);
    res.json(incident);
  } catch (err) {
    next(err);
  }
};

export const panicIncident = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { location, description } = req.body;

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location with lat & lng is required" });
    }

    const incident = new Incident({
      reportedBy: userId,
      type: "panic",
      location,
      description,
    });

    await incident.save();
    res.status(201).json({ message: "Panic incident reported", incident });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const emergencyNotify = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { location, description } = req.body;

    if (!location?.lat || !location?.lng) {
      return res.status(400).json({ message: "Location with lat & lng is required" });
    }

    const incident = new Incident({
      reportedBy: userId,
      type: "emergency",
      location,
      description,
    });

    await incident.save();
    res.status(201).json({ message: "Emergency incident reported", incident });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Updated EFIR controller to handle real file uploads
export const efirIncident = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { location, description, details } = req.body;

    // Location is now optional for EFIR

    // Get uploaded files from multer
    const uploadedFiles = (req.files as Express.Multer.File[] || []).map(file => ({
      originalName: file.originalname,
      storedName: file.filename,
      path: file.path,
    }));

    const incident = new Incident({
      reportedBy: userId,
      type: "efir",
      location,
      description,
      details: details ? JSON.parse(details) : {},
      uploadedFiles,
      status: "reported",
    });

    await incident.save();

    res.status(201).json({ message: "E-FIR submitted successfully", incident });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
