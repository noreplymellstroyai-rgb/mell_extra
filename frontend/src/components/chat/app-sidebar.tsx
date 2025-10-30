'use client'

import { ChevronUp, Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

import { useChatActions } from '@/hooks/chat/use-chat-actions'

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

import { ChatHistoryItem } from './chat-history-item'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'

export function AppSidebar() {
	const params = useParams()
	const { toggleSidebar } = useSidebar()
	const { data: chats } = useGetAllChatsQuery()

	const {
		chatToDelete,
		setChatToDelete,
		chatToRename,
		setChatToRename,
		newTitle,
		setNewTitle,
		inputRef,
		handleRename,
		handleConfirmDelete,
		handleKeyDown,
		isDeleting
	} = useChatActions()

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
										<span className='text-sm'>
											Новый чат
										</span>
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
											<ChatHistoryItem
												key={chat.id}
												chat={chat}
												isActive={params.id === chat.id}
												isEditing={
													chatToRename?.id === chat.id
												}
												newTitle={newTitle}
												onTitleChange={setNewTitle}
												onRename={handleRename}
												onKeyDown={handleKeyDown}
												onEdit={() => {
													setChatToRename(chat)
													setNewTitle(
														chat.title || ''
													)
												}}
												onDelete={() =>
													setChatToDelete(chat)
												}
												inputRef={inputRef}
											/>
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
										<button className='flex w-full items-center justify-between gap-2 group-data-[collapsible=icon]:w-auto'>
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
											<ChevronUp className='h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden' />
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

			<ConfirmDeleteDialog
				open={!!chatToDelete}
				onOpenChange={() => setChatToDelete(null)}
				onConfirm={handleConfirmDelete}
				chatTitle={chatToDelete?.title}
				isPending={isDeleting}
			/>
		</>
	)
}

export default AppSidebar
