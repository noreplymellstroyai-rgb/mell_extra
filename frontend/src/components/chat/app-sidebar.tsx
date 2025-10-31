'use client'

import { ChevronUp, LogIn, Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { useGetAllChatsQuery } from '@/api/hooks'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

import { useChatActions } from '@/hooks/chat/use-chat-actions'
import { useSidebarActions } from '@/hooks/chat/use-sidebar-footer-actions'

import { ChatHistoryList } from './chat-history-list'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'
import { ConfirmLogoutDialog } from './confirm-logout-dialog'
import { useCheckAuth } from '@/hooks'

export function AppSidebar() {
	const { toggleSidebar } = useSidebar()

	const { user, isAuthorized, isLoadingAuth } = useCheckAuth()

	const { data: chats } = useGetAllChatsQuery({
		enabled: isAuthorized
	})
	const chatActions = useChatActions()
	const { handleThemeToggle, handleLogout, isLogoutPending } =
		useSidebarActions()

	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

	if (isLoadingAuth) {
		return (
			<Sidebar>
				<SidebarContent className='flex h-full flex-col'>
					<SidebarGroup className='p-4'>
						<div className='mb-4 flex items-center justify-between'>
							<Skeleton className='h-8 w-8 rounded-full' />
						</div>
						<Skeleton className='h-8 w-full rounded-full' />
					</SidebarGroup>

					<div className='flex-1' />

					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<div className='flex w-full items-center gap-3'>
									<Skeleton className='h-8 w-8 rounded-full' />
								</div>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</SidebarContent>
			</Sidebar>
		)
	}

	if (!isAuthorized) {
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
											alt='sidebar toggle'
											width={22}
											height={22}
										/>
									</Button>
								</div>
							</SidebarMenuItem>

							<SidebarMenuItem className='mt-0'>
								<SidebarMenuButton
									variant='ghost'
									className='text-foreground'
									disabled
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
									<span className='text-sm group-data-[collapsible=icon]:hidden'>
										Создание чатов недоступно
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>

					<div className='flex-1 p-4 pt-0'>
						<p className='text-muted-foreground text-sm whitespace-pre group-data-[collapsible=icon]:hidden'>
							История чатов недоступна
						</p>
					</div>

					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<Link
									href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/auth`}
									passHref
								>
									<SidebarMenuButton className='text-foreground w-full cursor-pointer justify-start'>
										<LogIn className='mr-3 h-5 w-5 min-w-5' />
										<span className='text-sm group-data-[collapsible=icon]:hidden'>
											Войти
										</span>
									</SidebarMenuButton>
								</Link>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</SidebarContent>
			</Sidebar>
		)
	}

	return (
		<>
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
										className='text-foreground cursor-pointer'
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
										<span className='text-sm'>
											Новый чат
										</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</Link>
						</SidebarMenu>
					</SidebarGroup>

					<SidebarGroup className='flex-1 overflow-y-auto p-4 pt-0'>
						<ChatHistoryList chats={chats} {...chatActions} />
					</SidebarGroup>

					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<button className='flex w-full cursor-pointer items-center justify-between gap-2 group-data-[collapsible=icon]:w-auto focus:outline-none'>
											<div className='flex items-center gap-2'>
												<Avatar>
													<AvatarImage
														src={user?.picture}
													/>
													<AvatarFallback>
														{user?.email
															.toUpperCase()
															.slice(0, 1)}
													</AvatarFallback>
												</Avatar>
												<span className='text-sm group-data-[collapsible=icon]:hidden'>
													{user?.email}
												</span>
											</div>
											<ChevronUp className='h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden' />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										side='top'
										className='mb-4 w-72'
									>
										<DropdownMenuItem
											onClick={handleThemeToggle}
											className='cursor-pointer'
										>
											<div className='flex w-full items-center justify-between'>
												<span>Тема</span>
												<div className='relative h-[1.2rem] w-[1.2rem]'>
													<Sun className='absolute h-full w-full scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
													<Moon className='absolute h-full w-full scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
												</div>
											</div>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												setIsLogoutDialogOpen(true)
											}
											className='cursor-pointer'
										>
											<span>Выйти</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</SidebarContent>
			</Sidebar>

			<ConfirmDeleteDialog
				open={!!chatActions.chatToDelete}
				onOpenChange={() => chatActions.setChatToDelete(null)}
				onConfirm={chatActions.handleConfirmDelete}
				chatTitle={chatActions.chatToDelete?.title}
				isPending={chatActions.isDeleting}
			/>

			<ConfirmLogoutDialog
				open={isLogoutDialogOpen}
				onOpenChange={setIsLogoutDialogOpen}
				onConfirm={handleLogout}
				isPending={isLogoutPending}
			/>
		</>
	)
}
