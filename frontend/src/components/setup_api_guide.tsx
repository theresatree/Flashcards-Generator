import { Button } from "./ui/button"


export function SetupAPIGuide(){
    return(
        <div className="text-[#FEEEEE] text-2xl font-bold gap-2 flex flex-col justify-center items-center">
            <p>Please set up both your</p>
            <p>Gemini & HF API keys to continue.</p>
            <div className="flex flex-row gap-10 mt-5">
                <Button>
                    Gemini API Key
                </Button>
                <Button>
                    Hugging Face API Key
                </Button>
            </div>
        </div>
    );
}

