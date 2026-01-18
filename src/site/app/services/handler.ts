import { Request, Response } from 'express';
import { services } from '../../../__mock__/services.js';
import metadata from '../metadata.js';

export default async function handler(req: Request, res: Response) {
  return {
    data: {
      services
    },
    metadata: {
      ...metadata,
      title: 'Our Services',
      description: 'Explore our range of services for your business needs.'
    }
  };
}
