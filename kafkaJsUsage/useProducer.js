// producer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app-producer',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

const keepSendingMessageEveryNSeconds = (producer, time) => {
    let counter = 10;

    setInterval(async () => {
        console.log('******** Publishing the message ********');

        await producer.send({
            topic: 'test-topic-3',
            messages: [{ value: `Hello KafkaJS ${counter} user!` }],
        });

        counter++
        
        console.log('******** Message sent successfully!');
    }, time);
}

const runProducer = async () => {
  try {
    console.log('******** Find all available topics ********');
    const allAvailableTopics = await kafka.admin().listTopics();
    console.log('Available Topics:', allAvailableTopics);
  } catch (error) {
    console.log('******** Cannot fetch topics ********', error);
    return;
  }

  // Producing
  try {
    console.log('******** Connecting Kafka producer to broker ********');
    await producer.connect();

    console.log('******** Initiating publish timer ********');
    keepSendingMessageEveryNSeconds(producer, 1000);

  } catch (error) {
    console.error('Error in producer:', error);
  }
};

runProducer().catch(console.error);
