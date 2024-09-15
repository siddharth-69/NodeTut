const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'aggregator-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'aggregator-group' });

let globalWordFreqMap = {};

// Function to aggregate partial word frequencies
const aggregateWordCounts = (partialWordFreq) => {
  for (const word in partialWordFreq) {
    globalWordFreqMap[word] = (globalWordFreqMap[word] || 0) + partialWordFreq[word];
  }
  
  console.log('Current Global Word Frequency:', globalWordFreqMap);
};

// Function to run the aggregator
const runAggregator = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'word-freq-updates', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const partialWordFreq = JSON.parse(message.value.toString());
      aggregateWordCounts(partialWordFreq);
    }
  });
};

runAggregator().catch(console.error);
