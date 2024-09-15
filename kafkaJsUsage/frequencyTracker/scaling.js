const { Kafka } = require('kafkajs');
const { exec } = require('child_process');

const kafka = new Kafka({
  clientId: 'admin-client',
  brokers: ['localhost:9092']
});

const admin = kafka.admin();

// Function to monitor lag and dynamically add consumers
const monitorLagAndScale = async () => {
  await admin.connect();

  const threshold = 100000; // Number of messages behind before scaling
  let consumerCount = 2; // Start with 2 consumers
  
  setInterval(async () => {
    const describeGroups = await admin.describeGroups(['word-freq-group']);
    console.log('****** describe group *******', describeGroups);
    const lag = await calculateLag(admin);

    console.log(`Current lag: ${lag}`);
    
    // if (lag > threshold) {
    //   console.log('Lag too high. Scaling up consumers...');
    //   consumerCount++;
    //   startNewConsumer(consumerCount); // Scale up by adding a new consumer
    // }
  }, 5000); // Check every 5 seconds
};

// Function to calculate lag (placeholder)
const calculateLag = async (admin) => {
  // Simulate calculation of lag from Kafka's topic partition lag
  const topicOffsets = await admin.fetchOffsets({ groupId: 'word-freq-group', topics: ['text-stream'] });
  const topicSpecificOffset = await admin.fetchTopicOffsets('text-stream');
  const availableTopics = await admin.listGroups();
//   const topicOffsets = await admin.fetchTopicOffsets('text-stream');

  console.log('******* This is the topic offset value ********',topicOffsets[0].partitions, topicSpecificOffset );
  
  let lag = 0;
  topicOffsets.forEach(({ offset, partition }) => {
    console.log('******  This is the offset ****** ', offset)
    lag += offset; // Sum up lags from all partitions
  });
  
  return lag; // Placeholder
};

// Function to start new consumer
// Function to start a new consumer dynamically
const startNewConsumer = (consumerId) => {
    console.log(`Starting new consumer: consumer-${consumerId}`);
    
    // Use `child_process.exec` to start a new instance of `dynamicConsumer.js` with a unique ID
    exec(`node dynamicConsumer.js ${consumerId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting consumer-${consumerId}:`, error);
      }
      if (stdout) {
        console.log(`Output from consumer-${consumerId}: ${stdout}`);
      }
      if (stderr) {
        console.error(`Error output from consumer-${consumerId}: ${stderr}`);
      }
    });
};

monitorLagAndScale().catch(console.error);
