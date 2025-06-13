import Dropzone from "../../components/dropzone.tsx";
import SplitText from "../../components/splitText.tsx";
import { motion } from "motion/react"

function FirstPageUpload() {
    return (
        <motion.div className="min-h-screen flex flex-col items-center justify-center bg-[#303030]">
            <SplitText
            text="Upload files to begin"
            className="text-5xl font-semibold text-center mb-3 leading-relaxed text-[#FEEEEE]"
            delay={50}
            duration={0.3}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            />
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl text-center">
                <Dropzone />
            </div>
        </motion.div>
    );
}

export default FirstPageUpload;
