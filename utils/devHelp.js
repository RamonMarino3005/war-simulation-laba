export function getAllRoutes(app) {
  return app.router.stack
    .filter((layer) => layer.route) // only layers with routes
    .map((layer) => {
      const route = layer.route;

      return {
        path: route.path,
        methods: route.methods,
      };
    });
}
