const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})


const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {

    try {
        console.log('******** find all available topics  ********')
        const allAvailableTopics = await kafka.admin().listTopics()
        console.log('*****************', allAvailableTopics)
    } catch {
        console.log('******** cannot fetch topics ********')
        return;
    }
  // Producing
  console.log('******** connecting kafka producer to broker ********')
  await producer.connect()

  console.log('******** Publishing the message ********')
  await producer.send({
    topic: 'test-topic-2',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })

  // Consuming
  console.log('******** connecting kafka consumer to broker ********')
  await consumer.connect()

  console.log('******** connecting kafka consumer is subscibing ********')
  await consumer.subscribe({ topic: 'test-topic-2', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)