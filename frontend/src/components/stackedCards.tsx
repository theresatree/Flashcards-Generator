import { motion } from "motion/react";
import { useState } from "react";

import Flashcard from "./flashcard";
import { Button } from "./ui/button";
import { Pencil } from 'lucide-react';
import { EditFlashcard } from "./editFlashCard";

import type { StackedFlashcardProps } from "../models/models";

export function StackedFlashCard(props: StackedFlashcardProps) {
    const { filename, project_id, question, answer, index, isExpanded, toggleStack } = props;
    const [showEdit, setShowEdit] = useState(false)

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
        >
            {isExpanded &&  (<div>
                <Button className="absolute top-1 right-11 cursor-pointer z-10 size-6.5 hover:scale-110 active:scale-120" 
                    size="icon" 
                    onClick={(e) => {
                        e.stopPropagation(); // To prevent clicking of flashcards
                        setShowEdit(true);}}>
                    <Pencil />
                </Button>
            </div>)}
            <Flashcard questions={question} answers={answer} />



            {/* This is to render the edit drawer*/}

            <EditFlashcard
                project_id={project_id}
                filename= {filename}
                index={index}
                open = {showEdit}     
                onOpenChange={setShowEdit}
            />


        </motion.div>
    );
}
// First, Make a drawer
// Second, update back here
// Third, update in database
// Fourth, Do a toast.success
