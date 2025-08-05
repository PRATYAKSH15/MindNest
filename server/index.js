import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();      

const app = express();
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});