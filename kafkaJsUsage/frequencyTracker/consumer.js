const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'consumer-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'word-freq-group', autoCommit: true, autoCommitInterval: 1000 });
const producer = kafka.producer(); // To send partial word counts to an aggregator

let wordCountMap = {};
let submit = 0;

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
  
//   console.log(`******** publishing to word-freq-updates topic ${submit} ${JSON.stringify(wordCountMap)} *******`)
  await producer.send({
    topic: 'word-freq-updates',
    messages: [{ value: JSON.stringify(wordCountMap) }]
  });
  submit++;
  
  // Reset local wordCountMap after sending the counts
  wordCountMap = {};
};

// Function to run the consumer
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'text-stream' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log('**** message being consumed', value);
      processMessage(value); // Process and count words
      
      // Simulate sending word counts periodically (every 5 messages here)
      if (Object.keys(wordCountMap).length >= 5) {
        await sendWordCount();
      }
    }
  });
};

runConsumer().catch(console.error);
