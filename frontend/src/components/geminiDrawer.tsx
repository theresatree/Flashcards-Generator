import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../components/ui/drawer";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../components/ui/carousel"
import { Card, CardContent } from "../components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

type DrawerShowProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function GeminiDrawer({ open, onOpenChange }: DrawerShowProps) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-[#404040] text-gray-100">
                <DrawerHeader>
                    <DrawerTitle className="text-lg font-semibold text-[#FEEEEE] mb-3">
                        How to generate Gemini API Key
                    </DrawerTitle>
                    <DrawerDescription>
                        {/* Make this div relative so that absolute arrows are positioned here */}
                        <div className="relative w-full">
                            <Carousel>
                                <CarouselContent className="dark w-full">

                                    {/*Step 1*/}
                                    <CarouselItem>
                                        <Card className="max-w-[80%] w-full mx-auto">
                                            <CardContent className="aspect-square max-h-[100px]">
                                                <div className="flex flex-col justify-center gap-5">
                                                    <span className="underline text-red-500 font-bold text-lg">Step 1</span>
                                                    <div>
                                                        Go to{" "}
                                                        <a
                                                            href="https://aistudio.google.com/app/apikey"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 underline hover:text-blue-300"
                                                        >
                                                            https://aistudio.google.com/app/apikey</a>{" "}
                                                        and login if needed
                                                    </div>
                                                </div>

                                            </CardContent>
                                        </Card>
                                    </CarouselItem>

                                    {/*Step 2*/}
                                    <CarouselItem>
                                        <Card className="max-w-[80%] w-full mx-auto">
                                            <CardContent className="aspect-square max-h-[100px]">
                                                <div className="flex flex-col justify-center gap-5">
                                                    <span className="underline text-red-500 font-bold text-lg">Step 2</span>
                                                    <div>
                                                        Click "Create API Key" and{" "} 
                                                        <span className="underline-offset-3 underline text-red-500">make sure to copy it!</span>
                                                    </div>
                                                </div>

                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                </CarouselContent>

                                {/* Left arrow */}

                                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full border-white bg-white text-black hover:bg-zinc-600">
                                    <ChevronLeft className="h-6 w-6" />
                                </CarouselPrevious>
                                <CarouselNext     className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full border-white bg-white text-black hover:bg-zinc-600">
                                    <ChevronRight className="h-6 w-6" />
                                </CarouselNext>

                            </Carousel>
                        </div>
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="flex max-w-[800px] w-full mx-auto mb-[5px] pt-2">
                    <DrawerClose asChild>
                        <button className="px-4 py-2 rounded-md bg-zinc-600 text-gray-100 hover:text-black hover:font-semibold hover:bg-red-500 hover:scale-110 transition ease-in-out active:scale-120">
                            Close
                        </button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
