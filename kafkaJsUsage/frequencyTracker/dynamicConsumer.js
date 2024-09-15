const { Kafka } = require('kafkajs');

// Get the consumer ID from the command line arguments
const consumerId = process.argv[2] || 'dynamic-consumer';

const kafka = new Kafka({
  clientId: `consumer-${consumerId}`,
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'word-freq-group' });
const producer = kafka.producer(); // To send partial word counts to an aggregator

let wordCountMap = {};

// Function to process and count words
const processMessage = (message) => {
  const words = message.split(' ');
  words.forEach(word => {
    wordCountMap[word] = (wordCountMap[word] || 0) + 1;
  });
};

// Function to send partial word counts to the aggregator
const sendWordCount = async () => {
  await producer.connect();

  await producer.send({
    topic: 'word-freq-updates',
    messages: [{ value: JSON.stringify(wordCountMap) }]
  });

  // Reset local wordCountMap after sending the counts
  wordCountMap = {};
};

// Function to run the consumer
const runConsumer = async () => {
  console.log(`Starting consumer: ${consumerId}`);

  await consumer.connect();
  await consumer.subscribe({ topic: 'text-stream', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      processMessage(value); // Process and count words

      // Simulate sending word counts periodically (every 5 messages here)
      if (Object.keys(wordCountMap).length >= 5) {
        await sendWordCount();
      }
    }
  });
};

runConsumer().catch(console.error);
