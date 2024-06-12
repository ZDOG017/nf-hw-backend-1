import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';

class EventController {
    private eventService : EventService;


    constructor(eventService : EventService){
        this.eventService = eventService;
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
          const createEventDto: CreateEventDto = req.body;
          const event = await this.eventService.createEvent(createEventDto);
          res.status(201).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }



      getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
          const user = (req as any).user;
          const page = Number(req.query.page) || 1;
          const limit = Number(req.query.limit) || 10;
          const sortBy = String(req.query.sortBy) || 'date';
          const sortDirection = req.query.sortDirection === 'desc' ? 'desc' : 'asc'; 
    
          const events = await this.eventService.getEventsByCity(
            user.city,
            page,
            limit,
            sortBy,
            sortDirection
          );
    
          const totalEvents = await this.eventService.countEventsByCity(user.city);
    
          res.status(200).json({
            events,
            totalEvents,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page
          });
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      };

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
          const { id } = req.params;
          const event = await this.eventService.getEventById(id);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (error: any) {
          res.status(500).send({ error: error.message });
        }
      }
}

export default EventController;