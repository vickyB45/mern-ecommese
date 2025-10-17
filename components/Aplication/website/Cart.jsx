import React from 'react'
import { BsCart2 } from 'react-icons/bs'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Cart = () => {
  return (
   
    <Sheet>
      <SheetTrigger className="relative" >
        <BsCart2  className="text-zinc-500 hover:text-primary  cursor-pointer" size={20}/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Cart</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Your shopping cart
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full px-4">
          <div className="flex-1 overflow-auto pe-2">
            {/* Cart items will go here */}
          </div>
          <div className="h-32 pt-5 mt-auto border-t">
            {/* Cart summary and checkout button will go here */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Cart