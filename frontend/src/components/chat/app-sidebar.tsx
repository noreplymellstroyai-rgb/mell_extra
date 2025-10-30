'use client'

import { ChevronUp, Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useGetAllChatsQuery } from '@/api/hooks'

import { Button } from '@/components/ui/button'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '../ui/collapsible'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'

export function AppSidebar() {
	const router = useRouter()

	const { toggleSidebar } = useSidebar()

	const { data: chats } = useGetAllChatsQuery()

	return (
		<Sidebar>
			<SidebarContent className='flex h-full flex-col overflow-x-hidden'>
				<SidebarGroup className='p-4'>
					<SidebarMenu>
						<SidebarMenuItem>
							<div className='mb-4 flex items-center justify-between'>
								<Image
									src='/icons/logo-icon.svg'
									alt='logo'
									width={31}
									height={31}
									layout='fixed'
									className='min-h-[31px] min-w-[31px]'
								/>
								<Button
									variant='ghost'
									size='custom'
									onClick={toggleSidebar}
									className='group-data-[collapsible=icon]:hidden'
								>
									<Image
										src='/icons/sidebar-icon.svg'
										alt='logo'
										width={22}
										height={22}
									/>
								</Button>
							</div>
						</SidebarMenuItem>
						<Link href='/' passHref>
							<SidebarMenuItem className='mt-0'>
								<SidebarMenuButton
									variant='ghost'
									className='text-foreground'
								>
									<Image
										src='/icons/new-chat-icon-dark.svg'
										alt='new chat'
										width={20}
										height={20}
										className='min-h-5 min-w-5 pr-1 dark:hidden'
									/>
									<Image
										src='/icons/new-chat-icon-light.svg'
										alt='new chat'
										width={20}
										height={20}
										className='hidden min-h-5 min-w-5 pr-1 dark:block'
									/>
									<span className='text-sm'>Новый чат</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</Link>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup className='flex-1 overflow-y-auto p-4 pt-0'>
					<Collapsible defaultOpen>
						<CollapsibleTrigger className='w-full text-left'>
							<SidebarGroupLabel className='hover:underline'>
								Чаты
							</SidebarGroupLabel>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									{chats?.map(chat => (
										<SidebarMenuItem
											key={chat.id}
											onClick={() =>
												router.push(`/chat/${chat.id}`)
											}
										>
											<SidebarMenuButton
												variant='ghost'
												className='text-foreground group-data-[collapsible=icon]:hidden'
											>
												<span>{chat.title}</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</Collapsible>
				</SidebarGroup>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className='flex w-72 items-center justify-between gap-2'>
										<div className='flex items-center gap-2'>
											<Avatar>
												<AvatarImage src='/images/logo.png' />
												<AvatarFallback>
													CN
												</AvatarFallback>
											</Avatar>
											<span className='text-sm group-data-[collapsible=icon]:hidden'>
												Username
											</span>
										</div>
										<ChevronUp className='h-4 w-4 shrink-0' />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									side='top'
									className='mb-4 w-72'
								>
									<DropdownMenuItem className='cursor-pointer'>
										<div className='flex w-full items-center justify-between'>
											<span>Тема</span>
											<div className='relative h-[1.2rem] w-[1.2rem]'>
												<Sun className='absolute h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
												<Moon className='absolute h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
											</div>
										</div>
									</DropdownMenuItem>

									<DropdownMenuItem className='cursor-pointer'>
										<span>Выйти</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</SidebarContent>
		</Sidebar>
	)
}

export default AppSidebar
