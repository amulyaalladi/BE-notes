// handle the error routes
const errorRoute = (request, response, next) => {
  response.json({ message: 'Route not found' });
}

module.exports = errorRoute;