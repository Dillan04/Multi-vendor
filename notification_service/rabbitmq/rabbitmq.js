const amqp = require('amqplib');
require('dotenv').config();

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

const consumeNotifications = async (queue, callback) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  await channel.assertQueue(queue);
  channel.consume(queue, (message) => {
    callback(JSON.parse(message.content.toString()));
    channel.ack(message);
  });
};

const publishMessage = async (queue, message) => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

module.exports = {
  connectRabbitMQ,
  consumeNotifications,
  publishMessage,
};
