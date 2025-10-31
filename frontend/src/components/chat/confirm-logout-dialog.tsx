'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface ConfirmLogoutDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	isPending: boolean
}

export function ConfirmLogoutDialog({
	open,
	onOpenChange,
	onConfirm,
	isPending
}: ConfirmLogoutDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className='sm:max-w-sm'>
				<div className='flex flex-col items-center gap-y-6 text-center'>
					<div className='space-y-1'>
						<AlertDialogTitle className='text-lg font-bold'>
							Вы уверены?
						</AlertDialogTitle>
						<AlertDialogDescription className='text-muted-foreground text-sm'>
							Сессия будет завершена и Вас перенаправит на
							страницу авторизации.
						</AlertDialogDescription>
					</div>
					<div className='flex w-full flex-col gap-3'>
						<AlertDialogCancel asChild>
							<Button variant='outline' className='w-full'>
								Отмена
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={onConfirm}
							disabled={isPending}
							className='w-full'
							asChild
						>
							<Button disabled={isPending}>Выйти</Button>
						</AlertDialogAction>
					</div>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	)
}
