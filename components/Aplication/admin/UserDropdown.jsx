import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag } from 'react-icons/md'
import LogoutBtn from './LogoutBtn'


const UserDropdown = () => {

  const auth = useSelector((store)=>{
    return store.authStore.auth
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p className=''>{auth?.name}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className='cursor-pointer' href="#">
          <IoShirtOutline/>
          New Products
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className='cursor-pointer' href="#">
          <MdOutlineShoppingBag/>
          Orders
          </Link>
        </DropdownMenuItem>
        <LogoutBtn />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown