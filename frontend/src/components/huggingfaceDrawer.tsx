import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "../components/ui/drawer";

type DrawerShowProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function HuggingfaceDrawer({open, onOpenChange}: DrawerShowProps){
    return (
          <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-[#404040] text-gray-100">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold text-[#FEEEEE]">
              Copy this instruction, along with your documents to your LLM
            </DrawerTitle>
            <span className="font-semibold text-red-400 underline decoration-red-500 mb-[10px]">
              Default: 10 flashcards
            </span>
            <DrawerDescription>
              {/* …your Gemini-specific instructions here… */}
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row max-w-[800px] w-full mx-auto justify-between mb-[5px] pt-2">
            <DrawerClose asChild>
              <button className="px-4 py-2 rounded-md bg-zinc-600 text-gray-100 hover:text-black hover:font-semibold hover:bg-red-500 hover:scale-110 transition ease-in-out active:scale-120">
                Close
              </button>
            </DrawerClose>
            <button className="px-4 py-2 rounded-md bg-zinc-600 text-gray-100 hover:text-black hover:font-semibold hover:bg-green-500 hover:scale-110 transition ease-in-out active:scale-120">
              Ready to proceed?
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    )
}
