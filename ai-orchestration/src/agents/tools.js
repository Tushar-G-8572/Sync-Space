import axios from 'axios';
import { tool } from "@langchain/core/tools"
import * as z from "zod";
import dns from 'dns'
import http from 'http';
import { config } from '../config/config.js';

const agentBaseUrl = config.AGENT_BASE_URL || "http://019e2c49-0f8a-75be-9e27-9097b11d08fe.agent.localhost";

const localHostAgent = new http.Agent({
    lookup: (hostname, options, callback) => {
        const cb = typeof options === "function" ? options : callback;
        const lookupOptions = typeof options === "object" ? options : {};

        if (hostname.endsWith(".localhost")) {
            if (lookupOptions.all) {
                cb(null, [{ address: "127.0.0.1", family: 4 }]);
                return;
            }
            cb(null, "127.0.0.1", 4);
        } else {
            dns.lookup(hostname, options, cb);
        }
    }
})

export const listFiles = tool(
    async ({}) => {
        console.log("=================================")
        console.log("using list files tool")
        console.log("=================================")

        try {


            const url = `${agentBaseUrl}/list-files`;
            console.log("Calling agent URL:", url);

            const response = await axios.get(url, {
                httpAgent: localHostAgent, 
            });

            console.log("=================================")
            console.log("response from list files tool", response.data)
            console.log("=================================")

            return JSON.stringify(response.data.files);

        } catch (err) {
            console.log("listFiles error:", err.message);
            return JSON.stringify({ error: err.message });
        }
    },
    {
        name: "list_files",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
);

// export const listFiles = tool(
//     async ({ }) => {
//         console.log("=================================")
//         console.log("using list files tool")
//         console.log("=================================")
//         try{

//             const response = await axios.get("http://019e2c49-0f8a-75be-9e27-9097b11d08fe.agent.localhost/list-files")
            
//             console.log("=================================")
//             console.log("response from list files tool", response.data)
//             console.log("=================================")
            
//             return JSON.stringify(response.data.files);
//         }catch(err){
//             console.log(err.message);
//         }
//     },
//     {
//         name: "list_files",
//         description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
//         schema: z.object({})
//     }
// )

export const readFiles = tool(
    async ({ files = [] }) => {

        console.log("=================================")
        console.log("using read files tool with files", files)
        console.log("=================================")

        const response = await axios.get(`${agentBaseUrl}/read-files?files=` + files.join(","), {
            httpAgent: localHostAgent
        })

        console.log("=================================")
        console.log("response from read files tool", response.data)
        console.log("=================================")
        return JSON.stringify(response.data);
    },
    {
        name: "read_files",
        description: "Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
        schema: z.object({
            files: z.array(z.string()).describe("The list of files absolute paths to read. These should be files that were listed using the list_files tool or created later")
        })
    }
)

export const updateFiles = tool(
    async ({ files }) => {

        console.log("=================================")
        console.log("using update files tool with files", files)
        console.log("=================================")

        const response = await axios.patch(`${agentBaseUrl}/update-files`, {
            updates: files
        }, {
            httpAgent: localHostAgent
        })
        console.log("=================================")
        console.log("response from update files tool", response.data)
        console.log("=================================")

        return JSON.stringify(response.data.results);
    },
    {
        name: "update_files",
        description: "Update the contents of specified files. This is useful for making changes to files based on the requirements of the task at hand. this tool can also use to create new files by providing a new file name in the file field and the content to be added in the content field.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file, the content should support json format.")
            })).describe("The list of files to update and their new contents")
        })
    }
)
