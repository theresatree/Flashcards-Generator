import { motion } from "motion/react";
import Flashcard from "./flashcard";
import type { StackedFlashcardProps } from "../models/models";

export function StackedFlashCard(props: StackedFlashcardProps) {
    const { question, answer, index, isExpanded, toggleStack } = props;
    return (
        <motion.div
            onClick={toggleStack}
            layout
            initial={false}
            animate={{
                rotate: isExpanded
                    ? 0
                    : index % 4 === 0
                        ? index * 0.3
                        : -index * 0.3,
                scale: 1,
                x: 0,
                y: 0,
            }}
            transition={{
                type: "spring",
                stiffness: 190,
                damping: 20,
            }}
            className={`${
                isExpanded
                ? "relative mb-4"
                : "absolute top-0 left-0 w-full cursor-pointer"
                }`}
            style={{ 
                zIndex: index,
            }}
            data-flashcard // Add this data attribute for measurement
        >
            <Flashcard questions={question} answers={answer} />
        </motion.div>
    );
}
