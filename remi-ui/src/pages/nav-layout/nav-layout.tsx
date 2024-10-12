import {
    Link,
    NavLink,
    NavLinkRenderProps,
    Outlet,
    useNavigate,
} from "react-router-dom";
import { CircleUser, House, Package, Package2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/api/user/user";

export const description =
    "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

export function NavLayout() {
    const logout = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/spaces");
    };

    const activeClassFn = ({ isActive }: NavLinkRenderProps) => {
        const allClasses =
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ";
        if (isActive) return allClasses + "bg-muted text-primary";

        return allClasses + "text-muted-foreground";
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link
                            to="/"
                            className="flex items-center gap-2 font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="">Remi</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {/* <Link
                                to="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link> */}
                            <NavLink
                                to="/spaces"
                                // className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                                className={activeClassFn}
                            >
                                <House className="h-4 w-4" />
                                My Space
                                {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                    6
                                </Badge> */}
                            </NavLink>
                            <NavLink to="/items" className={activeClassFn}>
                                <Package className="h-4 w-4" />
                                Items
                            </NavLink>
                            <NavLink to="/member" className={activeClassFn}>
                                <Users className="h-4 w-4" />
                                Member
                            </NavLink>
                            {/* <Link
                                to="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <LineChart className="h-4 w-4" />
                                Analytics
                            </Link> */}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex justify-end h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full"
                            >
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle user menu
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Profile</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleLogout()}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
