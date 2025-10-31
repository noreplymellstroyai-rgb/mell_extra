'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { toast } from 'sonner'

import { useDeleteChatMutation, useRenameChatMutation } from '@/api/hooks'
import { IChat } from '@/api/types'

export function useChatActions() {
	const [chatToDelete, setChatToDelete] = useState<IChat | null>(null)
	const [chatToRename, setChatToRename] = useState<IChat | null>(null)
	const [newTitle, setNewTitle] = useState('')

	const inputRef = useRef<HTMLInputElement>(null)
	const router = useRouter()
	const pathname = usePathname()
	const deleteMutation = useDeleteChatMutation()
	const renameMutation = useRenameChatMutation()

	useEffect(() => {
		if (chatToRename && inputRef.current) {
			inputRef.current.select()
		}
	}, [chatToRename])

	const handleRename = async () => {
		if (
			!chatToRename ||
			!newTitle.trim() ||
			newTitle.trim() === chatToRename.title
		) {
			setChatToRename(null)
			return
		}

		try {
			await toast.promise(
				renameMutation.mutateAsync({
					sessionId: chatToRename.id,
					payload: { title: newTitle.trim() }
				}),
				{
					loading: 'Переименование чата...',
					success: 'Чат успешно переименован!',
					error: 'Не удалось переименовать чат'
				}
			)

			setChatToRename(null)
		} catch (error) {
			console.error('Не удалось переименовать чат:', error)
		}
	}

	const handleConfirmDelete = async () => {
		if (!chatToDelete) return

		try {
			await toast.promise(deleteMutation.mutateAsync(chatToDelete.id), {
				loading: 'Удаление чата...',
				success: 'Чат успешно удален!',
				error: 'Не удалось удалить чат'
			})

			const pathSegments = pathname.split('/')
			const currentChatId =
				pathSegments[1] === 'chat' ? pathSegments[2] : null

			if (currentChatId && currentChatId === chatToDelete.id) {
				router.push('/')
			}

			setChatToDelete(null)
		} catch (error) {
			console.error('Не удалось удалить чат:', error)
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleRename()
		} else if (e.key === 'Escape') {
			setChatToRename(null)
		}
	}

	return {
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
		isRenaming: renameMutation.isPending,
		isDeleting: deleteMutation.isPending
	}
}
