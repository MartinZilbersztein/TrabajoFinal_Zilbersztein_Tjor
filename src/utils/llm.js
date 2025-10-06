import { Settings } from "llamaindex";
import { LLMConfig } from "../config/llm-config.js";
import * as debug from "../helpers/debug-helper.js";

export const initializeLLM = async () => {
    try {
        const mod = await import("@llamaindex/" + LLMConfig.provider.toLowerCase());
        const llm = new mod[LLMConfig.provider](LLMConfig);
        
        Settings.llm = llm;
        Settings.embedModel = llm;

        debug.log("LLM provider loaded: " + LLMConfig.provider);
        return llm;
    } catch (err) {
        debug.error("Failed to initialize LLM: " + err);
        throw new Error("Failed to initialize LLM: " + err);
    }
};