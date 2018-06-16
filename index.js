const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/painting');

mongoose.connect('mongodb://user01:pw%40user01@ds018168.mlab.com:18168/powerful-api');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('connected to database');
})

const server = hapi.server({
  port: 3000,
  host: 'localhost'
});

const init = async () => {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: (request, h) => {
        return '<h1>My modern api</h1>';
      }
    },
    {
      method: 'GET',
      path: '/api/v1/paintings',
      handler: (request, h) => {
        return Painting.find();
      }
    },
    {
      method: 'POST',
      path: '/api/v1/paintings',
      handler: (request, h) => {
        const { name, url, techniques } = request.payload;
        const painting = new Painting({
          name,
          url,
          techniques
        });

        return painting.save();
      },
      options: {
        payload: {
          defaultContentType: 'application/json'
        }
      }
    }
  ]);

  await server.start();
  console.log(server.info);
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
})

init();