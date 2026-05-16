import { config } from "../config/config.js";
import {ChatMistralAI} from '@langchain/mistralai'
import { listFiles,readFiles,updateFiles } from "./tools.js";
import {createAgent} from 'langchain'


// console.log(config.MISTRAL_API_KEY);
const model = new ChatMistralAI({
 apiKey:config.MISTRAL_API_KEY,
 model:'mistral-medium-latest',
 temperature: 0.7
})

const agent = createAgent({
 model,
 tools:[listFiles,readFiles,updateFiles]
})

await agent.invoke({
 messages:[
  {
   role:"user",
   content: "update the theme of the Project to dark but do not use gradient and neon and update the UX"
  }
 ]
})