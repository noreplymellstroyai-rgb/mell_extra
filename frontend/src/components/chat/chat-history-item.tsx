'use client'

import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { KeyboardEvent, Ref } from 'react'

import type { IChat } from '@/api/types'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

interface ChatHistoryItemProps {
	chat: IChat
	isActive: boolean
	isEditing: boolean
	newTitle: string
	onTitleChange: (value: string) => void
	onRename: () => void
	onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
	onEdit: () => void
	onDelete: () => void
	inputRef: Ref<HTMLInputElement>
}

export function ChatHistoryItem({
	chat,
	isActive,
	isEditing,
	newTitle,
	onTitleChange,
	onRename,
	onKeyDown,
	onEdit,
	onDelete,
	inputRef
}: ChatHistoryItemProps) {
	if (isEditing) {
		return (
			<SidebarMenuItem>
				<div className='flex h-10 items-center px-2 py-1'>
					<Input
						ref={inputRef}
						value={newTitle}
						onChange={e => onTitleChange(e.target.value)}
						onBlur={onRename}
						onKeyDown={onKeyDown}
						className='h-8 text-sm'
					/>
				</div>
			</SidebarMenuItem>
		)
	}

	return (
		<SidebarMenuItem>
			<div
				data-active={isActive}
				className='group/item data-[active=true]:bg-accent hover:bg-accent relative flex h-10 w-full items-center justify-between rounded-md group-data-[collapsible=icon]:hidden'
			>
				<Link
					href={`/chat/${chat.id}`}
					className='absolute inset-0 z-10'
				>
					<span className='sr-only'>{chat.title}</span>
				</Link>

				<SidebarMenuButton
					variant='ghost'
					isActive={isActive}
					className='z-0 h-full w-full justify-start bg-transparent hover:bg-transparent'
					asChild
				>
					<div>
						<span className='flex-1 truncate text-left'>
							{chat.title}
						</span>
					</div>
				</SidebarMenuButton>

				<div className='relative z-20 mr-2 hidden shrink-0 items-center group-hover/item:flex'>
					<Button
						variant='ghost'
						size='icon'
						className='h-7 w-7'
						onClick={onEdit}
					>
						<Pencil className='h-4 w-4' />
					</Button>
					<Button
						variant='ghost'
						size='icon'
						className='h-7 w-7'
						onClick={onDelete}
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</SidebarMenuItem>
	)
}
