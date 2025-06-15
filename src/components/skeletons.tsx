import { Skeleton } from "../components/ui/skeleton"
import { motion } from "motion/react"

export function FlashcardSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-[100px] w-[450px] p-4 rounded-lg bg-transparent border-gray-300 border-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[400px]" />
                </div>
            </Skeleton>
        </div>
    );
}

