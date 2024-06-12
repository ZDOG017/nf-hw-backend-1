import mongoose from 'mongoose';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventModel, { IEvent } from './models/Event';
import { Event } from './types/response';
import { SortOrder } from 'mongoose';

class EventService {
  
    async getEventById(id: string): Promise<IEvent | null> {
      return await EventModel.findById(id).exec();
    }

    async getEventsByCity(city: string, page: number, limit: number, sortBy: string, sortDirection: 'asc' | 'desc'): Promise<IEvent[]> {
      const skip = (page - 1) * limit;
      const sortOptions: { [key: string]: SortOrder } = { [sortBy]: sortDirection === 'desc' ? -1 : 1 };
  
      const events = await EventModel.find({ city })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();
  
      console.log('Events found:', events); // Log events found
      return events;
    }
  
    async countEventsByCity(city: string): Promise<number> {
      return await EventModel.countDocuments({ city }).exec();
    }

    async getEvents(): Promise<IEvent[]> {
      return await EventModel.find().exec(); 
    }

    async createEvent(createEventDto: CreateEventDto): Promise<IEvent> {
      const { name, description, date, location ,duration} = createEventDto;
      const newEvent = new EventModel({
        name,
        description,
        date: new Date(date),
        location,
        duration
      });
  
      await newEvent.save();
      return newEvent;
    }
  
    
  }
  
  export default EventService;
  