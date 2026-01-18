import { Request, Response } from 'express';
import { services } from '../../../../__mock__/services.js';
import metadata from '../../metadata.js';

export default async function handler(req: Request, res: Response) {
  const { slug } = req.params;
  const service = services.find(s => s.slug === slug);
  return {
    data: {
      service
    },
    metadata: {
      ...metadata,
      title: service ? service.name : 'Service',
      description: service ? service.description : ''
    }
  };
}
