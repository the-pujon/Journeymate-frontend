'use client'

import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import SidebarContent from './SidebarContent';



export const Sidebar = ({ isOpen,onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden  md:block text-gray-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className="p-0 w-[300px] sm:w-[400px]">
                    <SidebarContent onClose={onClose} />
                </SheetContent>
            </Sheet>
        </>
    );
};
