import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
    SidebarSeparator,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from "@/components/ui/sidebar"

import {
    Search,
    UserRound,
    Users,
    ScrollText,
    Info,
    LandPlot,
    HardDrive,
    ShieldCheck,
    Brain,
    FileText,
    HouseWifi,
    SearchCheck,
    CircleQuestionMark,
    LogOut,
    Grid2X2
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react" // Tambahkan icon panah

import { useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const menuSections = [
    {
        label: "Market Landscape",
        items: [
            { title: "Description", url: "/market-landscape-description", icon: FileText },
            { title: "Insight", url: "/insight", icon: Brain },
            {
                title: "Coverage ISP", url: "/", icon: LandPlot, items: [
                    { title: "TIF 1", url: "/tif-1" },
                    { title: "TIF 2", url: "/tif-2" },
                    { title: "TIF 3", url: "/tif-3" },
                    { title: "TIF 4", url: "/tif-4" },
                ]
            },
            { title: "Home ID", url: "/home-id", icon: HouseWifi },
            { title: "ODP Nasional", url: "/odp-nasional", icon: HardDrive },
            { title: "List ISP", url: "/list-isp", icon: Search },
        ],
    },
    {
        label: "Profiling Funnel",
        items: [
            { title: "Description", url: "/profiling-funnel-description", icon: FileText },
            { title: "ISP Profiling", url: "/isp-profiling", icon: SearchCheck },
        ],
    },
    {
        label: "About",
        items: [{ title: "About Us", url: "/about-us", icon: Info },
        { title: "FAQ", url: "/frequent-asked-questions", icon: CircleQuestionMark }
        ],
    },
]

const adminSection = {
    label: "Admin",
    items: [
        { title: "Manage Users", url: "/manage-users", icon: Users },
        { title: "Manage Whitelists", url: "/manage-whitelists", icon: ShieldCheck },
        { title: "Users Logs", url: "/users-logs", icon: ScrollText },
    ],
}

export function AppSidebar() {
    const user = useAuthStore((s) => {
        return s.user;
    })
    const logout = useAuthStore((s) => s.logout)

    const location = useLocation()
    const navigate = useNavigate()

    const sections =
        user?.role === "admin"
            ? [...menuSections, adminSection]
            : menuSections

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-3">
                    <img width="33px" src="/insider-icon.svg" />
                    <img width="90px" src="/insider-text.svg" />
                </div>
                <Separator />

            </SidebarHeader>


            <SidebarContent>
                {sections.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const hasSubItems = item.items && item.items.length > 0;

                                if (!hasSubItems) {
                                    return (
                                        <SidebarMenuItem key={item.url}>
                                            <SidebarMenuButton
                                                isActive={location.pathname === item.url}
                                                className={location.pathname === item.url ? "border-l-3 border-black" : ""}
                                                onClick={() => navigate(item.url)}
                                            >
                                                <Icon className="size-4" />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                }

                                // Render Dropdown/Collapsible jika ada sub-items
                                return (
                                    <Collapsible key={item.title} asChild defaultOpen className="group/collapsible">
                                        <SidebarMenuItem>
                                            <div className="flex items-center w-full">
                                                <SidebarMenuButton
                                                    isActive={location.pathname === item.url}
                                                    className={location.pathname === item.url ? "border-l-3 border-black" : ""}
                                                    onClick={() => navigate(item.url)}
                                                >
                                                    {item.icon && <Icon className="size-4" />}
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>

                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                    >
                                                        <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                    </Button>
                                                </CollapsibleTrigger>
                                            </div>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.url}>
                                                            <SidebarMenuSubButton
                                                                isActive={location.pathname === subItem.url}
                                                                className={location.pathname === subItem.url ? "border-l-4 border-black" : ""}
                                                                onClick={() => navigate(subItem.url)}
                                                            >
                                                                <span>{subItem.title}</span>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>



            <SidebarFooter>

                <SidebarSeparator />
                <div className="flex items-center justify-between p-2">

                    <div className="flex items-center gap-2">
                        <UserRound />
                        <span className="text-sm">{user?.username}</span>
                    </div>

                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                    >
                        <LogOut className="size-4" />
                    </Button>

                </div>

            </SidebarFooter>

        </Sidebar>
    )
}