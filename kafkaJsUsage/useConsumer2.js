// consumer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app-consumer',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group-2' });

const runConsumer = async () => {
  try {
    console.log('******** Connecting Kafka consumer to broker ********');
    await consumer.connect();

    console.log('******** Kafka consumer is subscribing ********');
    await consumer.subscribe({ topic: 'test-topic-2', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });
      },
    });

    console.log('Consumer is running and listening for messages...');
  } catch (error) {
    console.error('Error in consumer:', error);
  }
};

runConsumer().catch(console.error);
