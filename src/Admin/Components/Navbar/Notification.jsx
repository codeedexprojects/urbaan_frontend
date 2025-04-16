import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    IconButton,
    Avatar,
    Typography,
} from "@material-tailwind/react";
import { GoBellFill } from "react-icons/go";
import { FaRegClock } from "react-icons/fa6";

export function Notification() {
    return (
        <Menu placement="bottom-end">
            <MenuHandler>
                <IconButton variant="text" className='relative'>
                    <GoBellFill className="text-3xl text-blue-900" />
                    <span className="absolute -top-1 -right-0 bg-red-800 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        2
                    </span>
                </IconButton>
            </MenuHandler>
            <MenuList className="flex flex-col gap-2">
                <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
                    <Avatar
                        variant="circular"
                        alt="tania andrew"
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                    />
                    <div className="flex flex-col gap-1">
                        <Typography variant="small" color="gray" className="font-medium font-custom text-base">
                            Tania send you a message
                        </Typography>
                        <Typography className="flex items-center gap-1 text-sm font-custom font-normal text-blue-gray-500">
                            <FaRegClock />
                            13 minutes ago
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
                    <Avatar
                        variant="circular"
                        alt="natali craig"
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
                    />
                    <div className="flex flex-col gap-1">
                    <Typography variant="small" color="gray"  className="font-medium font-custom text-base">
                            Natali replied to your email.
                        </Typography>
                        <Typography className="flex items-center gap-1 text-sm font-custom font-normal text-blue-gray-500">
                            <FaRegClock />1 hour ago
                        </Typography>
                    </div>
                </MenuItem>
                <MenuItem className="flex items-center gap-4 py-2 pl-2 pr-8">
                    <Avatar
                        variant="circular"
                        alt="paypal"
                        src="https://dwglogo.com/wp-content/uploads/2016/08/PayPal_Logo_Icon.png"
                    />
                    <div className="flex flex-col gap-1">
                    <Typography variant="small" color="gray"  className="font-medium font-custom text-base">
                            You&apos;ve received a payment.
                        </Typography>
                        <Typography className="flex items-center gap-1 text-sm font-custom font-normal text-blue-gray-500">
                            <FaRegClock />5 hours ago
                        </Typography>
                    </div>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}