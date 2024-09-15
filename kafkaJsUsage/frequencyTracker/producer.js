const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
  clientId: 'producer-client',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const sentences = [
  'Kafka is awesome',
  'Kafka scales easily',
  'Distributed systems are hard',
  'Microservices are complex',
  'Kafka is fast and reliable',
  'Scalability is key',
  'Kafka is open-source'
];

// Function to produce sentences to Kafka topic
const produceMessages = async () => {
  await producer.connect();
  let i = 0;
  
  setInterval(async () => {
    // for (let j=0;j<1000;j++) {
    //     const message = `message: ${j} ${sentences[i % sentences.length]}`;
    //     console.log(`Producing message${j}: ${message}`);
    //     await producer.send({
    //         topic: 'text-stream',
    //         messages: [{ value: message }]
    //     });
    // }

    const message = sentences[i % sentences.length];
    console.log(`Producing message: ${message}`);
    await producer.send({
        topic: 'text-stream',
        messages: [{ value: message }]
    });
    
    i++;
  }, 1000); // Produces one message per second
};

produceMessages().catch(console.error);
