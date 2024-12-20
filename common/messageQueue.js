// common/messageQueue.js
const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  const connection = await amqp.connect('amqp://rabbitmq');
  const channel = await connection.createChannel();
  return channel;
};

const publishMessage = async (exchange, routingKey, message) => {
  const channel = await connectToRabbitMQ();
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
  console.log("Message sent:", message);
};

const consumeMessage = async (exchange, queue, handler) => {
  const channel = await connectToRabbitMQ();
  await channel.assertExchange(exchange, 'fanout', { durable: false });
  await channel.assertQueue(queue, { durable: false });
  await channel.bindQueue(queue, exchange, '');
  console.log('Waiting for messages...');
  
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      handler(JSON.parse(msg.content.toString()));
      channel.ack(msg);
    }
  });
};

module.exports = { publishMessage, consumeMessage };
