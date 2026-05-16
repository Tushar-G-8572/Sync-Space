import 'dotenv/config';

export const config = {
 MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
 PORT:process.env.PORT,
 AGENT_BASE_URL: process.env.AGENT_BASE_URL
}