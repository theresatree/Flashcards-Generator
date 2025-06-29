import { Button } from "./ui/button"
import { useState } from "react";
import GeminiDrawer from "./geminiDrawer";
import HuggingfaceDrawer from "./huggingfaceDrawer";

export function SetupAPIGuide(){
    const [openGemini, setOpenGemini] = useState(false)
    const [openHF, setOpenHF] = useState(false)

    return (
        <>
            <div className="text-[#FEEEEE] text-2xl font-bold gap-2 flex flex-col justify-center items-center">
                <p>Please set up both your</p>
                <p>Gemini & HF API keys to continue.</p>
                <div className="flex flex-row gap-10 mt-5">
                    <Button onClick={() => setOpenGemini(true)} className="hover:scale-120 transition ease-in-out">
                        Gemini Guide
                    </Button>
                    <Button onClick={() => setOpenHF(true)} className="hover:scale-120 transition ease-in-out">
                        Hugging Face Guide
                    </Button>
                </div>
            </div>

            {/* Gemini Drawer */}
            <GeminiDrawer open={openGemini} onOpenChange={setOpenGemini} />

            {/* Hugging Face Drawer */}
            <HuggingfaceDrawer open={openHF} onOpenChange={setOpenHF} />
        </>
    )
}
