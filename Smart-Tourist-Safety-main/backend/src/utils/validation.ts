import { body } from 'express-validator';


export const locationValidator = () => [
body('location.lat').isFloat({ min: -90, max: 90 }),
body('location.lng').isFloat({ min: -180, max: 180 })
];