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

export default function HuggingfaceDrawer({open, onOpenChange}: DrawerShowProps){
    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="bg-[#404040] text-gray-100">
                <DrawerHeader>
                    <DrawerTitle className="text-lg font-semibold text-[#FEEEEE] mb-3">
                        How to generate HF API Key
                    </DrawerTitle>
                    <DrawerDescription>
                        {/* Make this div relative so that absolute arrows are positioned here */}
                        <div className="relative w-full">
                            <Carousel>
                                <CarouselContent className="dark w-full">

                                    {/* Step 1*/}
                                    <CarouselItem>
                                        <Card className="max-w-[80%] w-full mx-auto">
                                            <CardContent className="aspect-square max-h-[100px]">
                                                <div className="flex flex-col justify-center gap-5">
                                                    <span className="underline text-red-500 font-bold text-lg">Step 1</span>
                                                    <div>
                                                        Go to{" "}
                                                        <a
                                                            href="https://huggingface.co/"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 underline hover:text-blue-300"
                                                        >
                                                            https://huggingface.co/
                                                        </a>{" "}
                                                        and register an account
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>

                                    {/* Step 2*/}
                                    <CarouselItem>
                                        <Card className="max-w-[80%] w-full mx-auto">
                                            <CardContent className="aspect-square max-h-[100px]">
                                             <div className="flex flex-col justify-center gap-5">
                                                    <span className="underline text-red-500 font-bold text-lg">Step 2</span>
                                                    <div>
                                                        Go to{" "}
                                                        <a
                                                            href= "https://huggingface.co/settings/profile"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 underline hover:text-blue-300"
                                                        >
                                                            https://huggingface.co/settings/profile
                                                        </a>{" "}
                                                        and locate "Access Tokens"
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>

                                    {/* Step 3*/}
                                    <CarouselItem>
                                        <Card className="max-w-[80%] w-full mx-auto">
                                            <CardContent className="aspect-square max-h-[150px]">
                                             <div className="flex flex-col justify-center gap-5">
                                                    <span className="underline text-red-500 font-bold text-lg">Step 3</span>
                                                    <div>
                                                        1. Click "Create New Token" and input any token name (up to you)
                                                    </div>
                                                    <div>
                                                        2. Under "Inference section" tick "Make calls to Inference Providers"
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>

                                    
                                    {/* Step 4*/}
                                    <CarouselItem>
                                        <Card className="max-w-[80%] w-full mx-auto">
                                            <CardContent className="aspect-square max-h-[100px]">
                                             <div className="flex flex-col justify-center gap-5">
                                                    <span className="underline text-red-500 font-bold text-lg">Step 4</span>
                                                    <div>
                                                        Click "Create token" and{" "}
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
