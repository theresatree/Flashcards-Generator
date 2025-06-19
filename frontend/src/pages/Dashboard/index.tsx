import { motion } from "motion/react"


function Dashboard() {
    return (
        <motion.div             
            initial={{ scale: 0.3 }}
            animate={{
                scale: 1,
                transition: {
                    scale: { duration: 0.7, ease: "backOut" },
                },
            }}
            exit={{
                opacity: 0,
                transition: {
                    opacity: { duration: 0.3, ease: "easeIn" }
                }
            }}        >
            Dashboard
        </motion.div>
    );
}

export default Dashboard;
