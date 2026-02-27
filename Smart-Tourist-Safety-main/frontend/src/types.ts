export interface Destination {
  place: string;
  date: string;
  activity?: string;
  confirmed?: boolean;
}

export interface Stay {
  hotelName: string;
  address?: string;
  checkIn: string;
  checkOut?: string;
}

export interface Trip {
  _id: string;
  startLocation: string;
  startDate: string;
  endDate: string;
  monitoringStart: string;
  monitoringEnd: string;
  destinations: Destination[];
  stays: Stay[];
  emergencyContact: string;
}
