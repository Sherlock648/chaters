const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const vapidPublicKey = 'BIaPOmx5xQiSDe68eObtMZi-tZLXCkAAL-EeCVvc692AMkh8Ay7pwy2K6YspQiXMZO3chrISNnoTaE4DN6VENWk';
const vapidPrivateKey = 'iopTftxhXKZqtH0oJwFGgLwXJFT-OXTSrz1P9fgti_I';
const vapidDetails = {
  subject: 'mailto: <sasha.suvorov.1172@mail.ru>',
  publicKey: vapidPublicKey,
  privateKey: vapidPrivateKey
};

webpush.setVapidDetails(
  vapidDetails.subject,
  vapidDetails.publicKey,
  vapidDetails.privateKey
);

app.post('/subscribe', (req, res) => {
  const subscription = req.body.subscription;

  res.status(201).json({});
});

app.post('/sendNotification', (req, res) => {
  const subscription = req.body.subscription;
  const payload = JSON.stringify({ title: 'Пример уведомления' });

  webpush.sendNotification(subscription, payload)
    .then(() => res.status(200).json({}))
    .catch(err => {
      console.error('Ошибка при отправке уведомления:', err);
      res.status(500).json({ error: 'Ошибка при отправке уведомления' });
    });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
