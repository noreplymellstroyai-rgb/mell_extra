'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'

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
			<AlertDialogContent onOpenAutoFocus={e => e.preventDefault()}>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Вы уверены, что хотите выйти?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Ваша сессия будет завершена, и вы будете перенаправлены
						на страницу входа.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отмена</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm} disabled={isPending}>
						{isPending ? 'Выход...' : 'Выйти'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
