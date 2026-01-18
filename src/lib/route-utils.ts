import { DynamicRouter } from './dynamic-router.js';

export function logRoutes() {
  const router = new DynamicRouter();
  const routes = router.getRoutes();
  
  console.log('\n=== Available Routes ===');
  routes.forEach(route => {
    console.log(`${route.isDynamic ? 'DYNAMIC' : 'STATIC '} ${route.pattern.padEnd(30)} -> ${route.template}`);
  });
  console.log('========================\n');
}

export function createRouteDebugger() {
  return (req: any, res: any, next: any) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    if (req.params && Object.keys(req.params).length > 0) {
      console.log('  Params:', req.params);
    }
    next();
  };
}
