'use client'

import { useParams } from 'next/navigation'

import type { IChat } from '@/api/types/chat-types'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu
} from '@/components/ui/sidebar'

import type { useChatActions } from '@/hooks/chat/use-chat-actions'

import { ChatHistoryItem } from './chat-history-item'

type ChatActions = ReturnType<typeof useChatActions>

interface ChatHistoryListProps extends ChatActions {
	chats: IChat[] | undefined
}

export function ChatHistoryList({
	chats,
	chatToRename,
	setChatToRename,
	newTitle,
	setNewTitle,
	inputRef,
	handleRename,
	handleKeyDown,
	setChatToDelete
}: ChatHistoryListProps) {
	const params = useParams()

	return (
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
								isEditing={chatToRename?.id === chat.id}
								newTitle={newTitle}
								onTitleChange={setNewTitle}
								onRename={handleRename}
								onKeyDown={handleKeyDown}
								onEdit={() => {
									setChatToRename(chat)
									setNewTitle(chat.title || '')
								}}
								onDelete={() => setChatToDelete(chat)}
								inputRef={inputRef}
							/>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</CollapsibleContent>
		</Collapsible>
	)
}
