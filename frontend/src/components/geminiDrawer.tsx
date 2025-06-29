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
                  <CarouselItem>
                    <Card className="max-w-[80%] w-full mx-auto">
                      <CardContent className="flex aspect-square p-6 max-h-[100px]">
                        Hello
                      </CardContent>
                    </Card>
                  </CarouselItem>
                  {/* ...other items */}
                                                <CarouselItem>
                    <Card className="max-w-[80%] w-full mx-auto">
                      <CardContent className="flex aspect-square p-6 max-h-[100px]">
                        Hello
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
