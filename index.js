const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');


const mongoose = require('mongoose');
const Painting = require('./models/painting');

const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');



const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

const init = async () => {
  await server.register({
    plugin: graphiqlHapi,
    options: {
      path: '/graphiql',
      graphiqlOptions: {
        endpointURL: '/graphql'
      },
      route: {
        cors: true
      }
    }
  });

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: {
        schema
      },
      route: {
        cors: true
      }
    }
  });

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      option: {
        info: {
          host: 'localhost',
          version: Pack.version
        }
      }
    }
  ])

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
      config: {
        description: 'Get a specific painting by ID.',
        tags: ['api', 'v1', 'painting']
      },
      handler: (request, h) => {
        return Painting.find();
      }
    },
    {
      method: 'POST',
      path: '/api/v1/paintings',
      config: {
        description: 'Get a specific painting by ID.',
        notes: 'some additional information',
        tags: ['api', 'v1', 'painting']
      },
      handler: (request, h) => {
        const { name, url, technique } = request.payload;
        const painting = new Painting({
          name,
          url,
          technique
        });

        return painting.save();
      }
      // },
      // options: {
      //   payload: {
      //     defaultContentType: 'application/json'
      //   }
      // }
    }
  ]);

  mongoose.connect('mongodb://user01:pw%40user01@ds018168.mlab.com:18168/powerful-api');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error: '));
  db.once('open', () => {
    console.log('connected to database');
  });
  
  await server.start();
  console.log(server.info);
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
})

init();