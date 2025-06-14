import { motion } from "motion/react";

function Dashboard(){
    return (
        <motion.div
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{
                scale: 1,
                opacity: 1,
                transition: {
                    scale: { duration: 1.0, ease: "backOut" },
                    opacity: { duration: 0.5, ease: "easeOut" }
                }
            }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#303030]">
            Hello
        </motion.div>
    );
}


export default Dashboard;

