import express from 'express'
import morgan from 'morgan'
import { v7 as uuid } from 'uuid';
import { createService } from './kubernetes/service.js';
import { createPod } from './kubernetes/pod.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.get('/api/sandbox/health', (req, res) => {
  res.status(200).json({ status: "Ok", message: "sandbox health" })
})

app.post('/api/sandbox/start', async (req, res) => {
  const sandboxId = uuid();
  await createPod(sandboxId);
  await createService(sandboxId);
  res.status(200).json({ status: "Ok", message: "Sandbox started successfully", sandboxId, previewUrl: `http://${sandboxId}.preview.localhost` });
})

export default app;